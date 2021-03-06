/**
 * A container for gel buttons with built in resizing and button break points
 *
 * @module layout/layout
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { onScaleChange } from "../scaler.js";
import fp from "../../../lib/lodash/fp/fp.js";
import * as settingsIcons from "./settings-icons.js";
import * as gel from "./gel-defaults.js";
import { groupLayouts } from "./group-layouts.js";
import { Group } from "./group.js";
import { gmi } from "../gmi/gmi.js";

const getOrder = fp.curry((object, name) => object[name].order);
const tabSort = fp.sortBy(getOrder(gel.config));

const checkGMIFlags = fp.cond([
    [name => name === "audio", () => gmi.shouldDisplayMuteButton],
    [name => name === "exit", () => gmi.shouldShowExitButton],
    [fp.stubTrue, fp.stubTrue],
]);

const copyFirstChildren = fp.mapValues(key => Object.assign({}, key));
const assignProperties = (object, overrides) => {
    fp.mapKeys(key => Object.assign(object[key], overrides[key]), overrides);
    return object;
};

// Copy gel config with only objects / functions as a reference.
const shallowMergeOverrides = (config, overrides) => assignProperties(copyFirstChildren(config), overrides);

/**
 * Creates a new layout. Called by layout.factory.addLayout for each screen component
 *
 * @param {Phaser.Game} game - Phaser Game Instance
 * @param {Object} metrics - viewport metrics
 * @param {Array.<string>} buttonIds
 */
export function create(game, metrics, buttonIds) {
    buttonIds = buttonIds.filter(checkGMIFlags);

    const overrides = game.cache.getJSON("config").theme[game.state.current]["button-overrides"];

    const config = shallowMergeOverrides(gel.config, overrides);

    const root = new Phaser.Group(game, game.world, undefined);
    const groups = fp.zipObject(
        groupLayouts.map(layout =>
            fp.camelCase([layout.vPos, layout.hPos, layout.safe ? "safe" : "", layout.arrangeV ? "v" : ""].join(" ")),
        ),
        groupLayouts.map(
            layout => new Group(game, root, layout.vPos, layout.hPos, metrics, layout.safe, layout.arrangeV),
        ),
    );

    const buttons = fp.zipObject(
        tabSort(buttonIds),
        tabSort(buttonIds).map(name => groups[config[name].group].addButton(config[name])),
    );

    const iconSignals = settingsIcons.create(groups.topRight, buttonIds);

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

    const resize = metrics => {
        fp.forOwn(group => group.reset(metrics), groups);
    };
    resize(metrics);

    const signal = onScaleChange.add(resize);

    const removeSignals = () => {
        signal.unsubscribe();
        iconSignals.unsubscribe();
    };

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
    };
}
