import { Component, OnInit } from '@angular/core';
import { GameMode } from 'src/domain/enums';
import { HighScore } from 'src/domain/highScore';
import { StorageService } from '../shared/storage-service';

@Component({
  selector: 'sng-high-score',
  templateUrl: './high-score.component.html',
  styleUrls: ['./high-score.component.css']
})
export class HighScoreComponent implements OnInit {
    public highScores: HighScore[] = [];
    public displayedHighScores: HighScore[] = [];

  constructor(private _storageService: StorageService) { }

  ngOnInit(): void {
      this.getHighScores();
      this.displayedHighScores = this.highScores;
  }

  private getHighScores(): void{
    this.highScores = this._storageService.getAllHighScores();
  }

  private filterHighScores(gameMode: GameMode): void{
    this.displayedHighScores = this.highScores
        .filter(hs => hs.gameMode === gameMode);
  }
}
