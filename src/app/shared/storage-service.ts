import { Injectable } from '@angular/core';
import { GameMode } from 'src/domain/enums';
import { HighScore } from 'src/domain/highScore';

const blitzKey = "Blitz";
const classicKey = "Classic";
const deliveryKey = "Delivery";
const portalKey = "Portal";
const shadowKey = "Shadow";
const bounceKey = "Bounce";

@Injectable()
export class StorageService {
    public getHighScore(playerName: string, gameMode: GameMode): HighScore | null {
        let highScoreOrNull: string | null = localStorage.getItem(
            `${playerName}_${gameMode}`
        );

        if (highScoreOrNull) {
            return JSON.parse(highScoreOrNull) as HighScore;
        } else {
            return null;
        }
    }

    private getHighScoreByStorageKey(storageKey: string): HighScore | null {
        let highScoreOrNull: string | null = localStorage.getItem(storageKey);

        if (highScoreOrNull) {
            return JSON.parse(highScoreOrNull) as HighScore;
        } else {
            return null;
        }
    }

    public addHighScore(playerName: string, gameMode: GameMode, score: number) {
        if (playerName && gameMode && score) {
            let highScore: HighScore = {
                playerName: playerName,
                gameMode: gameMode,
                score: score,
            };

            localStorage.setItem(
                `${playerName}_${gameMode}`,
                JSON.stringify(highScore)
            );
        }
    }

    public getAllHighScores(gameMode?: GameMode): HighScore[] {
        let highScores: HighScore[] = [];
        let storageKeys: string[] = [];

        for (let key in localStorage) {
            storageKeys.push(key);
        }

        for (let key of storageKeys){
            if (key.includes(classicKey) || key.includes(blitzKey) 
            || key.includes(deliveryKey) || key.includes(portalKey)
            || key.includes(shadowKey) || key.includes(bounceKey)){
                let highScore = this.getHighScoreByStorageKey(key);

                if(highScore){
                    highScores.push(highScore);
                }
            }
        }

        if (gameMode) {
            highScores = highScores.filter(
                (hs) => hs.gameMode === gameMode.toString()
            );
        }

        return highScores;
    }

    public setPlayerName(name: string){
        localStorage.setItem("playerName", name);
    }

    public getPlayerName(){
        return localStorage.getItem("playerName");
    }
}
