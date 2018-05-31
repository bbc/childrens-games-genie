/**
 *
 *  @module core/scaler
 */

export const GEL_MIN_RATIO_WIDTH = 4;
export const GEL_MIN_RATIO_HEIGHT = 3;
export const GEL_SAFE_FRAME_RATIO = GEL_MIN_RATIO_WIDTH / GEL_MIN_RATIO_HEIGHT;

import fp from "../../lib/lodash/fp/fp.js";

const getScale = fp.curry((scaleMethods, stageHeightPx, { width, height }) => {
    const scale = scaleMethods[width / height >= GEL_SAFE_FRAME_RATIO ? "wide" : "narrow"](width, height);
    return { width, height, scale, stageHeightPx };
});

const getBounds = game => () => game.scale.getParentBounds();

export function create(stageHeightPx, game) {
    // Will be immediately resized:
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    const onScaleChange = new Phaser.Signal();

    const scaleMethods = {
        wide: (width, height) => height / stageHeightPx,
        narrow: width => width / stageHeightPx / GEL_SAFE_FRAME_RATIO,
    };

    const getSize = fp.flow(getBounds(game), fp.pick(["width", "height"]), getScale(scaleMethods, stageHeightPx));

    const setSize = ({ width, height, scale, stageHeightPx: stageHeight }) => {
        const size = getSize();
        const aspectRatio = fp.clamp(4 / 3, 7 / 3, size.width / size.height);
        game.scale.setGameSize(aspectRatio * stageHeightPx, stageHeightPx);
        onScaleChange.dispatch(width, height, scale, stageHeight);
    };

    const onSizeChange = fp.flow(getSize, setSize);
    window.onresize = fp.debounce(200, onSizeChange);
    onSizeChange();

    return {
        onScaleChange,
        getSize,
    };
}
