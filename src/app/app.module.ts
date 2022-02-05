import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GameClassicComponent } from './game-classic/game-classic.component';
import { GameboardComponent } from './gameboard/gameboard.component';
import { MenuComponent } from './menu/menu.component';
import { GameBlitzComponent } from './game-blitz/game-blitz.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecondsToMinutesPipe } from './pipes/seconds-to-minutes-pipe.pipe';
import { PercentagePipe } from './pipes/percentage.pipe';
import { StorageService } from './shared/storage-service';
import { ModalComponent } from './modal/modal.component';
import { HighScoreComponent } from './high-score/high-score.component';
import { KeypressService } from './shared/keypress-service';
import { GameCardComponent } from './game-card/game-card.component';

@NgModule({
  declarations: [
    AppComponent,
    GameClassicComponent,
    GameboardComponent,
    MenuComponent,
    GameBlitzComponent,
    SecondsToMinutesPipe,
    PercentagePipe,
    ModalComponent,
    HighScoreComponent,
    GameCardComponent 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, 
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: 'classic', component: GameClassicComponent, data: { animation: 'Page2'} },
      { path: 'blitz', component: GameBlitzComponent, data: { animation: 'Page2'} },
      { path: 'highscores', component: HighScoreComponent, data: { animation: 'Page2'} },
      { path: '', component: MenuComponent, pathMatch: 'full', data: { animation: 'Page1'}},
      { path: '**', component: MenuComponent } // wildcard path if the path doesn't match anything
    ])
  ],
  providers: [
    SecondsToMinutesPipe,
    StorageService,
    KeypressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
