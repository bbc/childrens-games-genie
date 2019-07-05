/**
 * Home is the main title screen for the game.
 *
 * @module components/home
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { setUpAchievementsButton } from "../core/layout/set-up-achievements-button.js"
import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";


export class Home extends Screen {
    constructor() {
        super();
    }

    create() {
        var showAchievements;
        this.scene.addToBackground(this.game.add.image(0, 0, "home.background"));
        this.scene.addToBackground(this.game.add.image(0, -150, "home.title"));

        if (this.context.config.theme.game) {
            showAchievements = !!this.context.config.theme.game.achievements;
        } else {
            showAchievements = false;
        }
        const defaultButtons = ["exit", "howToPlay", "play", "audio", "settings"];
        const buttons = showAchievements ? defaultButtons.concat("achievements") : defaultButtons;

        const layout = this.scene.addLayout(buttons);
        if(showAchievements) {
            setUpAchievementsButton(this.game, layout, showAchievements);
        }

        createTestHarnessDisplay(this.game, this.context, this.scene);

        signal.bus.subscribe({
            channel: buttonsChannel,
            name: "play",
            callback: this.navigation.next,
        });
    }
}
