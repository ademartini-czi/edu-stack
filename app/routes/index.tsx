import {Heading} from '@chanzuckerberg/eds';
import {Link} from '@remix-run/react';
import LinkThatLooksLikeButton from '~/components/LinkThatLooksLikeButton';
import {useOptionalUser} from '~/utils';

export default function Index() {
  const user = useOptionalUser();
  return (
    <div>
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between px-2 pt-6 sm:px-6">
        <Link className="text-4xl" to="/">
          😺 <span className="hidden sm:inline">Cat Notes</span>
        </Link>
        <div className="flex gap-4">
          {user ? (
            <LinkThatLooksLikeButton to="/notes" type="secondary">
              View notes
            </LinkThatLooksLikeButton>
          ) : (
            <>
              <LinkThatLooksLikeButton to="/join" type="secondary">
                Sign up
              </LinkThatLooksLikeButton>
              <LinkThatLooksLikeButton to="/login" type="primary">
                Log in
              </LinkThatLooksLikeButton>
            </>
          )}
        </div>
      </nav>
      <main className="mx-auto max-w-3xl py-12 sm:py-24">
        <Heading
          className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl"
          size="h1"
        >
          Keep track of notes... for your cats.
        </Heading>
        <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </main>
    </div>
  );
}
