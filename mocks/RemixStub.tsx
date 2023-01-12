import {RemixContext} from '@remix-run/react/dist/components';
import type {RemixContextObject} from '@remix-run/react/dist/entry';
import * as React from 'react';

// We are intentionally ignoring this eslint error because we want
// to use the version of react-router-dom that @remix-run/react depends on so
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryRouter, RouterProvider} from 'react-router-dom';
import type {RouteObject} from 'react-router-dom';

type Props = {
  children: React.ReactElement;
  /**
   * A function to provide data to the route element before it renders.
   * @see https://remix.run/docs/en/v1/route/loader for more information.
   */
  loader?: RouteObject['loader'];
  /**
   * A function that gets called whenever the app sends a non-get
   * submission ("post", "put", "patch", "delete") to your route.
   * @see https://remix.run/docs/en/v1/route/action for more information.
   */
  action?: RouteObject['action'];
};

/**
 * Component to provide `@remix-run` context to components being used in Unit Tests and Storybook.
 *
 * @example
 * ```{tsx}
 * // rendering a component that doesn't load any data
 * import NoteIndexPage from './index';
 * import RemixStub from 'mocks/RemixStub';
 *
 * <RemixStub>
 *   <NoteIndexPage />
 * </RemixStub>
 * ```
 *
 * @example
 * ```{tsx}
 * // rendering a component that loads a Note
 * import NoteDetailsPage from './$noteId';
 * import RemixStub from 'mocks/RemixStub';
 *
 * const loader = () => ({
 *   note: {
 *     id: '1',
 *     title: 'Grocery List',
 *     body: 'Olive oil, salmon, mayonnaise, basil pesto, and bread crumbs',
 *   },
 * });
 *
 * <RemixStub loader={loader}>
 *   <NoteDetailsPage />
 * </RemixStub>
 * ```
 */
export default function RemixStub(props: Props) {
  const route: RouteObject = {
    id: 'root',
    path: '/',
    element: props.children,
    action: props.action,
    loader: props.loader,
  };

  const context = createRemixContext(route);
  const router = createMemoryRouter([route]);

  return (
    <React.StrictMode>
      <RemixContext.Provider value={context}>
        <RouterProvider router={router} />
      </RemixContext.Provider>
    </React.StrictMode>
  );
}

/**
 * Mocks the context used by `<RemixContext.Provider />`
 *
 * Inspired by how `@remix-run/react` tests their components:
 *  https://github.com/remix-run/remix/blob/main/packages/remix-react/__tests__/components-test.tsx#L80-L98
 */
function createRemixContext(route: RouteObject) {
  return {
    routeModules: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      [route.id!]: {
        default: () => <>{route.element}</>,
      },
    },
    manifest: {
      routes: {
        foo: {
          hasLoader: !!route.loader,
          hasAction: !!route.action,
          hasCatchBoundary: false,
          hasErrorBoundary: false,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: route.id!,
          module: '',
        },
      },
      entry: {imports: [], module: ''},
      url: '',
      version: '',
    },
    future: {
      v2_meta: false,
      unstable_cssModules: true,
      unstable_cssSideEffectImports: true,
    },
  } as RemixContextObject;
}
