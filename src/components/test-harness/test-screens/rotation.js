import { Screen } from "../../../core/screen.js";
import * as debug from "../../../core/debug.js";
import * as signal from "../../../core/signal-bus.js";

export class RotationTest extends Screen {
    constructor() {
        super();
    }

    preload() {
        const debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        debugKey.onUp.add(() => {
            debug.toggle(this.game);
        });
    }

    create() {
        this.scene.addLayout(["home", "pause", "audioOff", "settings", "continue"]);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.sprite = this.game.add.sprite(this.game.world.centerX + 200, this.game.world.centerY - 100, "rotation.basicSprite");
        this.sprite.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this.sprite);
        debug.add(this.sprite, "rgba(255,0,0,0.4)", true);

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "continue",
            callback: this.navigation.next,
        });
    }

    update() {
        if (this.sprite.x > this.game.world.centerX - 200 || this.sprite.y < this.game.world.centerY + 100) {
            this.sprite.x -= 0.8;
            this.sprite.y += 0.4;
        }

        this.sprite.rotation += 0.1;
    }

    render() {
        debug.render(this.game);
    }
}
