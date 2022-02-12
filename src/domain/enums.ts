export enum GameState{
    PreGame,
    Setup,
    InProgress,
    TimeUp,
    GameOver,
    Paused
}

export enum CellType {
    Empty = "empty",
    Pellet = "pellet",
    Snake = "snake",
    Blazing = "blazing",
    Parcel = "parcel",
    DeliveryPoint = "delivery-point",
    None = "none"
}

export enum GameMode{
    Classic = "Classic",
    Blitz = "Blitz",
    Delivery = "Delivery"
}

export enum EventType{
    PelletConsumed,
    ParcelRepositioned,
    ParcelDelivered,
    CountdownInProgress,
    CountdownEnd,
    GameOver,
    Error
}