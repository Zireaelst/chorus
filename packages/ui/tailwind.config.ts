import type { Config } from 'tailwindcss'
import sharedConfig from '@chorus/config/tailwind-preset'

const config: Pick<Config, 'presets' | 'content'> = {
  content: ['./src/**/*.tsx'],
  presets: [sharedConfig],
}

export default config
