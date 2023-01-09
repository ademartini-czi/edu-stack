import edsVariablesUrl from '@chanzuckerberg/eds/lib/tokens/css/variables.css';
import {cssBundleHref} from '@remix-run/css-bundle';
import type {LinksFunction, LoaderArgs, MetaFunction} from '@remix-run/node';
import {json} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import {getUser} from './session.server';
import tailwindStylesheetUrl from './styles/tailwind.css';

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: tailwindStylesheetUrl},
    {rel: 'stylesheet', href: edsVariablesUrl},
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    {rel: 'stylesheet', href: cssBundleHref!},
  ];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Edu App',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({request}: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  return (
    <html className="h-full" lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
