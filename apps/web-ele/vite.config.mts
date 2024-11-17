import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      base: '/frontend/',
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/fidis': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/fidis/, ''),
            target: 'https://v8.mixyun.top:4433/fidis/',
            ws: true,
          },
          '/mixservice': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/mixservice/, ''),
            target: 'https://v8.mixyun.top:4433/mixservice',
          },
        },
      },
    },
  };
});
