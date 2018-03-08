import { expect } from "chai";
import * as sinon from "sinon";
import { accessibilify } from "../../../src/lib/accessibilify/accessibilify";
import * as helperModule from "../../../src/lib/accessibilify/accessible-dom-element";

describe("#accessibilify", () => {
    let mockButton: any;
    let parentElement: any;
    let gameWidth: number;
    let gameHeight: number;
    let buttonBoundsX: number;
    let buttonBoundsY: number;
    let buttonBoundsWidth: number;
    let buttonBoundsHeight: number;
    let accessibleDomElement: any;
    let accessibleDomElementVisible: boolean;
    let accessibleDomElementHide: any;
    let accessibleDomElementShow: any;
    let sandbox: sinon.SinonSandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
        gameWidth = 800;
        gameHeight = 600;
    });

    beforeEach(() => {
        parentElement = document.createElement("div");
        buttonBoundsX = 50;
        buttonBoundsY = 50;
        buttonBoundsWidth = 200;
        buttonBoundsHeight = 100;
        accessibleDomElementVisible = true;
        accessibleDomElementHide = sandbox.spy();
        accessibleDomElementShow = sandbox.spy();
        mockButton = {
            name: "play",
            game: {
                input: {
                    activePointer: {},
                },
                canvas: {
                    parentElement,
                },
                height: gameHeight,
                width: gameWidth,
                scale: {
                    onSizeChange: {
                        add: (debouncedCallback: () => void) => {},
                    },
                },
                state: {
                    onStateChange: {
                        addOnce: (teardown: () => void) => {},
                    },
                },
                update: {},
            },
            getBounds: () => {
                return {
                    x: buttonBoundsX,
                    y: buttonBoundsY,
                    width: buttonBoundsWidth,
                    height: buttonBoundsHeight,
                };
            },
        };
        accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement").returns({
            position: (): void => {},
            visible: () => accessibleDomElementVisible,
            hide: accessibleDomElementHide,
            show: accessibleDomElementShow,
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
                    parent: mockButton.game.canvas.parentElement as HTMLDivElement,
                    onClick: sinon.match.func,
                }),
            );
        });

        describe("with ariaLabel argument", () => {
            it("calls accessibleDomElement once passing in ariaLabel string", () => {
                accessibilify(mockButton, "Play Button");

                sinon.assert.calledOnce(
                    accessibleDomElement.withArgs({
                        id: mockButton.name,
                        ariaLabel: "Play Button",
                        parent: mockButton.game.canvas.parentElement as HTMLDivElement,
                        onClick: sinon.match.func,
                    }),
                );
            });
        });

        it("assigns an onSizeChange event", () => {
            const onSizeChange = sandbox.stub(mockButton.game.scale.onSizeChange, "add");

            accessibilify(mockButton);
            sinon.assert.called(onSizeChange);
        });

        it("assigns an onStateChange event", () => {
            const onStateChange = sandbox.stub(mockButton.game.state.onStateChange, "addOnce");

            accessibilify(mockButton);
            sinon.assert.called(onStateChange);
        });

        it("reassigns button's update event", () => {
            expect(typeof mockButton.update).to.equal("undefined");
            accessibilify(mockButton);
            expect(typeof mockButton.update).to.equal("function");
        });

        it("repositions accessibleElement", () => {
            sandbox.restore();
            const clock = sandbox.useFakeTimers();
            const position = sandbox.spy();
            accessibleDomElement = sandbox.stub(helperModule, "accessibleDomElement").returns({ position });

            accessibilify(mockButton);
            clock.tick(200);
            sinon.assert.called(position.withArgs(mockButton.getBounds()));
        });
    });

    describe("Button Update", () => {
        describe("when button is outside of screen and element is visible", () => {
            it("hides element", () => {
                buttonBoundsX = -1000;
                accessibilify(mockButton);
                mockButton.update();
                sinon.assert.called(accessibleDomElementHide);
            });
        });

        describe("when button is within the bounds of the screen and element is not visible", () => {
            it("shows element", () => {
                accessibleDomElementVisible = false;
                accessibilify(mockButton);
                mockButton.update();
                sinon.assert.called(accessibleDomElementShow);
            });
        });
    });
});
