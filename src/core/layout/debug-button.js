/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const gelStyle = {
    font: "ReithSans",
    fontSize: 20, //40,
    fill: "#FFFFFF",
    fontWeight: "bold",
};

const makeRect = (game, color1, width, height) =>
    new Phaser.Graphics(game)
        .beginFill(color1)
        .drawRect(0, 0, width, height)
        .endFill()
        .generateTexture();

/**
 * @class DebugButton
 *
 * Phaser button with built in gel defaults, configurable size, text overlay and automatic imagery generation
 * Compatible with {@link module:accessibility/accessibilify}
 *
 * @example
 * game.add.existing(new DebugButton( ...parameters))
 *
 * @param {Phaser.Game} game
 * @param {object} spec
 * @param {Boolean} isMobile
 */
export class DebugButton extends Phaser.Button {
    constructor(game, spec, isMobile = false) {
        super(game);

        //TODO heights are hard coded. Probably not an issue with final image based buttons.
        this.backdrops = {
            mobile: {
                up: makeRect(game, 0xf6931e, spec.width, 42),
                over: makeRect(game, 0xffaa46, spec.width, 42),
            },
            desktop: {
                up: makeRect(game, 0xf6931e, spec.width, 64),
                over: makeRect(game, 0xffaa46, spec.width, 64),
            },
        };

        this.buttonSize = isMobile ? "mobile" : "desktop";

        this.texture = this.backdrops[this.buttonSize].up;

        this.animations.sprite.anchor.setTo(0.5, 0.5);
        this.onInputUp.add(spec.click, this);

        this.animations.sprite.events.onInputOver.add(() => {
            this.texture = this.backdrops[this.buttonSize].over;
        });

        this.animations.sprite.events.onInputOut.add(() => {
            this.texture = this.backdrops[this.buttonSize].up;
        });

        const text = new Phaser.Text(game, 0, 0, spec.text, gelStyle);
        text.anchor.setTo(0.5, 0.5);
        this.animations.sprite.addChild(text);
    }

    /**
     * Resize when device width shifts across breakpoint value
     * @param {Object} metrics - Viewport metrics
     */
    resize(metrics) {
        this.buttonSize = metrics.isMobile ? "mobile" : "desktop";
        this.texture = this.backdrops[this.buttonSize].up;
    }

    /**
     * Disables input and makes button semi-transparent
     * @param {Boolean} bool
     */
    setEnabled(bool = true) {
        this.animations.sprite.inputEnabled = bool;
        this.animations.sprite.alpha = bool ? 1 : 0.5;
    }
}
