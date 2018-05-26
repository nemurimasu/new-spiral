const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
  output: {
    filename: '[name].[chunkhash].js',
    sourceMapFilename: '[name].bundle.map'
  }
});
