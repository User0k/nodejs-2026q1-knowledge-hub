import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    testMatch: ['**/*.unit.spec.ts', '**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'test'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/**/*.module.ts',
        'src/main.ts',
        'test/**/*',
        'prisma/**/*',
      ],
      thresholds: {
        lines: 90,
        branches: 85,
        functions: 85,
        statements: 90,
      },
      all: true,
    },
    environment: 'node',
    setupFiles: [],
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      tsconfigFile: './tsconfig.json',
    }),
  ],
});
