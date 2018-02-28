export class GelButton extends Phaser.Button {
    private assets: any;
    private buttonSize = "desktop";

    constructor(game: Phaser.Game, x: number, y: number, isMobile: boolean, key: string) {
        super(game, 0, 0, "gel/desktop/" + key + ".png", publish(key));

        this.animations.sprite.anchor.setTo(0.5, 0.5);

        this.assets = {
            mobile: "gel/mobile/" + key + ".png",
            desktop: "gel/desktop/" + key + ".png",
        };
    }

    public resize(metrics: ViewportMetrics) {
        this.buttonSize = metrics.isMobile ? "mobile" : "desktop";
        this.animations.sprite.loadTexture(this.assets[this.buttonSize]);
    }
}

const publish = (key: string) => () => {
    //TODO fire signal here
    console.log(key);
};
