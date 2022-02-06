import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GameMode, GameState } from 'src/domain/enums';

@Component({
    selector: 'sng-game-card',
    templateUrl: './game-card.component.html',
    styleUrls: ['./game-card.component.css']
})
export class GameCardComponent implements OnInit {
    @Input() playerName: string = '';
    @Input() gameMode: GameMode | null = null;
    @Input() highScore: number = 0;
    @Input() gameState: GameState | null = null;

    get shouldSpinLogo(){
        return this.gameState === GameState.GameOver || this.gameState === GameState.TimeUp;
    }

    public doSpinLogo: boolean = false;

    constructor() { }

    ngOnInit(): void {
    }

    public spinLogo(): void {
        this.doSpinLogo = true;
    }

    public stopSpinLogo(): void{
        this.doSpinLogo = false;
    }

}
