/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as signal from "../core/signal-bus.js";
import { setAccessibleLayer } from "../core/accessibility/accessibility-layer.js";
import { gmi } from "./gmi/gmi.js";

export const settingsChannel = "genie-settings";

export const create = () => {
    signal.bus.subscribe({
        channel: settingsChannel,
        name: "settings-closed",
        callback: () => {
            setAccessibleLayer(true);
            gmi.setStatsScreen("settings");
        },
    });

    const onSettingChanged = (key, value) => {
        signal.bus.publish({
            channel: settingsChannel,
            name: key,
            data: value,
        });
    };

    const onSettingsClosed = () => {
        signal.bus.publish({
            channel: settingsChannel,
            name: "settings-closed",
        });
    };

    return {
        show: () => {
            // get current buttons
            setAccessibleLayer(false);

            return gmi.showSettings(onSettingChanged, onSettingsClosed);
        },
        getAllSettings: () => gmi.getAllSettings(),
    };
};

// Singleton used by games
export const settings = create();
