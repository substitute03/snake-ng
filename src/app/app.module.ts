import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
    RouterModule.forRoot([
      { path: 'classic', component: GameComponent },
      { path: '', component: MenuComponent, pathMatch: 'full' },
      { path: '**', component: AppComponent } // wildcard path if the path doesn't match anything
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
