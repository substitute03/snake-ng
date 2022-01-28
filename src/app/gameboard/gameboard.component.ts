import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Cell, CellType } from 'src/domain/cell';
import { Snake } from 'src/domain/snake';

const boardSize: number = 15;

@Component({
  selector: 'sng-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.css']
})
export class GameboardComponent implements OnInit {
  public cells: Cell[] = [];
  private snake: Snake = new Snake();
  
  constructor(private changeDetector: ChangeDetectorRef) {
    this.createGameboard();
  }

  ngOnInit(): void {

  }

  private createGameboard(): void{
    for (let y = 1; y <= boardSize; y++ ){
      for (let x = 1; x <= boardSize; x++){
        this.cells.push(new Cell(x, y));
      }
    }
  }

  public spawnSnake(): void{
    this.cells.find(c => c.x === 13 && c.y === 8)!.cellType = CellType.Snake;
    this.cells.find(c => c.x === 14 && c.y === 8)!.cellType = CellType.Snake;
    this.cells.find(c => c.x === 15 && c.y === 8)!.cellType = CellType.Snake;

    this.snake.cells = this.cells;
  }

  public spawnPellet(): void{
    let doesPelletExist =
      this.cells.find(c => c.cellType === CellType.Pellet) !== undefined;

    if (!doesPelletExist){
      this.getEmptyCell().cellType = CellType.Pellet;
    }
    else{
      throw console.error("Pellet already exists on the gameboard."); 
    }
  }

  private getEmptyCell() : Cell{
    let emptyCells: Cell[] =
      this.cells.filter(c => c.cellType == CellType.Empty);

    let randomEmptyCellIndex =
      Math.floor((Math.random() * emptyCells.length) + 0);

    return emptyCells[randomEmptyCellIndex];
  }
}
