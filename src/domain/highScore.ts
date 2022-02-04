import { GameMode } from "./enums";

export interface HighScore{
    playerName: string;
    gameMode: GameMode;
    score: number;
}