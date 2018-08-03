export const create = goToScreen => {
    const qaMode = {
        testHarnessLayoutDisplayed: false,
        goToScreen,
    };

    return qaMode;
};
