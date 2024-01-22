const path = require('node:path');

/* eslint-env node */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    ecmaVersion: 2022,
    tsconfigRootDir: path.join(__dirname, '..', '..'),
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort', 'security', 'sonarjs', 'jest', 'unicorn'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    //'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:prettier/recommended',
    'plugin:security/recommended-legacy',
    'plugin:you-dont-need-lodash-underscore/compatible',
    'plugin:sonarjs/recommended',
    'plugin:jest/recommended',
    'plugin:unicorn/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    'jest/globals': true,
    es2022: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'unicorn/prevent-abbreviations': 'off',
    'jest/expect-expect': 'off',
    'unicorn/prefer-top-level-await': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': ['error'],
    'security/detect-object-injection': ['error'],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'max-len': [
      'error',
      {
        code: 120,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreUrls: true,
      },
    ],
    'no-console': ['error'],
    complexity: ['error', 5],
    'spaced-comment': [2, 'always'],
  },
};
