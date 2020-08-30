const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");
const merge = require('webpack-merge');
const base = require('./webpack.config.base');

const config = merge(base, {
    output: {
        filename: "[name].js",
        chunkFilename: '[name].js',
        sourceMapFilename: "[file].map",
        // devtoolModuleFilenameTemplate: function (info) {
        //     return "file:///" + info.absoluteResourcePath;
        // },
        library: 'Dark',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            { test: /\.css$/, loaders: ["style-loader", "css-loader"] }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "dark&light",
            css: "",
            template: "!!ejs-loader!src/client/index.html",
            inject: false
        }),
        // new DashboardPlugin(),
        // new webpack.HotModuleReplacementPlugin()
]
    // devServer: {
    //     contentBase: path.join(__dirname, "../"),
    //     compress: true,
    //     host: '0.0.0.0',
    //     disableHostCheck: true,
    //     port: 8888,
    //     hot: true
    // }
});

module.exports = config;