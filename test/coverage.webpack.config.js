/*jshint esversion: 6 */
var webpackConfig = require("../build-scripts/webpack.config");
const webpack = require("webpack");
const HappyPack = require("happypack");
const path = require("path");

webpackConfig.module.rules = webpackConfig.module.rules.concat([
    {
        test: /\.js$|\.jsx$/,
        use: {
            loader: 'istanbul-instrumenter-loader',
            options: { esModules: true }
        },
        enforce: 'post',
        include: path.resolve("./src/"),
        exclude: path.resolve("./src/lib/")
    },
]);
module.exports = webpackConfig;
