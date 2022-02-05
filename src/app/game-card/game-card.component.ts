import { Component, Input, OnInit } from '@angular/core';
import { GameMode } from 'src/domain/enums';

@Component({
  selector: 'sng-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent implements OnInit {
    @Input() playerName: string = '';
    @Input() gameMode: GameMode | null = null;
    @Input() highScore: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
