/**
 * Rule loading shim for genie specific linting
 * See ./dev/eslint-rules/eslint-rules-genie for available rules
 * @license Apache-2.0
 */
const genieRules = require("./dev/eslint-rules/eslint-rules-genie");
module.exports = genieRules;
