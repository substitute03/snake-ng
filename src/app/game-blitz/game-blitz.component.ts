import { Component, HostListener, ViewChild } from '@angular/core';
import { Direction } from 'src/domain/direction';
import { EventType, GameMode, GameState } from 'src/domain/enums';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { timer, Subscription } from 'rxjs';
import * as utils from 'src/app/utils'
import { Router } from '@angular/router';
import { StorageService } from '../shared/storage-service';
import { ModalComponent } from '../modal/modal.component';
import { KeypressService } from '../shared/keypress-service';
import { gameboardConfig } from 'src/domain/boardSize';

@Component({
    selector: 'sng-game-blitz',
    templateUrl: './game-blitz.component.html',
    styleUrls: ['./game-blitz.component.css']
})
export class GameBlitzComponent {
    @ViewChild('gameboard') gameboard?: GameboardComponent;
    @ViewChild('highScoreModal') highScoreModal?: ModalComponent;

    public gameboardConfig = gameboardConfig.medium;
    private stopwatchSubscription = new Subscription();
    private readonly timeLimit: number = 60;
    private timeleft: number = this.timeLimit;
    private blazingCounter: number = 0;

    public playerName: string = "";
    public gameMode: GameMode = GameMode.Blitz;
    public highScore: number = 0;
    public score: number = 0;
    public message: string = "";
    public gameState: GameState = GameState.PreGame;
    public progressBarPercentage: number = 0;

    public get isPreGameOrPostGame(): boolean {
        return this.gameState === GameState.PreGame ||
            this.gameState === GameState.GameOver ||
            this.gameState === GameState.TimeUp;
    }

    constructor(private _router: Router,
        private _storageService: StorageService,
        private _keypressService: KeypressService) { }

        ngOnInit() {
            let playerName = this._storageService.getPlayerName();

            if (playerName) {
                this.playerName = playerName;
                let highScore = this._storageService.getHighScore(playerName, this.gameMode);
    
                if (highScore) {
                    this.highScore = highScore.score;
                }
            }
            else {
                this.returnToMenu();
            }
        }

    public async startGameLoop(): Promise<void> {
        await this.prepareGame();

        do {
            let nextDirection: Direction = this._keypressService.getNextDirection();
            await this.gameboard!.moveSnake(nextDirection);
            await utils.sleep(90);
        } while (!this.gameboard!.snake.isOutOfBounds &&
            !this.gameboard!.snake.hasCollidedWithSelf &&
            this.timeleft != 0);

        this.handleGameOver();
    }

    public reset(): void {
        this._keypressService.clearDirectionQueue();
        this.progressBarPercentage = 0;
        this.blazingCounter = 0;
        this.gameboard!.reset();
        this.score = 0;
    }

    private async playCountdown(): Promise<void> {
        for (let i: number = 4; i >= 0; i--) {
            if (i > 1) {
                this.message = `${i - 1}`;
                utils.playSound(EventType.CountdownInProgress);
                await utils.sleep(700);
            }
            else if (i === 1) {
                this.message = "Go!";
                utils.playSound(EventType.CountdownEnd);
                await utils.sleep(700);
            }
            else {
                this.message = "";
            }
        }
    }

    private async startTimer(): Promise<void> {
        const stopwatch = timer(0, 1000);

        this.stopwatchSubscription = stopwatch.subscribe(secondsPassed => {
            this.timeleft = this.timeLimit - secondsPassed;
            this.message = utils.secondsToMinutes(this.timeleft);
        });
    }

    public handlePelletConsumed(): void {
        utils.playSound(EventType.PelletConsumed);
        this.gameboard?.spawnPellet();

        if (!this.gameboard!.snake.isBlazing) {
            if (this.blazingCounter < 5) {
                this.blazingCounter++;
                this.score++;
                this.progressBarPercentage = 20 * this.blazingCounter;
            }
            if (this.blazingCounter === 5) {
                this.gameboard!.snake.isBlazing = true;
                this.handleBlazing();
            }
        }
        else if (this.gameboard!.snake.isBlazing) {
            this.score += 2;
            if (this.progressBarPercentage < 100) {
                this.progressBarPercentage = this.progressBarPercentage + 20 > 100 ? 100 : this.progressBarPercentage + 20;
            }
        }
    }

    private async handleBlazing(): Promise<void> {
        do {
            await utils.sleep(50);
            this.progressBarPercentage = this.progressBarPercentage - 1;
        }
        while (this.progressBarPercentage > 0);

        this.gameboard!.snake.isBlazing = false;
        this.blazingCounter = 0;
    }

    private async prepareGame(): Promise<void> {
        this.gameState = GameState.Setup;
        this.reset();
        this.gameboard!.spawnSnake();
        this.gameboard!.spawnPellet();
        await this.playCountdown();
        this.gameState = GameState.InProgress;
        this.startTimer();
    }

    private handleGameOver(): void {
        this.stopwatchSubscription.unsubscribe();
        utils.playSound(EventType.GameOver);
        this.gameState = this.timeleft === 0 ? GameState.TimeUp : GameState.GameOver;

        switch (this.gameState) {
            case GameState.TimeUp:
                this.message = "Time's up!";
                this.checkHighScore();
                break;
            case GameState.GameOver:
                this.message = "Game over!";
        }

        if (this.gameboard!.snake.isBlazing) {
            this.gameboard!.snake.isBlazing = false;
        }

        this.progressBarPercentage = 0;
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

            this.highScore = this.score;
            this.highScoreModal!.show();
        }
    }

    public returnToMenu(): void {
        this._router.navigate([``]);
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
