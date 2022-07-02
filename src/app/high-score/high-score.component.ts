import { Component, OnInit } from '@angular/core';
import { GameMode } from 'src/domain/enums';
import { HighScore } from 'src/domain/highScore';
import { StorageService } from '../shared/storage-service';
import * as _ from 'lodash';

export type GameModeFilter = GameMode | "All";

@Component({
  selector: 'sng-high-score',
  templateUrl: './high-score.component.html',
  styleUrls: ['./high-score.component.css']
})
export class HighScoreComponent implements OnInit {
    public highScores: HighScore[] = [];
    public displayedHighScores: HighScore[] = [];
    public gameModes: GameModeFilter[] = [];
    public selectedGameMode: GameModeFilter = "All";

  constructor(private _storageService: StorageService) { }

  ngOnInit(): void {
    for (let mode in GameMode){
        this.gameModes.push(mode as GameMode);
    }

      this.getHighScores();
      this.displayedHighScores = this.highScores;
      this.gameModes.unshift("All"); 
  }

  private getHighScores(): void{
    this.highScores = this._storageService.getAllHighScores();
    this.highScores = _.orderBy(this.highScores, ['gameMode', 'score'], ['asc', 'desc']);

    this.gameModes.forEach(mode => {
        let highestGameModeScore = this.highScores.find(hs => hs.gameMode === mode)!.score;

        if (highestGameModeScore){
            let highestGameModeScorers = this.highScores.filter(hs => hs.score === highestGameModeScore);

            highestGameModeScorers.forEach(hgms => hgms.playerName = `${hgms.playerName} 👑`)
        }
    });    
  }

  public filterHighScores(): void{
    if (this.selectedGameMode == 'All'){
        this.displayedHighScores = this.highScores;
    }
    else{
        this.displayedHighScores = this.highScores
        .filter(hs => hs.gameMode === this.selectedGameMode);
    }
  }
}
