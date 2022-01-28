import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Direction } from 'src/domain/direction';
import { CellType } from 'src/domain/enums';
import { GameboardComponent } from '../gameboard/gameboard.component';

@Component({
  selector: 'sng-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  @ViewChild('gameboard') gameboard?: GameboardComponent;

  public score: number = 0;
  public message: string = "";

  constructor(private changeDetector: ChangeDetectorRef) {}
  
  public async startGameLoop(): Promise<void>{
    this.resetGameboard();
    this.gameboard!.spawnSnake();
    this.gameboard!.spawnPellet();   

    do{
      await this.gameboard!.moveSnake(Direction.left);
      this.score = this.gameboard!.snake.countPelletsConsumed;
      await sleep(80);
    } while(!this.gameboard!.snake.isOutOfBounds &&
            !this.gameboard!.snake.hasCollidedWithSelf);

    this.message = "Game over!";
  }

  public resetGameboard(): void{
    this.gameboard!.reset();
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
