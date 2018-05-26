var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: {
    'main': [
      './src/main.js'
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        name: 'vr',
        chunks: 'async'
      }
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules\/(?!regl-vr\/)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }, {
      test: /\.(frag|vert)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader']
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      chunksSortMode: 'dependency'
    })
  ],
};
