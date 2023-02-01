import {RequestOptions} from 'http';
import {Attributes, Counter, diag, DiagConsoleLogger, DiagLogLevel, Meter} from '@opentelemetry/api';
import otel from '@opentelemetry/api';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {registerInstrumentations} from '@opentelemetry/instrumentation';
import {ExpressInstrumentation} from '@opentelemetry/instrumentation-express';
import {HttpInstrumentation} from '@opentelemetry/instrumentation-http';
import {Resource} from '@opentelemetry/resources';
import {ConsoleSpanExporter, SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';
import {NodeTracerProvider} from '@opentelemetry/sdk-trace-node';
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions';
import {ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader} from '@opentelemetry/sdk-metrics';

import pkg from 'package.json';

export interface Counters {
  failedLogins: Counter<Attributes>;
}

export interface Instruments {
  counters: Counters;
}

export default class Telemetry {
  private static _instance: Telemetry;

  private _instruments: Instruments;
  private _defaultMeter: Meter;

  private static setupTracing() {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

    const exporter = new OTLPTraceExporter({
      url: `${process.env.OTLP_ENDPOINT}/v1/traces`,
    });

    const provider = new NodeTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: pkg.name,
      }),
    });

    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

    if (process.env.NODE_ENV === 'development') {
      provider.addSpanProcessor(
        new SimpleSpanProcessor(new ConsoleSpanExporter()),
      );
    }

    provider.register();

    //This is terrible, we need a better solution.  The socket is null on mocked
    //requests and it causes an exception.  Maybe we can mock the socket somehow.
    function ignoreOutgoingRequestHook(req: RequestOptions): boolean {
      return req.hostname === 'example.com';
    }

    registerInstrumentations({
      instrumentations: [
        new HttpInstrumentation({
          ignoreOutgoingRequestHook,
        }),
        new ExpressInstrumentation(),
      ],
    });
  }

  private static setupMetrics() {
    const resource = Resource.default().merge(
      new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: pkg.name,
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0', //Todo: Pull real version in
      }),
    );

    const myServiceMeterProvider = new MeterProvider({
      resource: resource,
    });

    if (process.env.NODE_ENV === 'development') {
      const metricReader = new PeriodicExportingMetricReader({
        exporter: new ConsoleMetricExporter(),
      });
      myServiceMeterProvider.addMetricReader(metricReader);
    }

    // Set this MeterProvider to be global to the app being instrumented.
    otel.metrics.setGlobalMeterProvider(myServiceMeterProvider);
  }

  private constructor() {
    Telemetry.setupTracing();
    Telemetry.setupMetrics();

    this._defaultMeter = otel.metrics.getMeter('default');
    this._instruments = {
      counters: {
        failedLogins: this._defaultMeter.createCounter('failed-logins'),
      },
    };
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public static get counters() {
    return Telemetry.Instance._instruments.counters;
  }

  public static init() {
    Telemetry.Instance;
  }
}
