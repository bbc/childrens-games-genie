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
        create: function(context) {
            return {
                CallExpression: function(node) {
                    if (!["setTimeout", "setInterval"].includes(node.callee.name)) {
                        return;
                    }

                    context.report({
                        message: "Phaser timers should be used instead of setTimeout/setInterval to maintain pause functionality",
                        node: node,
                    });
                },
            };
        },
    },
};
