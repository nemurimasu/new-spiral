var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = function base() {
  return {
    entry: {
      'main': [
        './node_modules/webvr-polyfill/build/webvr-polyfill',
        './src/main.js'
      ]
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/',
      sourceMapFilename: '[name].bundle.map'
    },
    resolve: {
      extensions: ['.js', '.json'],
      modules: [path.join(__dirname, 'src'), 'node_modules']
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }, {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader']
      }, {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader'
      }, {
        test: /\.(frag|vert)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader']
      }],
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
          return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.ejs',
        chunksSortMode: 'dependency'
      })
    ],
    devtool: 'cheap-module-source-map'
  }
};
