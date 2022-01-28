export enum CellType {
    Empty = "empty",
    Pellet = "pellet",
    Snake = "snake"
  }
  
export class Cell{
  private _cellType: CellType = CellType.Empty;
  get cellType(): CellType {
    return this._cellType;
  }
  set cellType(value: CellType) {
      this._cellType = value;
  }

  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number){
      this.x = x;
      this.y = y;
  }
}