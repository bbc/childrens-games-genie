import * as pause from "../../components/pause.js";

const howToPlayClicked = () => {
    console.log("how to play clicked");
};

const config = {
    exit: {
        group: "topLeft",
        title: "Exit",
        key: "exit",
        ariaLabel: "Exit Game",
        order: 0,
        id: "gel-exit",
    },
    home: {
        group: "topLeft",
        title: "Home",
        key: "home",
        ariaLabel: "Home",
        order: 1,
        id: "gel-home",
        action: ({game}) => {
            const screen = game.state.states[game.state.current];
            screen.next({transient: {home: true}});
        }
    },
    back: {
        group: "topLeft",
        title: "Back",
        key: "back",
        ariaLabel: "Back",
        order: 2,
        id: "gel-back",
    },
    audioOff: {
        group: "topRight",
        title: "Sound Off",
        key: "audio-off",
        ariaLabel: "Disable Sound",
        order: 3,
        id: "gel-audio-off",
    },
    audioOn: {
        group: "topRight",
        title: "Sound On",
        key: "audio-on",
        ariaLabel: "Enable Sound",
        order: 4,
        id: "gel-audio-on",
    },
    settings: {
        group: "topRight",
        title: "Settings",
        key: "settings",
        ariaLabel: "Game Settings",
        order: 5,
        id: "gel-settings",
    },
    pause: {
        group: "topRight",
        title: "Pause",
        key: "pause",
        ariaLabel: "Pause Game",
        order: 6,
        id: "gel-pause",
        action: pause.create,
    },
    previous: {
        group: "middleLeft",
        title: "Previous",
        key: "previous",
        ariaLabel: "Previous Item",
        order: 7,
        id: "gel-previous",
    },
    play: {
        group: "middleCenterV",
        title: "Play",
        key: "play",
        ariaLabel: "Play Game",
        order: 8,
        id: "gel-play",
    },
    next: {
        group: "middleRight",
        title: "Next",
        key: "next",
        ariaLabel: "Next Item",
        order: 9,
        id: "gel-next",
    },
    achievements: {
        group: "bottomLeft",
        title: "Achievements",
        key: "achievements",
        ariaLabel: "Your Achievements",
        order: 10,
        id: "gel-achievements",
    },
    restart: {
        group: "bottomCenter",
        title: "Restart",
        key: "restart",
        ariaLabel: "Restart Game",
        order: 11,
        id: "gel-restart",
    },
    continue: {
        group: "bottomCenter",
        title: "Continue",
        key: "continue",
        ariaLabel: "Continue Game",
        order: 12,
        id: "gel-continue",
    },
    howToPlay: {
        group: "bottomRight",
        title: "How To Play",
        key: "how-to-play",
        ariaLabel: "Game Instructions",
        order: 13,
        id: "gel-how-to-play",
        action: howToPlayClicked,
    },
};

export default config;
