import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync } from 'fs';

const copyCollections = () => {
  mkdirSync('dist/server/collections', { recursive: true });
  copyFileSync('src/server/collections/loginSettings.ts', 'dist/server/collections/loginSettings.ts');
};

const copyLocale = () => {
  mkdirSync('dist/locale', { recursive: true });
  ['en-US', 'vi-VN', 'zh-CN'].forEach((l) => {
    copyFileSync(`src/locale/${l}.json`, `dist/locale/${l}.json`);
  });
};

export default defineConfig([
  // Server build (CommonJS)
  {
    entry: ['src/server/index.ts'],
    outDir: 'dist/server',
    format: ['cjs'],
    platform: 'node',
    target: 'es2020',
    dts: true,
    sourcemap: false,
    clean: true,
    external: ['@nocobase/server', '@nocobase/database', '@nocobase/test'],
    onSuccess: async () => {
      copyCollections();
      copyLocale();
    },
  },
  // Client build (CJS — NocoBase plugin loader expects .js)
  {
    entry: ['src/client/index.tsx'],
    outDir: 'dist/client',
    format: ['cjs'],
    platform: 'browser',
    target: 'es2020',
    dts: false,
    sourcemap: false,
    clean: false,
    external: [
      '@nocobase/client-v2',
      '@nocobase/plugin-auth/client',
      '@nocobase/utils/client',
      'react', 'react-dom', 'react-router-dom',
      'antd', '@formily/react', '@emotion/css',
      'react-i18next', 'lodash',
    ],
    loader: { '.tsx': 'tsx' },
  },
  // Root index
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['cjs'],
    platform: 'node',
    target: 'es2020',
    dts: true,
    sourcemap: false,
    clean: false,
    external: ['@nocobase/server', '@nocobase/database', '@nocobase/test'],
  },
]);