import { gmi } from "../../core/gmi/gmi.js";

export const setUpAchievementsButton = (game, layout, showAchievements) => {
    var achievementsGroup = layout.buttons.achievements.parent;
    if (showAchievements && gmi.achievements.unseen) {
        var achievementsIndicator = game.add.sprite(0, 0, 'home.achievement-anim');
        achievementsGroup.add(achievementsIndicator);
        achievementsIndicator.scale = {x:0, y:0}
        achievementsIndicator.anchor.set(0.5,0.5);
        achievementsIndicator.position.x = 248;
        achievementsIndicator.position.y = 0;
        game.add.tween(achievementsIndicator.scale).to( { x: 1, y:1 }, 500, Phaser.Easing.Bounce.Out, true, 1000)
    }
};