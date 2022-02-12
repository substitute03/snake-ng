import { Injectable } from "@angular/core";
import { Direction } from "src/domain/direction";

@Injectable()
export class KeypressService{
    private directionQueue: Direction[] = [];

    public getNextDirection(): Direction {
        return this.directionQueue.shift() || Direction.none;
    }

    public setNextDirection(directionToMove: Direction, currentDirection: Direction){
        if (directionToMove === Direction.none) {
            return;
        }

        if (this.directionQueue.length === 0) {
            if (currentDirection.isOppositeOrEqualTo(directionToMove)) {
                return;
            }
        } else if (this.directionQueue.length > 1) {
            if (this.directionQueue[0].isOppositeOrEqualTo(directionToMove)) {
                return;
            }
        }

        if (this.directionQueue.length === 2) {
            this.directionQueue.shift();
        }

        this.directionQueue.push(directionToMove);
    }

    public clearDirectionQueue(): void{
        this.directionQueue = [];
    }
}
