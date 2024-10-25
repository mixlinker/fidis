import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      base: './frontend/',
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
          '/fidis': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/fidis/, ''),
            target: 'https://v8.mixyun.top:4433/fidis/',
            ws: true,
          },
        },
      },
    },
  };
});
