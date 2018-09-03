/**
 * @license Apache-2.0
 */
const Stub = {
    panels: [{}],
};

//
// See "Builder pattern".
//
const WithPanels = panels => {
    return Object.assign({}, Stub, { panels: panels });
};

export { Stub, WithPanels };
