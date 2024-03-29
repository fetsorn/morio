const process = require('process');

module.exports = {
  packagerConfig: {
    icon: './public/icon',
    electronZipDir: process.env.electron_zip_dir,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        icon: './public/icon.png',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin',
        'win32',
        'linux',
      ],
      icon: './public/icon',
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: './public/icon.png',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: './public/icon.png',
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        devContentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self'; connect-src 'self' https://source.qualifiedself.org; frame-src 'self'; img-src 'self' https://source.qualifiedself.org https://i.imgur.com; media-src 'self' https://source.qualifiedself.org; object-src 'self' https://source.qualifiedself.org",
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              name: 'main_window',
              html: './src/renderer/index.html',
              js: './src/renderer/app.jsx',
            },
          ],
        },
      },
    },
  ],
};
