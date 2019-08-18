import Point from "_src/utils/point";

export default class Shooter {
    private _loc: Point;
    private _id: string;
    private _size: number = 10;
    private _color: number[] = [0, 0, 0, 255];
    constructor(loc: Point, id: string, secret: string, color?: number[], size?: number) {
        this._loc = loc;
        this._id = id;
        this._size = size || this._size;
        this._color = color || this._color;
    }

    public get loc() {
        return this._loc;
    }

    public set loc(val: Point) {
        this._loc = val;
    }

    public get id() {
        return this._id;
    }

    public get size() {
        return this._size;
    }

    public get color() {
        return this._color;
    }
}