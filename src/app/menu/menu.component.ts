import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameMode } from 'src/domain/enums';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../shared/storage-service';

@Component({
    selector: 'sng-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
    @HostBinding('class') classes = 'row col-lg-12 align-items-center vh-100';

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
            this.gameOptionsForm.markAllAsTouched(); // Mark as dirty to display validation if it is not already shown.
            return;
        }

        let selectedGameMode: GameMode =
            this.gameOptionsForm.get('gameMode')?.value;
            
        let playerName: string = this.gameOptionsForm.get('playerName')?.value;

        this._storageService.setPlayerName(playerName);

        this._router.navigate([`${selectedGameMode.toLowerCase()}`]);
    }
}
