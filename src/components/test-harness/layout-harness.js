import { GEL_MIN_RATIO_HEIGHT, GEL_MIN_RATIO_WIDTH } from "../../core/scaler.js";
import { calculateMetrics } from "../../core/layout/calculate-metrics.js";
import fp from "../../../lib/lodash/fp/fp.js";

export function createTestHarnessDisplay(game, context, scene) {
    let graphicsBackgroundGroup;
    let graphicsForegroundGroup;

    if (context.qaMode.active) {
        graphicsBackgroundGroup = game.add.group();
        graphicsForegroundGroup = game.add.group();
        const qaKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        qaKey.onUp.add(toggle, game);
    }

    function toggle() {
        if (context.qaMode.testHarnessLayoutDisplayed) {
            hide();
            console.log("Layout Test Harness Hidden"); // eslint-disable-line no-console
        } else {
            show();
            console.log("Layout Test Harness Displayed"); // eslint-disable-line no-console
        }
    }

    function show() {
        drawGameArea();
        drawOuterPadding();
        scene.addToBackground(graphicsBackgroundGroup);
        scene.addToForeground(graphicsForegroundGroup);
        context.qaMode.testHarnessLayoutDisplayed = true;
    }

    function drawGameArea() {
        const [gameAreaWidth, gameAreaHeight] = gameAreaDimensions();

        const graphics = game.add.graphics();
        graphics.beginFill(0x32cd32, 0.5);
        graphics.drawRect(-gameAreaWidth * 0.5, -gameAreaHeight * 0.5, gameAreaWidth, gameAreaHeight);
        graphicsBackgroundGroup.add(graphics);
    }

    function clampedWidth(size) {
        const minWidth = size.stageHeightPx / GEL_MIN_RATIO_HEIGHT * GEL_MIN_RATIO_WIDTH;
        const maxWidth = size.stageHeightPx / GEL_MIN_RATIO_HEIGHT * 7;
        return fp.clamp(minWidth, maxWidth, size.width / size.scale);
    }

    function drawOuterPadding() {
        const size = scene.getSize();
        const graphics = game.add.graphics();
        const width = clampedWidth(size);
        const paddingWidth = getPaddingWidth() / size.scale;
        const gameLeftEdge = -0.5 * width;
        const gameTopEdge = -0.5 * size.height / size.scale;
        const gameRightEdge = 0.5 * width;
        const gameBottomEdge = 0.5 * size.height / size.scale;

        console.log("paddingWidth: ", paddingWidth); // eslint-disable-line no-console
        console.log("screenWidth: ", window.innerWidth); // eslint-disable-line no-console
        console.log("screenHeight: ", window.innerHeight); // eslint-disable-line no-console

        graphics.lineStyle(paddingWidth, 0xffff00, 0.5);
        graphics.moveTo(gameLeftEdge + paddingWidth / 2, gameTopEdge + paddingWidth / 2);
        graphics.lineTo(gameRightEdge - paddingWidth / 2, gameTopEdge + paddingWidth / 2);
        graphics.lineTo(gameRightEdge - paddingWidth / 2, gameBottomEdge - paddingWidth / 2);
        graphics.lineTo(gameLeftEdge + paddingWidth / 2, gameBottomEdge - paddingWidth / 2);
        graphics.lineTo(gameLeftEdge + paddingWidth / 2, gameTopEdge + paddingWidth / 2);

        graphicsForegroundGroup.add(graphics);
    }

    function hide() {
        graphicsBackgroundGroup.destroy(true, true);
        graphicsForegroundGroup.destroy(true, true);
        context.qaMode.testHarnessLayoutDisplayed = false;
    }

    function gameAreaDimensions() {
        const size = scene.getSize();
        const areaWidth = size.stageHeightPx / GEL_MIN_RATIO_HEIGHT * GEL_MIN_RATIO_WIDTH;
        const areaHeight = size.stageHeightPx;

        return [areaWidth, areaHeight];
    }

    function getPaddingWidth() {
        const size = scene.getSize();
        const gelPaddingWidthPercentage = 0.02;

        return Math.max(size.width, size.height) * gelPaddingWidthPercentage;
    }
}
