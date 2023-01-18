import type {Meta, StoryObj} from '@storybook/react';
import {within, userEvent} from '@storybook/testing-library';
import NewNotePage from './new';
import RemixStub from 'tests/RemixStub';

export default {
  component: NewNotePage,
} as Meta;

export const Default: StoryObj = {
  render: () => (
    <RemixStub>
      <NewNotePage />
    </RemixStub>
  ),
};

export const EmptySubmission: StoryObj = {
  render: () => (
    <RemixStub
      action={() => ({
        errors: {
          body: 'The body field is required, please provide some text.',
          title: 'The title field is required, please provide some text.',
        },
      })}
    >
      <NewNotePage />
    </RemixStub>
  ),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const submitBtn = await canvas.findByRole('button', {name: 'Save'});
    await userEvent.click(submitBtn);
  },
};
