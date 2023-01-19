import {composeStories} from '@storybook/react';
import {render, screen} from '@testing-library/react';
import * as stories from './new.stories';

const {Default} = composeStories(stories);

describe('NewNotePage', () => {
  it('renders two input fields', () => {
    render(<Default />);

    expect(screen.getByText('Title:')).toBeInTheDocument();
    expect(screen.getByText('Body:')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument();
  });
});
