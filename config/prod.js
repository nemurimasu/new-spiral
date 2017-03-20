const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./base.js');

module.exports = function prod(env) {
  return webpackMerge(commonConfig(), {
    output: {
      filename: '[name].[chunkhash].js',
      sourceMapFilename: '[name].bundle.map'
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true
        },
        comments: false
      })
    ]
  });
};
