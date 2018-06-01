/**
 * A container for gel buttons with built in resizing and button break points
 *
 * @module layout/layout
 */
import fp from "../../../lib/lodash/fp/fp.js";
import * as signal from "../../core/signal-bus.js";
import { calculateMetrics } from "./calculate-metrics.js";
import * as gel from "./gel-defaults.js";
import { groupLayouts } from "./group-layouts.js";
import { Group } from "./group.js";

const getOrder = fp.curry((object, name) => object[name].order);
const tabSort = fp.sortBy(getOrder(gel.config));

/**
 * Creates a new layout. Called by layout.factory.addLayout for each screen component
 *
 * @param {Phaser.Game} game - Phaser Game Instance
 * @param {module:scaler} scaler
 * @param {Array.<string>} buttonIds
 */
export function create(game, scaler, buttonIds) {
    const root = new Phaser.Group(game, game.world, undefined);

    const size = scaler.getSize();
    let metrics = calculateMetrics(size.width, size.height, size.scale, size.stageHeightPx);

    const groups = fp.zipObject(
        groupLayouts.map(layout => fp.camelCase([layout.vPos, layout.hPos, layout.arrangeV ? "v" : ""].join(" "))),
        groupLayouts.map(layout => new Group(game, root, layout.vPos, layout.hPos, metrics, !!layout.arrangeV)),
    );

    const buttons = fp.zipObject(
        tabSort(buttonIds),
        tabSort(buttonIds).map(name => groups[gel.config[name].group].addButton(gel.config[name])),
    );

    /**
     * Attach a callback to the onInputUp event of a given Gel button
     *
     * @param button - gel button identifier
     * @param callback - callback function to attach
     */
    const setAction = (button, callback) => {
        buttons[button].onInputUp.add(callback, this);
    };

    const addToGroup = (groupName, item, position) => {
        groups[groupName].addToGroup(item, position);
    };

    const resize = ({ width, height, scale, stageHeight }) => {
        metrics = calculateMetrics(width, height, scale, stageHeight);

        if (groups) {
            fp.forOwn(group => group.reset(metrics), groups);
        }
    };

    const removeSignals = () => {
        // scaler.onScaleChange.remove(resize);
    };

    signal.bus.subscribe({
        channel: "scaler",
        name: "onScaleChange",
        callback: resize,
    });
    resize({ width: size.width, height: size.height, scale: size.scale, stageHeight: size.stageHeightPx });

    const destroy = () => {
        removeSignals();
        root.destroy();
    };

    return {
        addToGroup,
        buttons,
        destroy,
        resize,
        root,
        removeSignals,
        setAction,
        scaler,
    };
}
