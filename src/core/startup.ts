import * as _ from "lodash";
import "../lib/phaser";

import * as Sequencer from "../core/sequencer";
import { parseUrlParams } from "../lib/parseUrlParams";

export interface Config {
    stageHeightPx;
    backgroundColor?;
    theme: any;
}

export function startup(transitions, initialAdditionalState?): Promise<Phaser.Game> {
    const gmi = (window as any).getGMI({});
    const urlParams = parseUrlParams(window.location.search);
    const qaMode = { active: urlParams.qaMode ? urlParams.qaMode : false, testHarnessLayoutDisplayed: false };
    hookErrors(gmi.gameContainerId);

    const phaserConfig: Phaser.IGameConfig = {
        width: 1400,
        height: 600,
        renderer: Phaser.AUTO,
        antialias: true,
        multiTexture: false,
        parent: getContainerDiv(gmi),
        state: new Startup(gmi, onStarted),
    };
    // Keep the console tidy:
    (window as any).PhaserGlobal = { hideBanner: true };

    const game = new Phaser.Game(phaserConfig);

    let resolvedPromise;

    return new Promise(resolve => {
        resolvedPromise = resolve;
    });

    function onStarted(config) {
        // Phaser is now set up and we can use all game properties.
        game.canvas.setAttribute("aria-hidden", "true");
        const context = {
            gmi,
            inState: _.merge({ transient: {}, persistent: {} }, initialAdditionalState),
            popupScreens: [],
            gameMuted: true,
            qaMode,
            sequencer: { getTransitions: () => [] },
        };
        context.sequencer = Sequencer.create(game, context, transitions, getContainerDiv(gmi));
        game.stage.backgroundColor = "#333";
        resolvedPromise(game);
    }
}

class Startup extends Phaser.State {
    constructor(private gmi, private onStarted: (config) => void) {
        super();
    }

    public preload() {
        const gmi = this.gmi;
        this.game.load.baseURL = this.gmi.gameDir;

        // All asset paths are relative to the location of the config.json:
        const theme = gmi.embedVars.configPath;
        const configDir = theme.split(/([^/]+$)/, 2)[0];
        this.game.load.path = configDir;

        //this.load.json(CONFIG_KEY, configFile); xxx
    }

    public create() {
        this.onStarted({} as Config /* this.game.cache.getJSON(CONFIG_KEY) */);
    }
}

function hookErrors(gameDivId) {
    const containerDiv = document.getElementById(gameDivId) || document.body;
    let messageElement: HTMLElement;

    window.addEventListener("error", event => {
        if (!messageElement) {
            messageElement = containerDiv.appendChild(document.createElement("pre"));
            const padding = "2em";
            const style = messageElement.style;
            style.position = "absolute";
            style.top = style.left = "0";
            style.backgroundColor = "black";
            style.color = "white";
            style.padding = padding;
            style.width = style.height = `calc(100% - 2 * ${padding})`;
        }
        messageElement.innerText = `Something isn't working:\n\n${event.error.message || event.error}\n\n${event.error
            .stack || ""}`;
    });
}

function getContainerDiv(gmi) {
    const containerDiv = document.getElementById(gmi.gameContainerId);
    if (!containerDiv) {
        throw Error(`Container element "#${gmi.gameContainerId}" not found`);
    } else {
        return containerDiv;
    }
}
