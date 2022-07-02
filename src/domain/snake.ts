import { Cell } from "./cell";
import { Direction } from "./direction";
import { CellType } from "./enums";

export class Snake{
    public cells: Cell[] = [];
    public currentDirection: Direction = Direction.left;
    public directionToMove: Direction = Direction.left;
    public isOutOfBounds: boolean = false;
    public hasCollidedWithSelf: boolean = false;
    
    get head(): Cell {
        return this.cells[0];
    }

    get tail(): Cell {
        return this.cells[this.cells.length - 1];
    }

    public constructor(){}

    public changeDirection(direction: Direction): void{
        if (direction.isOppositeTo(this.currentDirection)){
            this.directionToMove = direction;
        }
    }

    public reverseDirection(): void{
        this.cells.reverse();

        let cellAdjacentToHead = this.cells[1];

        if (cellAdjacentToHead.x === this.head.x - 1){
            this.directionToMove = Direction.right;
            this.currentDirection = Direction.right;
        }
        else if (cellAdjacentToHead.x === this.head.x + 1){
            this.directionToMove = Direction.left;
            this.currentDirection = Direction.left;
        }
        else if (cellAdjacentToHead.y === this.head.y - 1){
            this.directionToMove = Direction.down;
            this.currentDirection = Direction.down;
        }
        else if (cellAdjacentToHead.y === this.head.y + 1){
            this.directionToMove = Direction.up;
            this.currentDirection = Direction.up;
        }
    }

    public removeTail():void{
        this.tail.cellType = CellType.Empty;
        this.cells.pop();
    }

    private _isShadow: boolean = false;
    get isShadow(): boolean{
        return this._isShadow;
    }
    set isShadow(value: boolean){
        this._isShadow = value;
        this.cells.forEach(cell => cell.cellType = CellType.Shadow);
    }   

    private _isBlazing: boolean = false;
    get isBlazing(): boolean {
        return this._isBlazing;
    }
    set isBlazing(value: boolean){
        this._isBlazing = value;

        if (this.isBlazing){
            this.cells.forEach(cell => cell.cellType = CellType.Blazing)
        }
        else if (!this.isBlazing){
            this.cells.forEach(cell => cell.cellType = CellType.Snake)
        }
    }
}
