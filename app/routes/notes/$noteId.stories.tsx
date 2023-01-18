import type {Meta, StoryObj} from '@storybook/react';
import NoteDetailsPage from './$noteId';
import RemixStub from 'tests/RemixStub';

const loader = () => ({
  note: {
    id: '1',
    title: 'Grocery List',
    body: 'Olive oil, salmon, mayonnaise, basil pesto, and bread crumbs',
  },
});

export default {
  component: NoteDetailsPage,
} as Meta;

export const Default: StoryObj = {
  render: () => (
    <RemixStub loader={loader}>
      <NoteDetailsPage />
    </RemixStub>
  ),
};
