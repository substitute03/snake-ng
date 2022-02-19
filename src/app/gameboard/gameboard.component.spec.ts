import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gameboardConfig } from 'src/domain/boardSize';

import { GameboardComponent } from './gameboard.component';

describe('GameboardComponent', () => {
  let component: GameboardComponent;


  beforeEach(async () => {
    component = new GameboardComponent();
  });

  gameboardConfig.all.forEach(config => {
    it(`board size ${config.name} should render the correct board size`, function(){
        // Arrange
        component.gameboardConfig = config;
        component.ngOnInit();
        let expectedBoardSize = Math.pow(component.gameboardConfig.size, 2);
        
        // Act
        let actualBoardSize = component.cells.length;
        console.log(actualBoardSize)
    
        // Assert
        expect(expectedBoardSize).toBe(actualBoardSize);
      });
  });
});
