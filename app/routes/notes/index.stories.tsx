import type {Meta, StoryObj} from '@storybook/react';
import NoteIndexPage from './index';
import RemixStub from 'mocks/RemixStub';

export default {
  title: 'app/routes/notes/NoteIndexPage',
  component: NoteIndexPage,
  render: () => (
    <RemixStub>
      <NoteIndexPage />
    </RemixStub>
  ),
} as Meta<Args>;

type Args = React.ComponentProps<typeof NoteIndexPage>;

export const Default: StoryObj<Args> = {};
