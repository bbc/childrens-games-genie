/**
 * @license Apache-2.0
 */
const Stub = {
    addToBackground: () => {},
};

const WithButtons = buttons => {
    return Object.assign({}, Stub, {
        addLayout: () => {
            return {
                buttons: buttons,
            };
        },
    });
};

export { Stub, WithButtons };
