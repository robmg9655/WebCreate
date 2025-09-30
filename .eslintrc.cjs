module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  rules: {
    // New JSX runtime doesn't require React in scope
  'react/react-in-jsx-scope': 'off',
  // Disallow explicit any by default
  '@typescript-eslint/no-explicit-any': 'error',
  // Disallow var-requires by default
  '@typescript-eslint/no-var-requires': 'error',
  // Warn for unused vars if prefixed with _
  '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }]
  },
  overrides: [
    {
      files: ['scripts/**', 'packages/mcp-tools/src/bin/**', 'services/**', 'apps/**/app/api/**'],
      env: { node: true },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
};
