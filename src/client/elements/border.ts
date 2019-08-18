import Point from "_src/utils/point";

export class Border {
    private _width: number;
    private _height: number;
    private _gridSize: number;
    constructor(width: number, height: number, gridSize: number) {
        this._width = width * gridSize;
        this._height = height * gridSize;
        this._gridSize = gridSize;
    }
    
    public inBorder(p: Point) {
        if (p.x < -this._width / 2 || p.x > this._width / 2) {
            return false;
        }
        if (p.y < -this._height / 2 || p.y > this._height / 2) {
            return false;
        }
    }
}