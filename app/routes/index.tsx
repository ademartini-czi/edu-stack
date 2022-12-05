import {Link} from '@remix-run/react';

import {useOptionalUser} from '~/utils';

export default function Index() {
  const user = useOptionalUser();
  return (
    <div>
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between px-2 pt-6 sm:px-6">
        <Link className="text-4xl" to="/">
          😺 <span className="hidden sm:inline">Cat Frands</span>
        </Link>
        <div className="flex gap-4">
          {user ? (
            <Link
              className="rounded-md border bg-white px-4 py-3 font-medium text-blue-700 hover:bg-blue-50"
              to="/notes"
            >
              View frands
            </Link>
          ) : (
            <>
              <Link
                className="rounded-md border bg-white px-4 py-3 font-medium text-blue-700 hover:bg-blue-50"
                to="/join"
              >
                Sign up
              </Link>
              <Link
                className="rounded-md border bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
                to="/login"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </nav>
      <main className="mx-auto max-w-3xl py-12 sm:py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
          Keep track of all your favorite cats
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
          Who are you kidding... they're all you're favorite!
        </p>
      </main>
    </div>
  );
}
