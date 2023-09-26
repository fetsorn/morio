module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false, targets: { safari: '12' } }],
    '@babel/preset-react',
  ],
};
