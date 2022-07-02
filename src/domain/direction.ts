export class Direction{
    public id: number;
    private keys: string[];
    public value: string;

    public static readonly up = new Direction(10, ["w", "ArrowUp"], "Up");
    public static readonly down = new Direction(20, ["s", "ArrowDown"], "Down");
    public static readonly left = new Direction(30, ["a", "ArrowLeft"], "Left");
    public static readonly right = new Direction(40, ["d", "ArrowRight"], "Right");
    public static readonly none = new Direction(0, [], "None");
    public static readonly all : Direction[] = [this.up, this.down, this.left, this.right];

    private constructor(id :number, keys: string[], value: string){
        this.id = id;
        this.keys = keys;
        this.value = value;
    }

    public isOppositeTo(direction: Direction): boolean{
        if (direction === Direction.none || this == Direction.none){
            return false;
        }

        let sumOfIds: number = this.id + direction.id;

        return sumOfIds === 30 || sumOfIds === 70;
    }

    public isEqualTo(direction: Direction): boolean{
        return this.id === direction.id;
    }

    public isOppositeOrEqualTo(direction: Direction): boolean{
        return (this.isOppositeTo(direction) || this.isEqualTo(direction))
    }

    public isNotEqualTo(direction: Direction): boolean{
        return this.id !== direction.id;
    }

    public static fromKey(key: string): Direction{
        return this.all.find(d => d.keys.includes(key)) ?? this.none;
    }

    public opposite(): Direction{
        switch (this){
            case Direction.up:
                return Direction.down;
            case Direction.down:
                return Direction.up;
            case Direction.left:
                return Direction.right;
            case Direction.right:
                return Direction.left;
            default:
                return Direction.none;
        }
        
    }
}