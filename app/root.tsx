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
    {rel: 'apple-touch-icon', href: '/favicon.ico'},
    {rel: 'stylesheet', href: tailwindStylesheetUrl},
    {rel: 'stylesheet', href: edsVariablesUrl},
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    {rel: 'stylesheet', href: cssBundleHref!},
  ];
};

export async function loader({request}: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  return (
    <html className="h-full" lang="en">
      <head>
        <title>Edu App</title>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
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
