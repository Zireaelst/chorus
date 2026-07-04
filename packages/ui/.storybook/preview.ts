import type { Preview } from '@storybook/react'
import '../src/globals.css'
import '../src/tokens/colors.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {},
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--color-canvas)' },
        { name: 'dark', value: '#0A0A0A' }, // hardcoded dark canvas for background
      ],
    },
  },
}

export default preview
