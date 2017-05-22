const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin')

const devConfig = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    bundle: './app.js',
    worker: './worker.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: /src/,
      use: 'babel-loader'
    }, {
      test: /\.scss$/,
      include: /styles/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { url: false } },
        'postcss-loader',
        'sass-loader'
      ]
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    overlay: {
      errors: true,
      warnings: true
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: false
    })
  ]
}

const prodConfig = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    bundle: './app.js',
    worker: './worker.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/codeck/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: /src/,
      use: 'babel-loader'
    }, {
      test: /\.scss$/,
      include: /styles/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: { url: false } },
          'postcss-loader',
          'sass-loader'
        ]
      })
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: false
    }),
    new ExtractTextPlugin('styles.css'),
    new StyleExtHtmlWebpackPlugin({ position: 'head-bottom' }),
    new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8: true, keep_fnames: true },
      compress: { screw_ie8: true },
      comments: false
    })
  ]
}

module.exports = (env) => (env === 'dev') ? devConfig : prodConfig
