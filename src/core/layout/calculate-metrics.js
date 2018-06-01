import fp from "../../../lib/lodash/fp/fp.js";
import clamp from "../../../lib/lodash/clamp.js";

const BORDER_PAD = 0.02;
const BREAK_WIDTH = 770;
const MIN_ASPECT_RATIO = 4 / 3;
const MAX_ASPECT_RATIO = 7 / 3;

export const calculateMetrics = (width, height, scale, stageHeight) => {
    const isMobile = width < BREAK_WIDTH;
    const safeWidth = MIN_ASPECT_RATIO * stageHeight;
    const clampedWidth = fp.clamp(MIN_ASPECT_RATIO * stageHeight, MAX_ASPECT_RATIO * stageHeight, width / scale);

    const metrics = {
        width: clampedWidth,
        height: stageHeight,
        scale,
        borderPad: Math.floor(Math.max(clampedWidth, stageHeight) * BORDER_PAD),
        isMobile,
        buttonPad: isMobile ? 22 : 24,
        buttonMin: isMobile ? 42 : 64,
        hitMin: isMobile ? 64 : 70,
        horizontals: {
            left: clampedWidth * -0.5,
            center: 0,
            right: clampedWidth * 0.5,
        },
        safeHorizontals: {
            left: safeWidth * -0.5,
            center: 0,
            right: safeWidth * 0.5,
        },
        verticals: {
            top: stageHeight * -0.5,
            middle: 0,
            bottom: stageHeight * 0.5,
        },
    };

    return metrics;
};
