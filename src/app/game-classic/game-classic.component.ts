import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Direction } from 'src/domain/direction';
import { EventType, GameMode, GameState } from 'src/domain/enums';
import { GameboardComponent } from '../gameboard/gameboard.component';
import * as utils from 'src/app/utils'
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../shared/storage-service';

@Component({
  selector: 'sng-game',
  templateUrl: './game-classic.component.html',
  styleUrls: ['./game-classic.component.css']
})
export class GameClassicComponent implements OnInit{
  @ViewChild('gameboard') gameboard?: GameboardComponent;

  private gameMode: GameMode = GameMode.Classic;
  public playerName: string = "";
  public score: number = 0;
  public message: string = "";
  public gameState: GameState = GameState.PreGame;
  private storedKeyPresses: string[] = [];

  public get isPreGameOrGameOver(): boolean{
    return this.gameState === GameState.PreGame ||
           this.gameState === GameState.GameOver;
  }

  constructor(private _route: ActivatedRoute, private _router: Router, private _storageService: StorageService) {}

  ngOnInit(){
    this._route.queryParams.subscribe(params => {
        this.playerName = params["name"];
    })
  }
  
  public async startGameLoop(): Promise<void>{
    await this.prepareGame();

    do{
      let nextDirection: Direction = Direction.fromKey(this.storedKeyPresses[0])
      
      if (this.storedKeyPresses.length > 0){
        this.storedKeyPresses.shift();
      }

      await this.gameboard!.moveSnake(nextDirection);
      this.score = this.gameboard!.snake.countPelletsConsumed;
      await utils.sleep(75); 
    } while(!this.gameboard!.snake.isOutOfBounds &&
            !this.gameboard!.snake.hasCollidedWithSelf);
      
    this.handleGameOver();
  }

  public reset(): void{
    this.gameboard!.reset();
    this.score = 0;
    this.storedKeyPresses = [];
  }

  private async playCountdown(): Promise<void>{
    for (let i: number = 4; i >= 0; i--){     
      if(i > 1){
        this.message = `${i - 1}`;
        utils.playSound(EventType.CountdownInProgress);
        await utils.sleep(700);
      }
      else if(i === 1){
        this.message = "Go!";
        utils.playSound(EventType.CountdownEnd);
        await utils.sleep(700);
      }
      else{
        this.message = "";
      }
    }
  }

  public handlePelletConsumed(): void{
    utils.playSound(EventType.PelletConsumed);
    this.gameboard?.spawnPellet();
  }

  private async prepareGame(): Promise<void>{
    this. gameState = GameState.Setup;
    this.reset();
    this.gameboard!.spawnSnake();
    this.gameboard!.spawnPellet();   
    await this.playCountdown();
    this.gameState = GameState.InProgress;
  }

  private handleGameOver(): void{
    utils.playSound(EventType.GameOver);
    this.gameState = GameState.GameOver;
    this.checkHighScore();    
  }

  private checkHighScore(): void{
    let currentHighScore = this._storageService.getHighScore(this.playerName, this.gameMode);

    if (currentHighScore == null || this.score > currentHighScore.score){
        this._storageService.addHighScore(this.playerName, this.gameMode, this.score);
        this.message = `New high score! Was ${currentHighScore} now ${this.score}`
    }
  }

  public returnToMenu(): void{
    this._router.navigate(
        [``],
        {queryParams: {name: `${this.playerName}` }}
    );
  }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent) { 
     let key: string = event.key;

     if (this.gameState != GameState.InProgress){
       return;
     }

     let directionToMove: Direction = Direction.fromKey(key);

     if (directionToMove === Direction.none){
       return;
     }

     let nextDirection: Direction = Direction.fromKey(this.storedKeyPresses[0]);

     if (this.storedKeyPresses.length === 0){
       if (this.gameboard!.snake.currentDirection.isEqualTo(directionToMove) ||
           this.gameboard!.snake.currentDirection.isOppositeTo(directionToMove)){
         return;
       }
     }
     else if (this.storedKeyPresses.length > 0){
       if (nextDirection.isEqualTo(directionToMove) ||
           nextDirection.isOppositeTo(directionToMove)){
          return;
       }
     }

     if (this.storedKeyPresses.length === 2){
       this.storedKeyPresses.shift();
     }

     this.storedKeyPresses.push(key);
  }
}
