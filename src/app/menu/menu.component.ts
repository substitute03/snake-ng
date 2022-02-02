import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameMode } from 'src/domain/enums';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sng-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @HostBinding('class') classes = 'row col-lg-12 align-items-center vh-100';

  public gameModes: string[] = [];

  gameOptionsForm = new FormGroup({
    gameMode : new FormControl(GameMode.Classic),
    asd: new FormControl(10)
  });

  constructor(private _router: Router) {}

  ngOnInit(): void {
    for (let mode in GameMode){
      this.gameModes.push(mode);
    }
  }

  public handlePlayClicked(): void{
    let selectedGameMode: GameMode = this.gameOptionsForm.get("gameMode")?.value;
    
    this._router.navigate([`${selectedGameMode.toLowerCase()}`])
  }
}
