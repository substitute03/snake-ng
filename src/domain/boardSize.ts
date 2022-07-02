export class gameboardConfig{
    name: string = "";
    size: number = 0;
    css: string = "";

    public static readonly small = new gameboardConfig("Small", 7, 'gameboard-sm');
    public static readonly medium = new gameboardConfig("Medium", 15, 'gameboard-md');
    public static readonly mediumEven = new gameboardConfig("Medium Even", 16, 'gameboard-md-even');
    public static readonly large = new gameboardConfig("Large", 21, 'gameboard-lg');
    public static readonly extraLarge = new gameboardConfig("Extra Large", 27, 'gameboard-xl');
    public static readonly all: gameboardConfig[] = [this.small, this.medium,  this.mediumEven, this.large, this.extraLarge];

    private constructor(name: string, size: number, css: string){
        this.name = name;
        this.size = size;
        this.css = css;
    }
}