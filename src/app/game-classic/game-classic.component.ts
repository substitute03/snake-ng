import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as utils from 'src/app/utils';
import { Direction } from 'src/domain/direction';
import { EventType, GameMode, GameState } from 'src/domain/enums';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { ModalComponent } from '../modal/modal.component';
import { KeypressService } from '../shared/keypress-service';
import { StorageService } from '../shared/storage-service';

@Component({
    selector: 'sng-game',
    templateUrl: './game-classic.component.html',
    styleUrls: ['./game-classic.component.css'],
})
export class GameClassicComponent implements OnInit {
    @ViewChild('gameboard') gameboard?: GameboardComponent;
    @ViewChild('highScoreModal') highScoreModal?: ModalComponent;

    private gameMode: GameMode = GameMode.Classic;
    public playerName: string = '';
    public score: number = 0;
    public message: string = '';
    public gameState: GameState = GameState.PreGame;

    public get isPreGameOrGameOver(): boolean {
        return (
            this.gameState === GameState.PreGame ||
            this.gameState === GameState.GameOver
        );
    }

    constructor(private _keypressService: KeypressService,
        private _router: Router,
        private _storageService: StorageService) {}

    ngOnInit() {
        let playerName = this._storageService.getPlayerName();

        if (playerName){
            this.playerName = playerName;
        }
        else{
            this.returnToMenu();
        }
    }

    public async startGameLoop(): Promise<void> {
        await this.prepareGame();

        do {
            let nextDirection: Direction = this._keypressService.getNextDirection();
            await this.gameboard!.moveSnake(nextDirection);
            this.score = this.gameboard!.snake.countPelletsConsumed;
            await utils.sleep(1000);
        } while (
            !this.gameboard!.snake.isOutOfBounds &&
            !this.gameboard!.snake.hasCollidedWithSelf
        );

        this.handleGameOver();
    }

    public reset(): void {
        this.gameboard!.reset();
        this.score = 0;
        this._keypressService.clearDirectionQueue();
    }

    private async playCountdown(): Promise<void> {
        for (let i: number = 4; i >= 0; i--) {
            if (i > 1) {
                this.message = `${i - 1}`;
                utils.playSound(EventType.CountdownInProgress);
                await utils.sleep(700);
            } else if (i === 1) {
                this.message = 'Go!';
                utils.playSound(EventType.CountdownEnd);
                await utils.sleep(700);
            } else {
                this.message = '';
            }
        }
    }

    public handlePelletConsumed(): void {
        utils.playSound(EventType.PelletConsumed);
        this.gameboard?.spawnPellet();
    }

    private async prepareGame(): Promise<void> {
        this.gameState = GameState.Setup;
        this.reset();
        this.gameboard!.spawnSnake();
        this.gameboard!.spawnPellet();
        await this.playCountdown();
        this.gameState = GameState.InProgress;
    }

    private handleGameOver(): void {
        utils.playSound(EventType.GameOver);
        this.gameState = GameState.GameOver;
        this.checkHighScore();
    }

    private checkHighScore(): void {
        let currentHighScore = this._storageService.getHighScore(
            this.playerName,
            this.gameMode
        );

        if (currentHighScore == null || this.score > currentHighScore.score) {
            this._storageService.addHighScore(
                this.playerName,
                this.gameMode,
                this.score
            );

            this.highScoreModal!.show();
        }
    }

    public returnToMenu(): void {
        this._router.navigate([""]);
    }

    @HostListener('document:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (this.gameState != GameState.InProgress) {
            return;
        }

    this._keypressService.setNextDirection(Direction.fromKey(event.key),
            this.gameboard!.snake.currentDirection);
    }
}
