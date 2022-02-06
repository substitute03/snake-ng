import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameMode } from 'src/domain/enums';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../shared/storage-service';
import { ModalComponent } from '../modal/modal.component';

@Component({
    selector: 'sng-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
    @HostBinding('class') classes = 'row col-lg-12 align-items-center gx-0 vh-100';
    @ViewChild('helpModal') helpModal?: ModalComponent;

    public gameModes: string[] = [];

    gameOptionsForm = new FormGroup({
        gameMode: new FormControl(GameMode.Classic),
        playerName: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]),
    });

    public get playerName() {
        return this.gameOptionsForm.get('playerName');
    }

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _storageService: StorageService
    ) { }

    ngOnInit(): void {
        let playerName = this._storageService.getPlayerName();

        if (playerName) {
            this.gameOptionsForm.patchValue({ playerName: playerName });
        }

        for (let mode in GameMode) {
            this.gameModes.push(mode);
        }
    }

    public handlePlayClicked(): void {
        if (this.gameOptionsForm.invalid) {
            this.gameOptionsForm.markAllAsTouched(); // Mark as touched to display validation if it is not already shown.
            return;
        }

        let selectedGameMode: GameMode =
            this.gameOptionsForm.get('gameMode')?.value;
            
        let playerName: string = this.gameOptionsForm.get('playerName')?.value;

        this._storageService.setPlayerName(playerName);

        this._router.navigate([`${selectedGameMode.toLowerCase()}`]);
    }

    public showHelpModal(): void{
        this.helpModal!.show();
    }

    public getHelpHtml(): string{
        return `
        <h1 id="snakeng">SnakeNg</h1>
        <p>SnakeNg is a take on the classic Snake game built in Angular 13.</p>
        <h2 id="overview">Overview</h2>
        <p>The aim of the game is to score as many points as possible by guiding the Snake to consume pellets. Each time a pellet is consumed, the Snake will become one block longer.
        You will get a game over if the Snake either goes out of bounds or collides with itself.</p>
        <h2 id="game-modes">Game Modes</h2>
        <ul>
        <li><strong>Classic</strong><ul>
        <li>A recreation of the classic Snake game. Consume as many pellets as you can without going out of bounds or allowing the Snake to collide with itself.</li>
        </ul>
        </li>
        <li><strong>Blitz</strong><ul>
        <li>The same rules as Classic but, now, consuming pellets will fill up the Blazing meter. When the Blazing meter is full, the Snake will start blazing for 5 seconds. During this time, all pellets are worth double points and collecting pellets will extend the Blazing status for an extra 1 second. Score as many points as you can in 1 minute.</li>
        </ul>
        </li>
        </ul>
        <h2 id="high-scores">High Scores</h2>
        <ul>
        <li>Your high scores for each game mode will be stored in your browser&#39;s local storage. See how high you can score!</li>
        </ul>
        <h2 id="controls">Controls</h2>
        <p>The Snake is controlled using the WASD or the arrow keys.</p>
        <ul>
        <li>W or Up Arrow - move the Snake up.</li>
        <li>A or Left Arrow- move the Snake left.</li>
        <li>S or Down Arrow - move the Snake down.</li>
        <li>D or Right Arrow - move thte Snake right.</li>
        </ul>
        `
    }
}
