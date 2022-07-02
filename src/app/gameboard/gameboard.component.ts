import { Component, Input, OnInit, Output } from '@angular/core';
import { gameboardConfig } from 'src/domain/boardSize';
import { Cell } from 'src/domain/cell';
import { Direction } from 'src/domain/direction';
import { CellType } from 'src/domain/enums';
import { Snake } from 'src/domain/snake';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'sng-gameboard',
    templateUrl: './gameboard.component.html',
    styleUrls: ['./gameboard.component.css']
})
export class GameboardComponent implements OnInit {
    public cells: Cell[] = [];
    public snake: Snake = new Snake();
    public shadowSnake: Snake | null = null;
    private doReverseSnakeDirection: boolean = false;

    @Input() gameboardConfig = gameboardConfig.medium;

    @Output() pelletConsumed = new EventEmitter<void>();
    @Output() shadowSnakePelletConsumed = new EventEmitter<void>();
    @Output() parcelOutOfBounds = new EventEmitter<void>();
    @Output() parcelDelivered = new EventEmitter<void>();
    @Output() portalEntered = new EventEmitter<void>();
    
    constructor() { }

    ngOnInit(): void {
        this.create();
    }

    private create(): void {
        for (let y = 1; y <= this.gameboardConfig.size; y++) {
            for (let x = 1; x <= this.gameboardConfig.size; x++) {
                this.cells.push(new Cell(x, y));
            }
        }
    }

    public reset(): void {
        this.cells.forEach(c => { 
            c.cellType = CellType.Empty;
             c.isDeliveryPoint = false;
              c.isPortal = false 
            });

        this.snake = new Snake();
        this.shadowSnake = null;
    }

    public spawnSnake(): void {
        let gameboardSize = this.gameboardConfig.size;
        let centre = Math.round(gameboardSize / 2);

        this.cells.find(c => c.x === gameboardSize - 2 && c.y === centre)!.cellType = CellType.Snake;
        this.cells.find(c => c.x === gameboardSize - 1 && c.y === centre)!.cellType = CellType.Snake;
        this.cells.find(c => c.x === gameboardSize && c.y === centre)!.cellType = CellType.Snake;

        this.snake.cells = this.cells.filter(c => c.cellType === CellType.Snake);
    }

    public spawnShadowSnake():void {
        this.shadowSnake = new Snake();
        let gameboardSize = this.gameboardConfig.size;
        let centre = Math.round(gameboardSize / 2);

        this.cells.find(c => c.x === 3 && c.y === centre)!.cellType = CellType.Shadow;
        this.cells.find(c => c.x === 2 && c.y === centre)!.cellType = CellType.Shadow;
        this.cells.find(c => c.x === 1 && c.y === centre)!.cellType = CellType.Shadow;

        this.shadowSnake.cells = this.cells.filter(c => c.cellType === CellType.Shadow);
        this.shadowSnake.cells.reverse();
        this.shadowSnake.currentDirection = Direction.right;
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

    public spawnPortals(): void{
        let portal1 = this.getEmptyCell(false);
        portal1.cellType = CellType.Portal; portal1.isPortal = true;

        let portal2 = this.getEmptyCell(false);
        portal2.cellType = CellType.Portal; portal2.isPortal= true;
    }

    private despawnPortals(): void{
        this.cells.filter(c => c.isPortal).forEach(c => {
            c.isPortal = false; c.cellType = CellType.Empty
        });
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
                 c.x != this.gameboardConfig.size &&
                  c.y != 1 &&
                   c.y != this.gameboardConfig.size);

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
            case CellType.Shadow:
                this.snake.hasCollidedWithSelf = true;
                return;
            case CellType.Pellet:
                this.moveToPellet(directionToMove);
                break;
            case CellType.Parcel:
                this.moveToParcel(directionToMove, moveToCell);
                break;
            case CellType.Portal:
                moveToCell = this.moveToPortal(directionToMove, moveToCell);
        }

        this.snake.cells.unshift(moveToCell); 
        this.snake.head.cellType = this.snake.isBlazing ? CellType.Blazing : CellType.Snake;

        if (this.doReverseSnakeDirection){
            this.snake.reverseDirection();
            this.doReverseSnakeDirection = false;
        }

        if (this.shadowSnake){
            this.moveShadowSnake(directionToMove.opposite());
        }
    }

    public reverseSnakeDirection(): void{
        this.doReverseSnakeDirection = true;
    }

    private moveShadowSnake(directionToMove: Direction): void{
        let moveToCell: Cell | null = this.getAdjacentCell(directionToMove, this.shadowSnake!.head);

        if (moveToCell){
            if (moveToCell.cellType === CellType.Pellet){
                this.shadowSnakePelletConsumed.emit();
            }
            
            this.shadowSnake!.cells.unshift(moveToCell);
            this.shadowSnake!.head.cellType = CellType.Shadow;
        }
    }

    private moveToEmpty(directionToMove: Direction): void{
        this.snake.currentDirection = directionToMove;
        this.snake.removeTail();

        if(this.shadowSnake){
            this.shadowSnake.currentDirection = directionToMove.opposite();
            this.shadowSnake.removeTail();
        }
    }

    private moveToPellet(directionToMove: Direction): void{
        this.snake.currentDirection = directionToMove;
        this.pelletConsumed.emit();
    }

    private moveToPortal(directionToMove: Direction, moveToCell: Cell): Cell{
        this.snake.currentDirection = directionToMove;
        let exitPortalCell = this.cells.filter(c => c != moveToCell && c.isPortal)[0];
        this.despawnPortals();
        this.portalEntered.emit();
        return exitPortalCell;
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
