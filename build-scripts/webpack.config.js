/*jshint esversion: 6 */
const path = require("path");
const webpack = require("webpack");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

var phaserModule = path.join(__dirname, "../node_modules/phaser-ce/");
var phaser = path.join(phaserModule, "build/custom/phaser-split.js"),
    pixi = path.join(phaserModule, "build/custom/pixi.js"),
    p2 = path.join(phaserModule, "build/custom/p2.js");

module.exports = {
    context: path.join(__dirname, ".."),
    devtool: "cheap-module-eval-source-map",
    entry: "./src/main.ts",
    mode: "development",
    output: {
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
        filename: "output/main.js",
    },
    module: {
        rules: [
            {
                test: /(phaser-split|p2|pixi).js$/,
                include: /(node_modules[\\\/]phaser-ce)/,
                use: {
                    loader: "script-loader",
                },
            },
            {
                test: /\.tsx?$/,
                include: /(src|test)/,
                use: "ts-loader",
            },
            {
                test: /\.js$/,
                include: /(src|test)/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-core",
                    query: {
                        presets: [["env", { targets: { ie: 11 } }]],
                        cacheDirectory: true,
                    },
                },
            },
        ],
    },
    resolve: {
        alias: {
            "phaser-ce": phaser,
            "pixi.js": pixi,
            p2: p2,
        },
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"],
        plugins: [],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            workers: ForkTsCheckerWebpackPlugin.ONE_CPU,
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: null, // if no value is provided the sourcemap is inlined
            test: /\.(ts|js)x?$/i, // process .js, .tsx and .ts files only
            moduleFilenameTemplate: "[absolute-resource-path]",
        }),
    ],
};
