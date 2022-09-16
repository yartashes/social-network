module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript',
    // 'prettier',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: [
    'prettier',
  ],
  rules: {
    indent: ['error', 2],
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'no-shadow': 'off',
    'class-methods-use-this': 'off',
    'no-array-constructor': 'off',
    'react/jsx-filename-extension': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
}
