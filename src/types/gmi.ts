declare interface EchoStatsLabel {
    name;
    value: any;
}

declare interface EchoStatsOptions {
    statsLabel: EchoStatsLabel; // Has .name and .value
}

declare function createEchoStats(appName, counterName, options: EchoStatsOptions): any; // Returns EchoClient which is very complicated object.

declare interface StatsFields {
    statsCounterName;
    appName;
}

declare interface GlobalSettings {
    muted: boolean;
    subtitles: boolean;
    motion: boolean;
    gameData: any;
}

declare type ActionName = "game_loaded" | "game_first_click" | "game_click" | "timer" | "game_level";

declare class Gmi {
    public embedVars: StatsFields & any;
    public gameContainerId;
    public gameUrl;
    public gameDir;
    public environment;
    public shouldShowExitButton: boolean;
    public shouldDisplayMuteButton: boolean;
    public shouldLongPressForSettings: boolean;

    public stats: any; // Actually EchoClient

    public getAllSettings(): GlobalSettings;
    public setGameData(key, value): void;
    public setAudio(state: boolean): void;
    public setSubtitles(state: boolean): void;
    public setMotion(state: boolean): void;
    public showPrompt(resumeGame: () => void): void;
    public showSettings(): void;
    public sendStatsEvent(actionName: ActionName, actionType, additionalLabels?: any): void;
    public exit(): void;
    public debug(message): void;
    public gameLoaded(): void;
}

declare function getGMI(options: EchoStatsOptions | {}): Gmi;
