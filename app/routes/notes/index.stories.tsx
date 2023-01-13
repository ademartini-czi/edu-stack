import type {Meta, StoryObj} from '@storybook/react';
import NoteIndexPage from './index';
import RemixStub from 'tests/RemixStub';

export default {
  component: NoteIndexPage,
  render: () => (
    <RemixStub>
      <NoteIndexPage />
    </RemixStub>
  ),
} as Meta<Args>;

type Args = React.ComponentProps<typeof NoteIndexPage>;

export const Default: StoryObj<Args> = {};
