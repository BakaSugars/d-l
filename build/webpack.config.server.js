const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require("path");
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const json = require('../package.json');
const version = json.version;

var config = {
    target: 'node',
    mode: 'production',
    entry: {
        dark: ["./src/server/index.ts"],
    },
    output: {
        path: path.resolve("./server"),
        filename: "[name].min.js",
        sourceMapFilename: "[file].map",
    },
    module: {
        rules: [{
            enforce: "pre",
            test: /\.ts?$/,
            exclude: ["/node_modules/"],
            use: [{
                loader: "awesome-typescript-loader",
                options: {
                  configFileName: path.resolve(__dirname, './tsconfig.server.json')
                }
            }, "source-map-loader"]
        }]
    },
    resolve: {
        alias: {
            '_src': path.resolve(__dirname, '../src'),
            '_util': path.resolve(__dirname, '../src/util'),
            '_client': path.resolve(__dirname, '../src/client'),
            '_server': path.resolve(__dirname, '../src/server')
        },
        extensions: [".ts", ".js"]
    },
    plugins: [
    ]
};

if (process.env.npm_config_report) {
    config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config;
