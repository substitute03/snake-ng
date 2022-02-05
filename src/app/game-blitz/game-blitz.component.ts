import { ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import { Direction } from 'src/domain/direction';
import { EventType, GameMode, GameState } from 'src/domain/enums';
import { GameboardComponent } from '../gameboard/gameboard.component';
import { timer, Subscription } from 'rxjs';
import * as utils from 'src/app/utils'
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../shared/storage-service';
import { ModalComponent } from '../modal/modal.component';

@Component({
    selector: 'sng-game-blitz',
    templateUrl: './game-blitz.component.html',
    styleUrls: ['./game-blitz.component.css']
})
export class GameBlitzComponent {
    @ViewChild('gameboard') gameboard?: GameboardComponent;
    @ViewChild('highScoreModal') highScoreModal?: ModalComponent;

    public playerName: string = "";
    private gameMode: GameMode = GameMode.Blitz;
    private stopwatchSubscription = new Subscription();
    private readonly timeLimit: number = 60;
    private timeleft: number = this.timeLimit;
    public score: number = 0;
    public message: string = "";
    public gameState: GameState = GameState.PreGame;
    private storedKeyPresses: string[] = [];
    public progressBarPercentage: number = 0;
    private blazingCounter: number = 0;

    public get isPreGameOrPostGame(): boolean {
        return this.gameState === GameState.PreGame ||
            this.gameState === GameState.GameOver ||
            this.gameState === GameState.TimeUp;
    }

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _storageService: StorageService) { }

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
            let nextDirection: Direction = Direction.fromKey(this.storedKeyPresses[0])

            if (this.storedKeyPresses.length > 0) {
                this.storedKeyPresses.shift();
            }

            await this.gameboard!.moveSnake(nextDirection);
            this.score = this.gameboard!.snake.countPelletsConsumed;
            await utils.sleep(75);
        } while (!this.gameboard!.snake.isOutOfBounds &&
        !this.gameboard!.snake.hasCollidedWithSelf &&
            this.timeleft != 0);

        this.handleGameOver();
    }

    public reset(): void {
        this.progressBarPercentage = 0;
        this.blazingCounter = 0;
        this.gameboard!.reset();
        this.score = 0;
        this.storedKeyPresses = [];
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
                this.progressBarPercentage = 20 * this.blazingCounter;
            }
            if (this.blazingCounter === 5) {
                this.gameboard!.snake.isBlazing = true;
                this.handleBlazing();
            }
        }
        else if (this.gameboard!.snake.isBlazing) {
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

            this.highScoreModal!.show();
        }
    }

    public returnToMenu(): void {
        this._router.navigate([``]);
    }

    @HostListener('document:keydown', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        let key: string = event.key;

        if (this.gameState != GameState.InProgress) {
            return;
        }

        let directionToMove: Direction = Direction.fromKey(key);

        if (directionToMove === Direction.none) {
            return;
        }

        let nextDirection: Direction = Direction.fromKey(this.storedKeyPresses[0]);

        if (this.storedKeyPresses.length === 0) {
            if (this.gameboard!.snake.currentDirection.isEqualTo(directionToMove) ||
                this.gameboard!.snake.currentDirection.isOppositeTo(directionToMove)) {
                return;
            }
        }
        else if (this.storedKeyPresses.length > 0) {
            if (nextDirection.isEqualTo(directionToMove) ||
                nextDirection.isOppositeTo(directionToMove)) {
                return;
            }
        }

        if (this.storedKeyPresses.length === 2) {
            this.storedKeyPresses.shift();
        }

        this.storedKeyPresses.push(key);
    }
}
