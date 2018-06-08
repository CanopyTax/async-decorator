/* eslint-env node */
let webpack = require("webpack");
let path = require("path");

module.exports = {
  entry: {
    "rx4": "./src/rx4.js",
    "rx5": "./src/rx5.js",
    "rx6": "./src/rx6.js",
  },
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "."),
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: "babel-loader",
      }
    ],
  },
  devtool: "source-map",
  externals: [
    /^react$/,
    /^rx$/,
    /^rxjs$/,
  ],
};
