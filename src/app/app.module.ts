import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GameClassicComponent } from './game-classic/game-classic.component';
import { GameboardComponent } from './gameboard/gameboard.component';
import { MenuComponent } from './menu/menu.component';
import { GameBlitzComponent } from './game-blitz/game-blitz.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    GameClassicComponent,
    GameboardComponent,
    MenuComponent,
    GameBlitzComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: 'classic', component: GameClassicComponent, data: { animation: 'GamePage'} },
      { path: 'blitz', component: GameBlitzComponent, data: { animation: 'GamePage'} },
      { path: '', component: MenuComponent, pathMatch: 'full', data: { animation: 'MenuPage'}},
      { path: '**', component: MenuComponent } // wildcard path if the path doesn't match anything
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
