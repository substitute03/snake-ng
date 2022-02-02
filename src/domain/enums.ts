export enum GameState{
    PreGame,
    Setup,
    InProgress,
    TimeUp,
    GameOver
}

export enum CellType {
    Empty = "empty",
    Pellet = "pellet",
    Snake = "snake",
    Blazing = "blazing"
}

export enum GameMode{
    Classic = "Classic",
    Blitz = "Blitz"
}

export enum EventType{
    PelletConsumed,
    CountdownInProgress,
    CountdownEnd,
    GameOver,
    Error
}