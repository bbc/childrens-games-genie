/**
 *
 *  @module core/scaler
 */
import { calculateMetrics } from "./layout/calculate-metrics.js";

import fp from "../../lib/lodash/fp/fp.js";

const getBounds = game => () => game.scale.getParentBounds();

export let getMetrics;

export function init(stageHeight, game, scaleChangeCallback) {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    getMetrics = fp.flow(getBounds(game), fp.pick(["width", "height"]), calculateMetrics(stageHeight));

    const setSize = metrics => {
        game.scale.setGameSize(metrics.stageWidth, metrics.stageHeight);
        game.scale.updateLayout(); // Force the scalemanager to adjust the canvas
        scaleChangeCallback(metrics);
    };

    const resize = fp.flow(getMetrics, setSize);

    resize();
    window.onresize = fp.debounce(200, resize);
}
