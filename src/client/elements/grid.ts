import Coordinate from "_src/utils/coordinate";
import Point from "_src/utils/point";

export default class Grid {
    private _loc: Coordinate;
    private _width: number;
    private _color: number[];
    private _padding = 1;
    constructor(loc: Coordinate, width: number, color: number[]) {
        this._loc = loc;
        this._width = width;
        this._color = color;
    }

    public get loc() {
        return this._loc;
    }

    public get center() {
        return new Point(
            this._loc.x * this._width + this._width / 2,
            this._loc.y * this._width + this._width / 2,
            this._loc.z
        );
    }

    public get color() {
        return this._color;
    }

    public get width() {
        return this._width;
    }

    public get padding() {
        return this._padding;
    }
}