const webpack = require("webpack");
const path = require("path");
const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";
var config = {
    devtool: isProd ? false : "inline-source-map",
    entry: {
        dark: ["./src/client/index.ts"]
    },
    output: {
        filename: "[name].min.js",
        chunkFilename: '[name].js',
        sourceMapFilename: "[name].min.map",
        devtoolModuleFilenameTemplate: function (info) {
            return "file:///" + info.absoluteResourcePath;
        },
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{
                enforce: "pre",
                test: /\.ts?$/,
                exclude: ["/node_modules/"],
                use: ["awesome-typescript-loader", "source-map-loader"]
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.glsl$/,
                loader: "shader-loader"
            },
            {
                test: /\.(png|jpe?g|gif|svg|wasm)$/,
                loader: "url-loader?limit=8192"
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-es2015']
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
            },
        ]
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
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(nodeEnv)
            },
            __DEV__: JSON.stringify(!isProd),
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: true,
                    failOnHint: true
                }
            }
        })
    ]
};

module.exports = config;
