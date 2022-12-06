import {Link} from '@remix-run/react';
import clsx from 'clsx';
import type {ComponentProps} from 'react';

type Props = ComponentProps<typeof Link> & {
  type?: 'primary' | 'secondary';
};

export default function LinkThatLooksLikeButton({
  type = 'secondary',
  ...other
}: Props) {
  return (
    <Link
      className={clsx(
        'rounded-md border px-4 py-3 font-medium',
        type === 'secondary' && 'bg-white text-blue-700 hover:bg-blue-50',
        type === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
      )}
      {...other}
    />
  );
}
