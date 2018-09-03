/**
 * @license Apache-2.0
 */
var testsContext = require.context(".", true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
