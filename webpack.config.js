const path = require('path');

const packageJson = require('./package.json');
const nodeExternals = require('webpack-node-externals');


const env = process.env.NODE_ENV;

const webpackConfig = {
  target: 'node',
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    index: { import: './index.js', filename: '[name].js' },
    extractVariablesLessPlugin: { import: './extractVariablesLessPlugin.js', filename: '[name].js' },
    antdSassLoader: { import: './antdSassLoader.js', filename: '[name].js' },
    antdLessLoader: { import: './antdLessLoader.js', filename: '[name].js' },
    loaderUtils: { import: './loaderUtils.js', filename: '[name].js' },
    utils: { import: './utils.js', filename: '[name].js' },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'build'),
    library: 'SharkrThemePlugin',
    libraryTarget: 'umd',
    clean: true,
  },
  externals: [
    nodeExternals(),
    'antd',
    'less',
    'less-loader',
    'sass-loader',
  ],
};


module.exports = webpackConfig;
