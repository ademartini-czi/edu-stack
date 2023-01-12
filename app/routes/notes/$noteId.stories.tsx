import type {Meta, StoryObj} from '@storybook/react';
import NoteDetailsPage from './$noteId';
import RemixStub from 'mocks/RemixStub';

const loader = () => ({
  note: {
    id: '1',
    title: 'Grocery List',
    body: 'Olive oil, salmon, mayonnaise, basil pesto, and bread crumbs',
  },
});

export default {
  title: 'app/routes/notes/NoteDetailsPage',
  component: NoteDetailsPage,
  render: () => (
    <RemixStub loader={loader}>
      <NoteDetailsPage />
    </RemixStub>
  ),
} as Meta<Args>;

type Args = React.ComponentProps<typeof NoteDetailsPage>;

export const Default: StoryObj<Args> = {};
