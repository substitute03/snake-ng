import { Component, OnInit, ViewChild } from '@angular/core';
import { GameboardComponent } from '../gameboard/gameboard.component';

@Component({
  selector: 'sng-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @ViewChild('gameboard') gameboard?: GameboardComponent;

  public score: number = 0;

  constructor() {}
  ngOnInit(): void {}
  ngAfterViewInit() {}
  
  public startGame(): void{
    this.gameboard!.spawnSnake();
    this.gameboard!.spawnPellet();
  }
}
