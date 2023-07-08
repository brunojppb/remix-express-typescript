module.exports = {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 80,
  proseWrap: 'never',
  trailingComma: 'es5',
  overrides: [
    { files: '*.md', options: { proseWrap: 'always' } },
    { files: '*.mdx', options: { proseWrap: 'always' } },
  ],
}
