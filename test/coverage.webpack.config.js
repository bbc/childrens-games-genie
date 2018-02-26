/*jshint esversion: 6 */
var webpackConfig = require("../build-scripts/webpack.config");
const webpack = require("webpack");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    module: {
        rules: webpackConfig.module.rules.concat([
            {
                enforce: "post",
                test: /\.tsx?$/,
                include: /(src)/,
                exclude: /(node_modules|resources\/js\/vendor)/,
                loader: "istanbul-instrumenter-loader",
            },
        ]),
    },
    resolve: webpackConfig.resolve,
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            workers: ForkTsCheckerWebpackPlugin.ONE_CPU,
        }),
    ],
};
