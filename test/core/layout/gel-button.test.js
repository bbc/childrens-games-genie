/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { GelButton } from "../../../src/core/layout/gel-button";

describe("Layout - GEL Button", () => {
    let mockScene;
    let mockConfig;
    let mockMetrics;

    beforeEach(() => {
        mockMetrics = {
            stageWidth: null,
            stageHeight: 600,
            borderPad: 12,
            isMobile: false,
            buttonPad: 24,
            buttonMin: 64,
            hitMin: 70,
            horizontals: { left: null, center: 0, right: null },
            safeHorizontals: { left: -400, center: 0, right: 400 },
            verticals: { top: -300, middle: 0, bottom: 300 },
        };

        mockConfig = {
            group: "topLeft",
            title: "Exit",
            key: "exit",
            ariaLabel: "Exit Game",
            order: 0,
            id: "__exit",
            channel: "gel-buttons",
        };

        mockScene = {
            sys: {
                queueDepthSort: () => {},
                anims: { once: () => {} },
                textures: {
                    get: jest.fn(() => ({
                        get: jest.fn(() => new Map()),
                    })),
                },
                game: { renderer: {} },
                input: { enable: () => {} },
            },
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Initialisation", () => {
        test("creates a GEL button with basic properties", () => {
            const gelButton = new GelButton(mockScene, 0, 0, mockMetrics, mockConfig);
            expect(gelButton._id).toBe(mockConfig.key);
            expect(gelButton._isMobile).toBe(mockMetrics.isMobile);
            expect(gelButton.positionOverride).toBe(mockConfig.positionOverride);
        });

        test("sets the button hit area", () => {
            const gelButton = new GelButton(mockScene, 0, 0, mockMetrics, mockConfig);
            gelButton.setHitArea = jest.fn();
            gelButton.constructor(mockScene, 0, 0, mockMetrics, mockConfig);
            expect(gelButton.setHitArea).toHaveBeenCalledWith(mockMetrics);
        });

        test("sets the sprite to be interactive", () => {
            const gelButton = new GelButton(mockScene, 0, 0, mockMetrics, mockConfig);
            gelButton.setInteractive = jest.fn();
            gelButton.constructor(mockScene, 0, 0, mockMetrics, mockConfig);
            expect(gelButton.setInteractive).toHaveBeenCalled();
        });

        test("sets the button states", () => {
            const gelButton = new GelButton(mockScene, 0, 0, mockMetrics, mockConfig);
            gelButton.on = jest.fn();
            gelButton.constructor(mockScene, 0, 0, mockMetrics, mockConfig);
            expect(gelButton.on).toHaveBeenCalledWith("pointerdown", expect.any(Function));
            expect(gelButton.on).toHaveBeenCalledWith("pointerup", expect.any(Function));
            expect(gelButton.on).toHaveBeenCalledWith("pointerout", expect.any(Function));
            expect(gelButton.on).toHaveBeenCalledWith("pointerover", expect.any(Function));
        });
    });
});
