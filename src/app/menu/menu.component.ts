import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameMode } from 'src/domain/enums';

@Component({
  selector: 'sng-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @HostBinding('class') classes = 'row col-lg-12 align-items-center vh-100';

  public selectedGameMode: string = "";
  public gameModes: string[] = [];

  constructor(private _router: Router) {}

  ngOnInit(): void {
    for (let mode in GameMode){
      this.gameModes.push(mode);
    }
  }

  public handlePlayClicked(): void{
    let selectedGameMode: GameMode = <GameMode>this.selectedGameMode;

    this._router.navigate([`${selectedGameMode.toLowerCase()}`])
  }
}
