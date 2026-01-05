/* ESLINT CONFIG FROM NEXTJS DOCS  */
/* https://nextjs.org/docs/app/api-reference/config/eslint */
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        // ignores unused variables starting with _, e.g _error
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    '**/.next/',
    '**/test/',
    '**/out/',
    '**/build/',
    '**/dist/',
    '**/infra/',
    '**/node_modules/',
    '**/.cache/',
    '**/.eslintcache',
    '**/*.generated.*',
    '**/*.min.*',
    '**/package-lock.json',
    '**/pnpm-lock.yaml',
    '**/yarn.lock',
    'prisma/*.db',
    'prisma/migrations/',
    '**/.DS_Store',
    '**/*.pem',
    '**/src/lib/prisma/generated',
    'next.config.mjs', // Stops 'process' is not defined eslint error by ignoring
    'jest.config.js',
  ]),
]);

export default eslintConfig;
