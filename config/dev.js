const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const DashboardPlugin = require('webpack-dashboard/plugin');
const commonConfig = require('./base.js');

module.exports = function prod(env) {
  return webpackMerge(commonConfig(), {
    devServer: {
      contentBase: path.join(__dirname, '../dist'),
      port: 9000,
      hot: true,
      overlay: true
    },
    devtool: 'inline-source-map',
    plugins: [
      new DashboardPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ]
  });
};
