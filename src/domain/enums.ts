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
    None = "none",
    Portal = "portal",
    Shadow = "shadow"
}

export enum GameMode{
    Classic = "Classic",
    Blitz = "Blitz",
    Delivery = "Delivery",
    Portal = "Portal",
    Shadow = "Shadow",
    Bounce = "Bounce"
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