var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './views/js/src/login.js',
  output: { path: __dirname+'/views/js/bundle', filename: 'login.js' },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
};