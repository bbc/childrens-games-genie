/**
 * Startup extends `Phaser.State` and creates a new `Phaser.Game`, as well as a new `Navigation` object.
 * It also instantiates the `Context` object.
 *
 * @module core/startup
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { settings, settingsChannel } from "../core/settings.js";
import * as signal from "../core/signal-bus.js";
import * as Navigation from "./navigation.js";
import * as Scene from "./scene.js";
import { loadFonts } from "./font-loader.js";
import { gmi, setGmi } from "./gmi/gmi.js";
import * as a11y from "./accessibility/accessibility-layer.js";
import { addCustomStyles } from "./custom-styles.js";
import fp from "../../lib/lodash/fp/fp.js";
import * as qaMode from "./qa/qa-mode.js";
import { getBrowser } from "./browser.js";

/**
 * @param {Object=} settingsConfig - Additional state that is added to the inState context.
 * @param {Object=} navigationConfig -
 */
export function startup(settingsConfig = {}, navigationConfig) {
    setGmi(settingsConfig, window);
    hookErrors(gmi.gameContainerId);

    const browser = getBrowser();

    const phaserConfig = {
        width: 1400,
        height: 600,
        renderer: browser.forceCanvas ? Phaser.CANVAS : Phaser.AUTO,
        antialias: true,
        multiTexture: true,
        parent: getContainerDiv(),
        state: new Startup(onStarted),
        transparent: browser.isSilk, // Fixes silk browser flickering
        clearBeforeRender: false,
    };
    // Keep the console tidy:
    window.PhaserGlobal = window.PhaserGlobal || {};
    window.PhaserGlobal.hideBanner = true;

    addCustomStyles();

    const game = new Phaser.Game(phaserConfig);

    function onStarted(config) {
        // Phaser is now set up and we can use all game properties.
        game.canvas.setAttribute("tabindex", "-1");
        game.canvas.setAttribute("aria-hidden", "true");
        const scene = Scene.create(game);
        const context = {
            config: config,
            popupScreens: [],
            gameMuted: true,
        };
        game.stage.backgroundColor = "#333";

        const onFontsLoaded = () => {
            const goToScreen = Navigation.create(game.state, context, scene, navigationConfig);
            qaMode.create(window, game, goToScreen);
        };
        loadFonts(game, onFontsLoaded);

        a11y.setup(game.canvas.parentElement);
    }
}

const CONFIG_KEY = "config";

const triggeredByGame = arg => arg instanceof Phaser.Game;

const setImage = button => button.setImage(settings.getAllSettings().audio ? "audio-on" : "audio-off");
const getButtons = fp.map(fp.get("buttons.audio"));
const filterUndefined = fp.filter(x => !!x);

class Startup extends Phaser.State {
    constructor(onStarted) {
        super();
        this._onStarted = onStarted;
    }

    preload() {
        this.game.load.baseURL = gmi.gameDir;

        // All asset paths are relative to the location of the config.json:
        this.game.load.path = gmi.embedVars.configPath; //config dir
        this.game.load.json(CONFIG_KEY, "config.json");

        signal.bus.subscribe({
            channel: settingsChannel,
            name: "settings-closed",
            callback: () => {
                this.game.canvas.focus();
            },
        });
        this.configureAudioSetting();
    }

    configureAudioSetting() {
        this.game.sound.mute = !settings.getAllSettings().audio;
        this.game.onPause.add(arg => {
            //Re enable sound if triggered by the game (from the pause menu)
            //otherwise this will be a window focus event and should be muted
            this.game.sound.mute = triggeredByGame(arg) ? !settings.getAllSettings().audio : true;
        });

        this.game.onResume.add(() => {
            this.game.sound.mute = !settings.getAllSettings().audio;
        });

        signal.bus.subscribe({
            channel: settingsChannel,
            name: "audio",
            callback: value => {
                this.game.sound.mute = !value;
                const state = this.game.state;
                const layouts = state.states[state.current].scene.getLayouts();

                fp.map(setImage, filterUndefined(getButtons(layouts)));
            },
        });
    }

    create() {
        this._onStarted(this.game.cache.getJSON(CONFIG_KEY));
    }
}

function hookErrors(gameDivId) {
    const containerDiv = document.getElementById(gameDivId) || document.body;
    let messageElement;

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

function getContainerDiv() {
    const containerDiv = document.getElementById(gmi.gameContainerId);
    if (!containerDiv) {
        throw Error(`Container element "#${gmi.gameContainerId}" not found`);
    } else {
        return containerDiv;
    }
}
