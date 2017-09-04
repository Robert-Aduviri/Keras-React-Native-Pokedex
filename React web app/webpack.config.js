var webpack = require('webpack');
// var Keras = require('keras-js');
// var Sharp = require('sharp');

// var nodeExternals = require('webpack-node-externals');

// var path = require('path');
// var fs = require('fs');

// var nodeModules = {};
// fs.readdirSync('node_modules')
//   .filter(function(x) {
//     return ['.bin'].indexOf(x) === -1;
//   })
//   .forEach(function(mod) {
//     nodeModules[mod] = 'commonjs ' + mod;
//   });

module.exports = {
  entry: [
    './src/index.js',
  ],
  // target: 'node',
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  // externals: nodeModules,
  // plugins: [
  //   new webpack.DefinePlugin({
  //       'process.env.NODE_ENV': JSON.stringify('development')
  //   })
  // ],
  // externals: [nodeExternals()],
  externals: {
    'sharp': 'window["sharp"]',
    'keras-js': 'window["keras-js"]'
    // 'sharp': 'Sharp',
    // 'keras-js': 'Keras'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  },
  // node: {
  //   fs: "empty"
  // }
  
};
