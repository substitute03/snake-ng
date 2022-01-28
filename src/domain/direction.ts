export class Direction{
    public id: number;
    private keys: string[];
    public value: string;

    public static readonly up = new Direction(1, ["w", "ArrowUp"], "Up");
    public static readonly down = new Direction(2, ["s", "ArrowDown"], "Down");
    public static readonly left = new Direction(3, ["a", "ArrowLeft"], "Left");
    public static readonly right = new Direction(4, ["d", "ArrowRight"], "Right");
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

        return sumOfIds === 3 || sumOfIds === 7;
    }

    public isEqualTo(direction: Direction): boolean{
        return this.id === direction.id;
    }

    public isNotEqualTo(direction: Direction): boolean{
        return this.id !== direction.id;
    }

    public static fromKey(key: string): Direction{
        return this.all.find(d => d.keys.includes(key)) ?? this.none;
    }
}