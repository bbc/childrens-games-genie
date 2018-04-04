import fp from "../lib/lodash/fp/fp.js";

import * as signal from "../core/signal-bus.js";

export function create(game, screen) {
    pauseGame();

    const background = addBackground();
    const gelButtons = addGelButtons();

    addSignals();

    function pauseGame() {
        game.sound.pauseAll();
        screen.context.popupScreens.push("pause");
        game.paused = true;
    }

    function addBackground() {
        const keyLookup = screen.layoutFactory.keyLookups.pause;
        const backgroundImage = game.add.image(0, 0, keyLookup.pauseBackground);
        return screen.layoutFactory.addToBackground(backgroundImage);
    }

    function addGelButtons() {
        const priorityID = 999;
        const layout = screen.layoutFactory.addLayout(["home", "audioOff", "settings", "play", "restart", "howToPlay"]);

        fp.forOwn(button => {
            button.input.priorityID = priorityID + screen.context.popupScreens.length;
        }, layout.buttons);
        return layout;
    }

    function addSignals() {
        signal.bus.subscribe({ name: "GEL-play", callback: destroy });
        signal.bus.subscribe({ name: "GEL-restart", callback: restartGame });
        signal.bus.subscribe({ name: "GEL-home", callback: goHome });
    }

    function destroy() {
        gelButtons.destroy();
        background.destroy();
        game.paused = false;
        game.sound.resumeAll();
        screen.context.popupScreens = fp.pull("pause", screen.context.popupScreens);
    }

    function restartGame() {
        destroy();
        screen.next({ transient: { restart: true } });
    }

    function goHome() {
        destroy();
        screen.next({ transient: { home: true } });
    }
}
