/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as visibleLayer from "../../src/core/visible-layer.js";

describe("Visible Layer", () => {
    describe("get method", () => {
        test("returns the current game screen if there are no overlays", () => {
            const fakeGameInstance = { state: { current: "this-is-the-current-screen" } };
            const fakeContext = { popupScreens: [] };
            const actualGameScreen = visibleLayer.get(fakeGameInstance, fakeContext);
            expect(actualGameScreen).toEqual("this-is-the-current-screen");
        });

        test("returns the current overlay screen if there are any", () => {
            const fakeGameInstance = { state: { current: "this-is-the-current-screen" } };
            const fakeContext = { popupScreens: ["pause", "how-to-play"] };
            const actualGameScreen = visibleLayer.get(fakeGameInstance, fakeContext);
            expect(actualGameScreen).toEqual("how-to-play");
        });
    });
});
