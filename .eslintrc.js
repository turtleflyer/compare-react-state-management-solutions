const defRules = {
  'no-nested-ternary': 'off',
  'no-plusplus': 'off',
  'import/extensions': 'off',
  'import/prefer-default-export': 'off',
  'jsx-a11y/label-has-associated-control': ['error', { assert: 'either', depth: 2 }],
  'react/destructuring-assignment': 'off',
  'react/jsx-curly-newline': 'off',
  'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.tsx'] }],
  'react/jsx-props-no-spreading': 'off',
  'react/prop-types': 'off',
  'react/state-in-constructor': 'off',
};

module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['airbnb', 'prettier', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: { ...defRules },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.ts', '.tsx', '.d.ts'],
          },
        },
      },
      extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      rules: {
        ...defRules,
        '@typescript-eslint/ban-types': ['error', { types: { object: false } }],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',
      },
    },
  ],
};
