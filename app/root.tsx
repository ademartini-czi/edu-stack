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

// tailwind.css is generated as part of the build process, and won't exist if the app has never
// been ran. Ignore the lint error if it's missing, so we can lint before running the build.
// eslint-disable-next-line import/no-unresolved
import tailwindStylesheetUrl from './styles/tailwind.css';

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: tailwindStylesheetUrl}];
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
