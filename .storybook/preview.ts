import type {Parameters} from '@storybook/react';
import '../app/styles/tailwind.css';

export const parameters: Parameters = {
  /**
   * Explicitly set Storybook's background to light because if developers
   * have set their preferred color scheme as dark, Storybook will use the
   * dark theme and the Stories won't look good rednered on dark backgrounds.
   */
  backgrounds: {default: 'light'},
};
