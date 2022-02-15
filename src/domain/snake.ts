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
        if(direction.isOppositeTo(this.currentDirection)){
            this.directionToMove = direction;
        }
    }

    public removeTail():void{
        this.tail.cellType = CellType.Empty;
        this.cells.pop();
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
