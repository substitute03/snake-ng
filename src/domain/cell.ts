import { CellType } from "./enums";

export class Cell{
  public cellType: CellType = CellType.Empty;
  public isDeliveryPoint: boolean = false;
  public isPortal: boolean = false;

  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number){
      this.x = x;
      this.y = y;
  }
}
