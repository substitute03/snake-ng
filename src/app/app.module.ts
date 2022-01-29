import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameboardComponent } from './gameboard/gameboard.component';
import { MenuComponent } from './menu/menu.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GameboardComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'game', component: GameComponent },
      { path: '', component: GameComponent, pathMatch: 'full' },
      { path: '**', component: AppComponent } // wildcard path if the path doesn't match anything
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
