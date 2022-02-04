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

@NgModule({
  declarations: [
    AppComponent,
    GameClassicComponent,
    GameboardComponent,
    MenuComponent,
    GameBlitzComponent,
    SecondsToMinutesPipe,
    PercentagePipe,
    ModalComponent 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule, 
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: 'classic', component: GameClassicComponent, data: { animation: 'GamePage'} },
      { path: 'blitz', component: GameBlitzComponent, data: { animation: 'GamePage'} },
      { path: '', component: MenuComponent, pathMatch: 'full', data: { animation: 'MenuPage'}},
      { path: '**', component: MenuComponent } // wildcard path if the path doesn't match anything
    ])
  ],
  providers: [
    SecondsToMinutesPipe,
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
