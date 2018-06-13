/**
 * Startup extends `Phaser.State` and creates a new `Phaser.Game`, as well as a new `Navigation` object.
 * It also instantiates the `Context` object.
 *
 * @module core/startup
 */
import { settings, settingsChannel } from "../core/settings.js";
import * as signal from "../core/signal-bus.js";
import { parseUrlParams } from "./parseUrlParams.js";
import * as Navigation from "./navigation.js";
import * as Scene from "./scene.js";
import * as Brim from "../../brim/brim.js";

/**
 * @param {Object=} settingsConfig - Additional state that is added to the inState context.
 * @param {Object=} navigationConfig -
 */
export function startup(settingsConfig = {}, navigationConfig) {
    const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && /Apple/.test(navigator.vendor);
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isSafari && iOS) Brim.create("local-game-holder");
    const gmi = window.getGMI({ settingsConfig });
    const urlParams = parseUrlParams(window.location.search);
    const qaMode = { active: urlParams.qaMode ? urlParams.qaMode : false, testHarnessLayoutDisplayed: false };
    hookErrors(gmi.gameContainerId);
    settings.setGmi(gmi);

    const phaserConfig = {
        width: 1400,
        height: 600,
        renderer: Phaser.AUTO,
        antialias: true,
        multiTexture: false,
        parent: getContainerDiv(gmi),
        state: new Startup(gmi, onStarted),
        transparent: true, // Fixes silk browser flickering
    };
    // Keep the console tidy:
    window.PhaserGlobal = window.PhaserGlobal || {};
    window.PhaserGlobal.hideBanner = true;

    const game = new Phaser.Game(phaserConfig);

    function onStarted(config) {
        // Phaser is now set up and we can use all game properties.
        game.canvas.setAttribute("tabindex", "-1");
        game.canvas.setAttribute("aria-hidden", "true");
        const scene = Scene.create(game);
        const context = {
            gmi,
            config: config,
            popupScreens: [],
            gameMuted: true,
            qaMode,
        };
        game.stage.backgroundColor = "#333";
        Navigation.create(game.state, context, scene, navigationConfig);
    }
}

const CONFIG_KEY = "config";

class Startup extends Phaser.State {
    constructor(gmi, onStarted) {
        super();
        this._gmi = gmi;
        this._onStarted = onStarted;
    }

    preload() {
        const gmi = this._gmi;
        this.game.load.baseURL = this._gmi.gameDir;

        // All asset paths are relative to the location of the config.json:
        const theme = gmi.embedVars.configPath;
        this.game.load.path = theme.split(/([^/]+$)/, 2)[0]; //config dir
        this.game.load.json(CONFIG_KEY, "config.json");
        signal.bus.subscribe({
            channel: settingsChannel,
            name: "settingsClosed",
            callback: () => {
                this.game.canvas.focus();
            },
        });
        this.configureAudioSetting();
    }

    configureAudioSetting() {
        this.game.sound.mute = settings.getAllSettings().muted;
        this.game.onPause.add(() => {
            this.game.sound.mute = settings.getAllSettings().muted;
        });
        this.game.onResume.add(() => {
            this.game.sound.mute = settings.getAllSettings().muted;
        });
        signal.bus.subscribe({
            channel: settingsChannel,
            name: "audio",
            callback: value => {
                this.game.sound.mute = !value;
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

function getContainerDiv(gmi) {
    const containerDiv = document.getElementById(gmi.gameContainerId);
    if (!containerDiv) {
        throw Error(`Container element "#${gmi.gameContainerId}" not found`);
    } else {
        return containerDiv;
    }
}
