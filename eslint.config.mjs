import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  // Global ignores
  {
    ignores: [
      '**/.next/',
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
    ],
  },
  // Base recommended config
  js.configs.recommended,
  // Convert legacy configs using FlatCompat
  // Note: 'airbnb/hooks' is excluded because react-hooks plugin needs fixupPluginRules for ESLint 9
  ...compat.extends('eslint:recommended', 'airbnb', 'prettier'),
  // Note: Next.js config is not fully compatible with ESLint 9 flat config yet
  // Using FlatCompat for Next.js config may cause issues
  // You can manually add Next.js specific rules if needed
  // Main configuration for TypeScript and JavaScript files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': fixupPluginRules(reactHooks),
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // Add react-hooks rules from airbnb/hooks manually
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.tsx', '.jsx'],
        },
      ],
      'import/extensions': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      'import/prefer-default-export': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'jsx-a11y/aria-role': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'error',
      eqeqeq: 'error',
      'no-shadow': 'off',
      'no-unused-expressions': 'error',
      'no-use-before-define': [
        'error',
        {
          functions: false,
          classes: false,
        },
      ],
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: [
            'state',
            'acc',
            'accumulator',
            'e',
            'ctx',
            'context',
            'req',
            'request',
            'res',
            'response',
            '$scope',
            'staticContext',
          ],
        },
      ],
      'no-console': 'off',
      'consistent-return': 'off',
      'default-case': 'off',
      'no-case-declarations': 'off',
      'no-restricted-syntax': 'off',
      camelcase: 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/no-redundant-roles': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'react/no-array-index-key': 'off',
      'react/no-unstable-nested-components': 'warn',
      'no-nested-ternary': 'off',
      'react/button-has-type': 'off',
      'react/no-unescaped-entities': 'off',
      'react/destructuring-assignment': 'warn',
      'react/no-unused-prop-types': 'warn',
      'import/no-cycle': 'off',
      'import/order': 'off',
      'no-await-in-loop': 'off',
      'default-param-last': 'off',
      'func-names': [
        'warn',
        'as-needed',
        {
          generators: 'never',
        },
      ],
      'global-require': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'react/no-danger': 'off',
      'arrow-body-style': 'off',
      'prefer-destructuring': 'off',
      'no-useless-escape': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/test/**/*',
            '**/tests/**/*',
            '**/__tests__/**/*',
            '**/jest.config.js',
            '**/jest.setup.js',
          ],
        },
      ],
    },
  },
];
