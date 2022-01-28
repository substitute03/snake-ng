import { Cell } from "./cell";
import { Direction } from "./direction";

export class Snake{
    public cells: Cell[] = [];
    public currentDirection: Direction = Direction.left;
    public directionToMove: Direction = Direction.left;
    public isOutOfBounds: boolean = false;
    public hasCollidedWithSelf: boolean = false;

    private _countPelletsConsumed: number = 0;
    get countPelletsConsumed(): number {
      return this._countPelletsConsumed;
    }
    set countPelletsConsumed(value: number) {
        this._countPelletsConsumed = value;
    }

    public _head: Cell = this.cells[0];
    get head(): Cell {
        return this._head;
    }

    public _tail: Cell = this.cells[this.cells.length - 1];
    get tail(): Cell {
        return this._tail;
    }

    public constructor(){}

    public changeDirection(direction: Direction): void{
        if(direction.isOppositeTo(this.currentDirection)){
            this.directionToMove = direction;
        }
    }

    public consumePellet(): void{
        this.countPelletsConsumed++;
    }
}