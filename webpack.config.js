const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './dashboard/dashboard.html',
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  entry: './dashboard/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'es2015']
          }
        }
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ use: 'css-loader' })
      },
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new ExtractTextPlugin("styles.css"),
  ]
};
