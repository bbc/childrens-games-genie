declare type NextScreenFunction = (state?: GameStateUpdate) => any;

declare interface ScreenDef {
    name;
    state: any;
    nextScreenName: NextScreenFunction;
}
