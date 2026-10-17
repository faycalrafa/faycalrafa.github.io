// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://faycalrafa.github.io',
  base: '/',
  output: 'static',
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  build: {
    format: 'directory',
  },
});
