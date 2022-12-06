import type {ActionArgs, LoaderArgs, MetaFunction} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, Link, useActionData, useSearchParams} from '@remix-run/react';
import * as React from 'react';

import {verifyLogin} from '~/models/user.server';
import {createUserSession, getUserId} from '~/session.server';
import {safeRedirect, validateEmail} from '~/utils';

export async function loader({request}: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
}

export async function action({request}: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');
  const remember = formData.get('remember');

  if (!validateEmail(email)) {
    return json(
      {errors: {email: 'Email is invalid', password: null}},
      {status: 400},
    );
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      {errors: {password: 'Password is required', email: null}},
      {status: 400},
    );
  }

  if (password.length < 8) {
    return json(
      {errors: {password: 'Password is too short', email: null}},
      {status: 400},
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      {errors: {email: 'Invalid email or password', password: null}},
      {status: 400},
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === 'on' ? true : false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: 'Login',
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/notes';
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form className="space-y-6" method="post">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                aria-describedby="email-error"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                autoComplete="email"
                autoFocus={true}
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                id="email"
                name="email"
                ref={emailRef}
                required
                type="email"
              />
              {actionData?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                aria-describedby="password-error"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                autoComplete="current-password"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                id="password"
                name="password"
                ref={passwordRef}
                required
                type="password"
              />
              {actionData?.errors?.password && (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>

          <input name="redirectTo" type="hidden" value={redirectTo} />
          <button
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            type="submit"
          >
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                id="remember"
                name="remember"
                type="checkbox"
              />
              <label
                className="ml-2 block text-sm text-gray-900"
                htmlFor="remember"
              >
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: '/join',
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
