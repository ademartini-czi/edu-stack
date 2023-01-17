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
} as Meta;

export const Default: StoryObj = {};
