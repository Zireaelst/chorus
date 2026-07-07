import type { Config } from 'tailwindcss'
// @ts-ignore
import generatedTheme from '@chorus/design-tokens/build/tailwind-theme.js'

const preset: Config = {
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      ...generatedTheme.extend,
      colors: generatedTheme.extend.colors,
      fontFamily: generatedTheme.extend.fontFamily,
      fontSize: generatedTheme.extend.fontSize,
      borderRadius: generatedTheme.extend.borderRadius,
      transitionDuration: generatedTheme.extend.transitionDuration,
      transitionTimingFunction: generatedTheme.extend.transitionTimingFunction,
      boxShadow: generatedTheme.extend.boxShadow
    }
  },
  plugins: [],
}

export default preset
