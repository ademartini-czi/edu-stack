import type {Meta, StoryObj} from '@storybook/react';
import {within, userEvent} from '@storybook/testing-library';
import NewNotePage from './new';
import RemixStub from 'mocks/RemixStub';

export default {
  title: 'app/routes/notes/NewNotePage',
  component: NewNotePage,
  render: () => (
    <RemixStub>
      <NewNotePage />
    </RemixStub>
  ),
} as Meta<Args>;

type Args = React.ComponentProps<typeof NewNotePage>;

export const Default: StoryObj<Args> = {};

const emptyAction = () => ({
  errors: {
    body: 'The body field is required, please provide some text.',
    title: 'The title field is required, please provide some text.',
  },
});
export const EmptySubmission: StoryObj<Args> = {
  render: () => (
    <RemixStub action={emptyAction}>
      <NewNotePage />
    </RemixStub>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const submitBtn = await canvas.findByRole('button', {name: 'Save'});

    await userEvent.click(submitBtn);
  },
};
