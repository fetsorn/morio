import path from 'path';
import url from 'url';
import webpack from 'webpack';
import { createRequire } from 'module';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import 'dotenv/config';

const require = createRequire(import.meta.url);
const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default (env) => ({
  entry: './src/renderer/app.jsx',
  mode: process.env.production ? 'production' : 'development',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        safari10: true,
      },
    })],
  },
  output: {
    path: path.resolve(dirname, 'release/renderer'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __BUILD_MODE__: JSON.stringify(env.buildMode),
      __DEFAULT_URL__: JSON.stringify(env.defaultURL ?? process.env.defaultURL),
    }),

    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),

    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
      favicon: './public/favicon.ico',
    }),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src/renderer'),
      api: path.resolve(dirname, './src/api'),
    },
    fallback: {
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url'),
      timers: require.resolve('timers-browserify'),
    },
    extensions: ['.js', '.jsx', '.css'],
  },
});
