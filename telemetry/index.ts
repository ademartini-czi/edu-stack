import {RequestOptions} from 'http';
import {diag, DiagConsoleLogger, DiagLogLevel} from '@opentelemetry/api';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {registerInstrumentations} from '@opentelemetry/instrumentation';
import {ExpressInstrumentation} from '@opentelemetry/instrumentation-express';
import {HttpInstrumentation} from '@opentelemetry/instrumentation-http';
import {Resource} from '@opentelemetry/resources';
import {ConsoleSpanExporter, SimpleSpanProcessor} from '@opentelemetry/sdk-trace-base';
import {NodeTracerProvider} from '@opentelemetry/sdk-trace-node';
import {SemanticResourceAttributes} from '@opentelemetry/semantic-conventions';
import {ConsoleMetricExporter} from '@opentelemetry/sdk-metrics';

import pkg from 'package.json';

export default {
  setup: function () {
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
  },
};
