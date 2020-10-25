module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  plugins: ['jest'],
  env: {
    es6: true,
    'jest/globals': true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
};
