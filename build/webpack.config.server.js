const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require("path");
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.config.base');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const version = require('../package.json').version;

var config = merge(base, {
    output: {
        path: path.resolve("./server"),
        filename: "[name].min.js",
        sourceMapFilename: "[file].map",
        library: 'Dark',
    },
    module: {
    },
    plugins: [
    ]
});

if (process.env.npm_config_report) {
    config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config;
