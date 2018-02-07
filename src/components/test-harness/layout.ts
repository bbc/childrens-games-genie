import { GEL_SAFE_FRAME_RATIO, GEL_MIN_RATIO_RHS, GEL_MIN_RATIO_LHS } from "../../core/scaler";

export function testHarnessDisplay(game: Phaser.Game, context: Context) {
    let graphicsGroup: Phaser.Group;
    let domGameArea: HTMLDivElement;
    let accessibilityOverlay = <HTMLDivElement>document.getElementsByClassName(
        "game-wrapper__accessibility-overlay",
    )[0];

    return {
        create,
    };

    function create() {
        if (context.qaMode.active) {
            graphicsGroup = game.add.group();
            const qaKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            qaKey.onUp.add(toggle, game);
        }
    }

    function toggle() {
        if (context.qaMode.testHarnessLayoutDisplayed) {
            hide();
        } else {
            show();
        }
    }

    function show() {
        highlightGameArea();
    }

    function highlightGameArea() {
        const size = context.layout.getSize();
        const gameAreaWidth = (size.stageHeightPx / GEL_MIN_RATIO_RHS) * GEL_MIN_RATIO_LHS;
        const gameAreaHeight = size.stageHeightPx;
        const graphics = game.add.graphics();
        graphics.beginFill(0x32cd32, 0.5);
        graphics.drawRect(-gameAreaWidth * 0.5, -gameAreaHeight * 0.5, gameAreaWidth, gameAreaHeight);
        graphicsGroup.add(graphics);
        context.layout.addToBackground(graphicsGroup);
        highlightGameAreaInDOM(gameAreaWidth, gameAreaHeight, size.scale);

        context.qaMode.testHarnessLayoutDisplayed = true;
    }

    function highlightGameAreaInDOM(gameAreaWidth: number, gameAreaHeight: number, scale: number) {
        accessibilityOverlay.style.display = "block";
        domGameArea = document.createElement("div");
        domGameArea.id = "genie-gamearea";
        domGameArea.style.position = "absolute";
        domGameArea.style.top = (game.world.centerY - gameAreaHeight * scale * 0.5).toString() + "px";
        domGameArea.style.left = (game.world.centerX - gameAreaWidth * scale * 0.5).toString() + "px";
        domGameArea.style.width = (gameAreaWidth * scale).toString() + "px";
        domGameArea.style.height = (gameAreaHeight * scale).toString() + "px";
        accessibilityOverlay.appendChild(domGameArea);
    }

    function hide() {
        graphicsGroup.destroy(true, true);
        domGameArea.remove();
        accessibilityOverlay.style.display = "none";
        context.qaMode.testHarnessLayoutDisplayed = false;
    }
}
