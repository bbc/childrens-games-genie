/**
 * Rule loading shim for genie specific linting
 * See ./dev/eslint-rules/eslint-rules-genie for available rules
 */
//const genieRules = require("./dev/eslint-rules/eslint-rules-genie");


const genieRules = {
    "disallow-timers": {
        meta: {
            docs: {
                description: "Disallow setTimeout",
                category: "Genie Restrictions",
                recommended: true,
            },
            schema: [],
        },
        create: context => ({
            CallExpression: node => {
                if (!["setTimeout", "setInterval"].includes(node.callee.name)) {
                    return;
                }

                context.report({
                    message: "To maintain pause functionality Phaser timers should be used over setTimeout/setInterval",
                    node: node,
                });
            },
        }),
    },
};

module.exports = genieRules;
