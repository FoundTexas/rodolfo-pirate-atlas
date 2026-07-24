import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://foundtexas.net',
  output: 'static',
  trailingSlash: 'always',
  vite: {
    build: {
      target: 'es2022',
    },
  },
});
