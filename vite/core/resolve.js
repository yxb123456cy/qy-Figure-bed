import { fileURLToPath, URL } from 'node:url';

export default {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '#ASSETS': fileURLToPath(new URL('./src/assets', import.meta.url)),
    '#LAYOUTS': fileURLToPath(new URL('./src/layouts', import.meta.url))
  }
};