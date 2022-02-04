import { Injectable } from '@angular/core';
import { GameMode } from 'src/domain/enums';
import { HighScore } from 'src/domain/highScore';

@Injectable()
export class StorageService {
    public getHighScore(playerName: string, gameMode: GameMode): HighScore | null {
        let highScoreOrNull: string | null = localStorage.getItem(playerName);

        if (highScoreOrNull) {
            return JSON.parse(highScoreOrNull) as HighScore;
        }
        else {
            return null;
        }
    }

    public addHighScore(playerName: string, gameMode: GameMode, score: number) {
        if (playerName && gameMode && score) {
            let highScore: HighScore = {
                playerName: playerName,
                gameMode: gameMode,
                score: score
            }

            localStorage.setItem(`${playerName}_${gameMode}`, JSON.stringify(highScore));
        }
    }
}