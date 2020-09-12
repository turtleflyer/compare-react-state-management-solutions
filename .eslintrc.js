const defRules = {
  'comma-dangle': 'off',
  'func-call-spacing': 'off',
  'function-paren-newline': 'off',
  'implicit-arrow-linebreak': 'off',
  'import/no-extraneous-dependencies': 'off',
  'linebreak-style': 'off',
  'max-len': 'off',
  'no-confusing-arrow': 'off',
  'no-nested-ternary': 'off',
  'no-plusplus': 'off',
  'no-prototype-builtins': 'off',
  'no-spaced-func': 'off',
  'object-curly-newline': 'off',
  'operator-linebreak': 'off',
  'import/extensions': 'off',
  'import/prefer-default-export': 'off',
  indent: 'off',
  'jsx-a11y/label-has-associated-control': ['error', { assert: 'either', depth: 2 }],
  'react/jsx-props-no-spreading': 'off',
  'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.tsx'] }],
  'react/destructuring-assignment': 'off',
  'react/jsx-curly-newline': 'off',
  'react/prop-types': 'off',
  'react/state-in-constructor': 'off',
};

module.exports = {
  overrides: [
    {
      files: ['**/*.js', '**/*.jsx', '**/*.json'],
      env: {
        browser: true,
        es2020: true,
      },
      extends: ['plugin:react/recommended', 'airbnb'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 11,
        sourceType: 'module',
      },
      plugins: ['react'],
      rules: { ...defRules },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.ts', '.tsx', '.d.ts'],
          },
        },
      },
      env: {
        browser: true,
        es2020: true,
      },
      extends: ['plugin:react/recommended', 'airbnb', 'plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 11,
        sourceType: 'module',
      },
      plugins: ['react', '@typescript-eslint'],
      rules: {
        ...defRules,
        '@typescript-eslint/ban-types': ['error', { types: { object: false } }],
        '@typescript-eslint/no-use-before-define': 'error',
        'no-use-before-define': 'off',
      },
    },
  ],
};
