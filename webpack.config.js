const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'todo',
      template: './dist/index.html'
    }),
    new NodePolyfillPlugin(),

  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    port: 3000,  // You can change this port to any port you prefer
    open: true, 
    static: "./src" // Open the default browser when the server starts
  },  
  resolve: {
    fallback: {
      // "path": false,
      // "util": false,
      // "assert": false,
      // "stream": false,
      // "constants": false,
      "fs": false,  
    }
  }
};