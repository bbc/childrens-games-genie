var checkCoverageFlag = process.argv.toString().includes("--coverage");
var webpackConfig = checkCoverageFlag
    ? require("./coverage.webpack.config")
    : require("../build-scripts/webpack.config.js");

module.exports = function(config) {
    config.set({
        // basePath: "",
        frameworks: ["mocha", "chai", "sinon"],
        files: [
            "../src/lib/phaser.js",
            "../test/**/*.spec.js",
        ],
        preprocessors: {
            "../src/lib/phaser.js": ["webpack"],
            "../test/**/*.spec.js": ["webpack"],
        },
        client: {
            mocha: {
                timeout: 20000, // 20 seconds - upped from 2 seconds
            },
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: "errors-only",
            noInfo: true,
        },
        coverageReporter: {
            type: "in-memory",
        },
        remapCoverageReporter: {
            "text-summary": null,
            html: "./coverage/html",
            cobertura: "./coverage/cobertura.xml",
            json: "./coverage/coverage.json",
            lcovonly: "./coverage/lcov.info",
        },
        reporters: checkCoverageFlag ? ["mocha", "coverage", "remap-coverage"] : ["mocha"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ["ChromeHeadless"],
        customLaunchers: {
            ChromeHeadlessNoWebGL: {
                base: "ChromeHeadless",
                flags: ["--disable-webgl"],
            },
        },
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        singleRun: true,
        concurrency: Infinity,
    });
};
