import { defineConfig } from 'tsup';

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
  },
  // Client build (ESM for bundler consumption)
  {
    entry: ['src/client/index.tsx'],
    outDir: 'dist/client',
    format: ['esm'],
    platform: 'browser',
    target: 'es2020',
    dts: true,
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
