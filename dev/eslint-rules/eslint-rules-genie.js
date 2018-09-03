/**
 * Local rule sets for Genie.
 *
 * @example To override the disallow timers rule:
 *      // eslint-disable-next-line local-rules/disallow-timers
 * @license Apache-2.0
 */
module.exports = {
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
    "require-license": {
        meta: {
            docs: {
                description: "Require a license tag for each file",
                category: "Genie Restrictions",
                recommended: true,
            },
            schema: [],
        },
        create: context => {
            return {
                Program() {
                    const sourceCode = context.getSourceCode();
                    const comments = sourceCode.getAllComments();
                    const blockComments = comments.filter(comment => comment.type === "Block");
                    const licensePresent = blockComments.some(comment => comment.value.includes("@license Apache-2.0"));

                    if (licensePresent) {
                        return;
                    }

                    context.report({
                        message: "@licence Apache-2.0 required in block comment (/**   */) at top of file",
                        loc: { line: 1, column: 0 },
                    });
                },
            };
        },
    },
};
