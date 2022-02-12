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
    @Output() parcelOutOfBounds = new EventEmitter<void>();
    @Output() parcelDelivered = new EventEmitter<void>();
    
    constructor(private changeDetector: ChangeDetectorRef) {
        this.create();
        this.moveSnake.bind(this);
    }

    private create(): void {
        for (let y = 1; y <= boardSize; y++) {
            for (let x = 1; x <= boardSize; x++) {
                this.cells.push(new Cell(x, y));
            }
        }
    }

    public reset(): void {
        this.cells.forEach(c => { c.cellType = CellType.Empty; c.isDeliveryPoint = false });
        this.snake = new Snake();
    }

    public spawnSnake(): void {
        this.cells.find(c => c.x === 13 && c.y === 8)!.cellType = CellType.Snake;
        this.cells.find(c => c.x === 14 && c.y === 8)!.cellType = CellType.Snake;
        this.cells.find(c => c.x === 15 && c.y === 8)!.cellType = CellType.Snake;

        this.snake.cells = this.cells.filter(c => c.cellType === CellType.Snake);
    }

    public spawnPellet(): void {
        this.getEmptyCell(true).cellType = CellType.Pellet;
    }

    public spawnParcel(): void {
        this.getEmptyCell(false).cellType = CellType.Parcel;
    }

    public spawnDeliveryPoint(): void{
        this.getEmptyCell(true).isDeliveryPoint = true;
    }

    private getEmptyCell(includePerimeterCells: boolean): Cell {
        let emptyCells: Cell[] =
            this.cells.filter(c => c.cellType == CellType.Empty);

        let randomEmptyCellIndex: number;
        if (includePerimeterCells){
            randomEmptyCellIndex =
                Math.floor((Math.random() * emptyCells.length) + 0);
        }
        else {
            let emptyCentreCells = emptyCells.filter(c =>
                c.x != 1 &&
                 c.x != boardSize &&
                  c.y != 1 &&
                   c.y != boardSize);

            let randomEmptyCentreCell: Cell =
                emptyCentreCells[Math.floor((Math.random() * emptyCentreCells.length) + 0)];

            randomEmptyCellIndex = emptyCells.indexOf(emptyCells.filter(c =>
                c.x === randomEmptyCentreCell.x && c.y === randomEmptyCentreCell.y)[0]);                
        }

        return emptyCells[randomEmptyCellIndex];
    }

    public async moveSnake(directionToMove: Direction): Promise<void> {
        if (directionToMove === Direction.none || this.snake.currentDirection.isOppositeTo(directionToMove)) {
            directionToMove = this.snake.currentDirection;
        }

        let moveToCell: Cell | null = this.getAdjacentCell(directionToMove, this.snake.head);

        if (moveToCell === null) {
            this.snake.isOutOfBounds = true;
            return;
        }

        switch (moveToCell?.cellType) {
            case CellType.Empty:
                this.moveToEmpty(directionToMove);
                break;
            case CellType.Snake:
            case CellType.Blazing:
                this.snake.hasCollidedWithSelf = true;
                break;
            case CellType.Pellet:
                this.moveToPellet(directionToMove);
                break;
            case CellType.Parcel:
                this.moveToParcel(directionToMove, moveToCell);
        }

        this.snake.cells.unshift(moveToCell);
        this.snake.head.cellType = this.snake.isBlazing ? CellType.Blazing : CellType.Snake;
    }

    private moveToEmpty(directionToMove: Direction): void{
        this.snake.currentDirection = directionToMove;
        this.snake.removeTail();
    }

    private moveToPellet(directionToMove: Direction): void{
        this.snake.currentDirection = directionToMove;
        this.snake.consumePellet();
        this.pelletConsumed.emit();
    }

    private moveToParcel(directionToMove: Direction, moveToCell: Cell): void{
        this.snake.currentDirection = directionToMove;
        let parcelAdjacentCell = this.getAdjacentCell(this.snake.currentDirection, moveToCell)

        if (parcelAdjacentCell === null){
            moveToCell.cellType = CellType.Empty;
            this.snake.removeTail();
            this.parcelOutOfBounds.emit();
            return;
        }
        else if (parcelAdjacentCell.cellType === CellType.Empty && !parcelAdjacentCell.isDeliveryPoint){
            // Move the Parcel
            parcelAdjacentCell.cellType = CellType.Parcel;
            moveToCell.cellType = CellType.Empty;
            this.snake.removeTail();
        }
        else if (parcelAdjacentCell.isDeliveryPoint){
            parcelAdjacentCell.cellType = CellType.Pellet;
            this.parcelDelivered.emit();

            moveToCell.cellType = CellType.Empty; // Remove the Parcel
            parcelAdjacentCell.isDeliveryPoint = false; // Remove the Delivery Point

            moveToCell.cellType = CellType.Empty;
            this.snake.removeTail();
        }
    }

    public getAdjacentCell(direction: Direction, { x, y }: Cell): Cell | null {
        let adjacentCell: Cell | undefined;

        if (direction === Direction.up) {
            adjacentCell = this.cells.find(c => c.x === x && c.y === y - 1);
        }
        else if (direction === Direction.down) {
            adjacentCell = this.cells.find(c => c.x === x && c.y === y + 1);
        }
        else if (direction === Direction.left) {
            adjacentCell = this.cells.find(c => c.x === x - 1 && c.y == y);
        }
        else if (direction === Direction.right) {
            adjacentCell = this.cells.find(c => c.x === x + 1 && c.y === y);
        }

        return adjacentCell === undefined ? null : adjacentCell;
    }

}
