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
        publicPath,
        path: path.resolve("./dist"),
        filename: "[name].min.js",
        sourceMapFilename: "[file].map",
        library: 'Dark',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "[name].min.css"
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /map.min\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
            canPrint: true
        }),
        new HtmlWebpackPlugin({
            title: "dark&light",
            css: "<link rel=\"stylesheet\" href=\"dark.min.css\"/>",
            template: "!!ejs-loader!src/client/index.html",
            inject: false,
            filename: 'index.html'
        })
    ]
});

if (process.env.npm_config_report) {
    config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config;
