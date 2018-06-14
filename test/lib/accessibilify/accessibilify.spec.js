import { assert, expect } from "chai";
import * as sinon from "sinon";
import { accessibilify } from "../../../src/core/accessibilify/accessibilify";
import * as helperModule from "../../../src/core/accessibilify/accessible-dom-element";

describe("#accessibilify", () => {
    const gameWidth = 800;
    const gameHeight = 600;

    let mockButtonBounds;
    let mockButton;
    let parentElement;
    let buttonBoundsWidth;
    let buttonBoundsHeight;
    let buttonDestroy;
    let accessibleDomElement;
    let accessibleDomElementVisible;
    let accessibleDomElementHide;
    let accessibleDomElementShow;
    let accessibleDomElementRemove;
    let onInputOver;
    let onInputOut;
    let activePointer;
    let sandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        parentElement = document.createElement("div");
        buttonBoundsWidth = 200;
        buttonBoundsHeight = 100;
        buttonDestroy = sandbox.spy();
        accessibleDomElementVisible = true;
        accessibleDomElementHide = sandbox.spy();
        accessibleDomElementShow = sandbox.spy();
        onInputOver = sandbox.spy();
        onInputOut = sandbox.spy();
        activePointer = sandbox.spy();
        mockButtonBounds = {
            clone: () => mockButtonBounds,
            topLeft: { x: "x", y: "y", multiply: () => mockButtonBounds.topLeft, add: () => mockButtonBounds.topLeft },
            scale: () => mockButtonBounds,
        };
        mockButton = {
            alive: true,
            name: "play",
            game: {
                input: {
                    activePointer: activePointer,
                },
                canvas: {
                    parentElement,
                },
                height: gameHeight,
                width: gameWidth,
                accessibleButtons: [],
                scale: {
                    margin: {},
                    onSizeChange: {
                        add: () => {},
                        remove: () => {},
                    },
                    scaleFactorInversed: { x: 1, y: 1 },
                },
                update: {},
            },
            worldPosition: { equals: () => true },
            previousPosition: {},
            toGlobal: p => p,
            destroy: buttonDestroy,
            getBounds: sandbox.stub().returns(mockButtonBounds),
            hitArea: {
                clone: () => mockButton.hitArea,
                get topLeft() {
                    return {
                        x: mockButton.hitArea.x,
                        y: mockButton.hitArea.y,
                        multiply: () => mockButton.hitArea.topLeft,
                        add: () => mockButton.hitArea.topLeft,
                    };
                },
                set topLeft(p) {
                    mockButton.hitArea.x = p.x;
                    mockButton.hitArea.y = p.y;
                },
                x: -buttonBoundsWidth / 2,
                y: -buttonBoundsHeight / 2,
                width: buttonBoundsWidth,
                height: buttonBoundsHeight,
                scale: () => mockButton.hitArea,
            },
            input: { enabled: true },
            events: {
                onInputOver: {
                    dispatch: onInputOver,
                },
                onInputOut: {
                    dispatch: onInputOut,
                },
            },
            worldScale: { x: 1, y: 1 },
        };
        accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement");
        accessibleDomElementRemove = sandbox.spy();
        accessibleDomElement.returns({
            remove: accessibleDomElementRemove,
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("Initialization", () => {
        it("calls accessibleDomElement once with args", () => {
            accessibilify(mockButton);

            sinon.assert.calledOnce(
                accessibleDomElement.withArgs({
                    id: mockButton.name,
                    ariaLabel: mockButton.name,
                    parent: mockButton.game.canvas.parentElement,
                    onClick: sinon.match.func,
                    onMouseOver: sinon.match.func,
                    onMouseOut: sinon.match.func,
                }),
            );
        });

        describe("with ariaLabel argument", () => {
            it("calls accessibleDomElement once passing in ariaLabel string", () => {
                const config = {
                    ariaLabel: "Play Button",
                };

                accessibilify(mockButton, config);

                sinon.assert.calledOnce(
                    accessibleDomElement.withArgs({
                        id: mockButton.name,
                        ariaLabel: "Play Button",
                        parent: mockButton.game.canvas.parentElement,
                        onClick: sinon.match.func,
                        onMouseOver: sinon.match.func,
                        onMouseOut: sinon.match.func,
                    }),
                );
            });
        });

        describe("with gameButton argument", () => {
            it("adds the button to an array in the game for the overlay-layout to use", () => {
                const config = {
                    ariaLabel: "Play Button",
                };

                accessibilify(mockButton, config, true);
                expect(mockButton.game.accessibleButtons[0]).to.equal(mockButton);
            });

            it("doesn't add the button to an array in the game for the overlay-layout to use when argument is false", () => {
                const config = {
                    ariaLabel: "Play Button",
                };

                accessibilify(mockButton, config, false);
                expect(mockButton.game.accessibleButtons).to.deep.equal([]);
            });
        });

        it("hooks into the button's destroy event", () => {
            accessibilify(mockButton);
            mockButton.destroy();
            sinon.assert.called(accessibleDomElementRemove);
            // Assert original functionality is not completely overridden.
            sinon.assert.called(buttonDestroy);
        });

        it("reassigns button's update event", () => {
            expect(typeof mockButton.update).to.equal("undefined");
            accessibilify(mockButton);
            expect(typeof mockButton.update).to.equal("function");
        });

        it("repositions accessibleElement if button exists", () => {
            let bounds;
            accessibleDomElement.returns({
                visible: () => true,
                set bounds(b) {
                    bounds = b;
                },
            });

            accessibilify(mockButton);
            mockButton.update();
            assert.equal(bounds, mockButton.hitArea.clone());
        });

        it("repositions accessibleElement if button exists but does not have a hit area", () => {
            let bounds;
            accessibleDomElement.returns({
                visible: () => true,
                set bounds(b) {
                    bounds = b;
                },
            });

            mockButton.hitArea = null;

            accessibilify(mockButton);
            mockButton.update();
            assert.equal(bounds, mockButtonBounds);
        });

        it("does NOT reposition accessibleElement if button does not exist", () => {
            let bounds;
            accessibleDomElement.returns({
                visible: () => true,
                set bounds(b) {
                    bounds = b;
                },
            });

            mockButton.alive = false;
            accessibilify(mockButton);
            mockButton.update();
            assert.notEqual(bounds, mockButton.hitArea.clone());
        });
    });

    describe("Button Update", () => {
        describe("element visibility", () => {
            it("when button input is disabled and the element is visible it should be hidden", () => {
                accessibleDomElement.returns({
                    visible: () => accessibleDomElementVisible,
                    hide: accessibleDomElementHide,
                });
                mockButton.input.enabled = false;
                accessibilify(mockButton);
                mockButton.update();
                sinon.assert.called(accessibleDomElementHide);
            });
            it("when button has enabled input and is within the bounds of the screen and element is not visible it should be shown", () => {
                accessibleDomElement.returns({
                    visible: () => accessibleDomElementVisible,
                    show: accessibleDomElementShow,
                });
                accessibleDomElementVisible = false;
                accessibilify(mockButton);
                mockButton.update();
                sinon.assert.called(accessibleDomElementShow);
            });
        });
    });

    describe("Hover State", () => {
        describe("When mouse over event is fired", () => {
            it("dispatches button onInputOver event", () => {
                accessibilify(mockButton);

                const options = accessibleDomElement.args[0][0];
                options.onMouseOver();
                sinon.assert.calledOnce(onInputOver.withArgs(mockButton, activePointer, false));
            });
        });

        describe("When mouse out event is fired", () => {
            it("dispatches button onInputOut event", () => {
                accessibilify(mockButton);

                const options = accessibleDomElement.args[0][0];
                options.onMouseOut();
                sinon.assert.calledOnce(onInputOut.withArgs(mockButton, activePointer, false));
            });
        });
    });
});
