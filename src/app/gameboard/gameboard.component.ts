import { ChangeDetectorRef, Component, OnInit, Output } from '@angular/core';
import { Cell } from 'src/domain/cell';
import { Direction } from 'src/domain/direction';
import { CellType } from 'src/domain/enums';
import { Snake } from 'src/domain/snake';
import { EventEmitter } from '@angular/core';

const boardSize: number = 15;

@Component({
  selector: 'sng-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.css']
})
export class GameboardComponent {
  public cells: Cell[] = [];
  public snake: Snake = new Snake();
  
  @Output() pelletConsumed = new EventEmitter<void>(); 

  constructor(private changeDetector: ChangeDetectorRef) {
    this.create();
    this.moveSnake.bind(this);
  }

  private create(): void{
    for (let y = 1; y <= boardSize; y++ ){
      for (let x = 1; x <= boardSize; x++){
        this.cells.push(new Cell(x, y));
      }
    }
  }

  public reset(): void{
    this.cells.forEach(c => c.cellType = CellType.Empty);
    this.snake = new Snake();
  }

  public spawnSnake(): void{
    this.cells.find(c => c.x === 13 && c.y === 8)!.cellType = CellType.Snake;
    this.cells.find(c => c.x === 14 && c.y === 8)!.cellType = CellType.Snake;
    this.cells.find(c => c.x === 15 && c.y === 8)!.cellType = CellType.Snake;

    this.snake.cells = this.cells.filter(c => c.cellType === CellType.Snake);
  }

  public spawnPellet(): void{
    this.getEmptyCell().cellType = CellType.Pellet;
  }

  private getEmptyCell() : Cell{
    let emptyCells: Cell[] =
      this.cells.filter(c => c.cellType == CellType.Empty);

    let randomEmptyCellIndex =
      Math.floor((Math.random() * emptyCells.length) + 0);

    return emptyCells[randomEmptyCellIndex];
  }

  public async moveSnake(directionToMove: Direction): Promise<void>{
    if (directionToMove === Direction.none){
      directionToMove = this.snake.currentDirection;
    }

    let moveToCell: Cell | null = this.getAdjacentCell(directionToMove, this.snake.head);

    if (moveToCell === null){
      this.snake.isOutOfBounds = true;
      return;
    }

    switch(moveToCell?.cellType){
      case CellType.Empty:
        this.snake.currentDirection = directionToMove;
        this.snake.tail.cellType = CellType.Empty;
        this.snake.cells.pop();
        break;
      case CellType.Snake || CellType.Blazing:
        this.snake.hasCollidedWithSelf = true;
        break;
      case CellType.Pellet:
        this.snake.currentDirection = directionToMove;
        this.snake.consumePellet();
        this.pelletConsumed.emit();
    }
    
    this.snake.cells.unshift(moveToCell);
    this.snake.head.cellType = this.snake.isBlazing ? CellType.Blazing : CellType.Snake;
  }

  private getAdjacentCell(direction: Direction, {x, y}: Cell): Cell | null{
    let adjacentCell: Cell | undefined;

    if (direction === Direction.up){
      adjacentCell = this.cells.find(c => c.x === x && c.y === y - 1);      
    }
    else if (direction === Direction.down){
      adjacentCell = this.cells.find(c => c.x === x && c.y === y + 1);    
    }
    else if (direction === Direction.left){
      adjacentCell = this.cells.find(c => c.x === x - 1 && c.y == y);    
    }
    else if (direction === Direction.right){
      adjacentCell = this.cells.find(c => c.x === x + 1 && c.y === y);    
    }

    return adjacentCell === undefined ? null : adjacentCell;
  }

}
