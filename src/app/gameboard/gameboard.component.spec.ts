import { gameboardConfig } from 'src/domain/boardSize';
import { CellType } from 'src/domain/enums';

import { GameboardComponent } from './gameboard.component';

describe('GameboardComponent', () => {
  let component: GameboardComponent;

  beforeEach(() => {
    component = new GameboardComponent();
    component.ngOnInit();
  });

  gameboardConfig.all.forEach(config => {
    it(`board size ${config.name} should render the correct board size`, function(){
        // Arrange
        component.gameboardConfig = config;
        component.cells = [];
        component.ngOnInit();
        let expectedBoardSize = Math.pow(component.gameboardConfig.size, 2);
        
        // Act
        let actualBoardSize = component.cells.length;
        console.log(actualBoardSize)
    
        // Assert
        expect(expectedBoardSize).toBe(actualBoardSize);
      });
  });

  it('resetting the game board should set all cells to empty', function(){
    // Arrange
    component.cells.forEach(c => c.cellType = CellType.Snake); // Set all cells to a type that is not empty.
    
    // Act
    component.reset();
    let actual = component.cells.filter(c => c.cellType != CellType.Empty).length;

    // Assert
    expect(actual).toBe(0);
  });

  it('spawn snake correctly creates an unbroken snake', function(){
    // Arrange
    let actual: boolean = false;

    // Act
    component.spawnSnake();
    let snakeCells = component.cells.filter(c => c.cellType === CellType.Snake);
    
    let xValues: number[] = [];
    let yValues: number[] = [];
    snakeCells.forEach(c => {
        xValues.push(c.x);
        yValues.push(c.y);
    });

    xValues.sort();
    yValues.sort();

    let isHorizontal: boolean = false;
    let isVertical: boolean = false;
    if (xValues!.every(x => x === xValues[0]) === true){
        isVertical = true;
    }
    else if (yValues!.every(y => y === yValues[0]) === true){
        isHorizontal = true;
    }

    if (!isHorizontal && !isVertical){
        actual = false;
    }

    if (isHorizontal){
        for (let i = 1; i < xValues.length; i++){
            if (xValues[i] !== xValues[i - 1] + 1){
                actual = false;
            }
            else{
                actual = true;
            }
        }     
    }
    else if(isVertical){
        for (let i = 1; i < yValues.length; i++){
            if (yValues[i] !== yValues[i - 1] + 1){
                actual = false;
            }
            else{
                actual = true;
            }
        }   
    }

    // Assert
    if(isHorizontal || isVertical){
        expect(actual).toBe(true);
    }
 
  });
});
