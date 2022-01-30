import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GameClassicComponent } from './game-classic/game-classic.component';
import { GameboardComponent } from './gameboard/gameboard.component';
import { MenuComponent } from './menu/menu.component';
import { GameBlitzComponent } from './game-blitz/game-blitz.component';


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
    RouterModule.forRoot([
      { path: 'classic', component: GameClassicComponent },
      { path: '', component: MenuComponent, pathMatch: 'full' },
      { path: '**', component: AppComponent } // wildcard path if the path doesn't match anything
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
