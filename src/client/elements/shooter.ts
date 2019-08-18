import Point from "_src/utils/point";

export default class Shooter {
    private _loc: Point;
    private _id: string;
    private _size: number = 10;
    private _color: number[] = [0, 0, 0, 255];
    private _speed: Point = new Point(0, 0, 0);
    private _defaultDecSpeed: number = 0.04;
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

    public update() {
        this.loc.add(this._speed);
        if (this._speed.mag() !== 0) {
            this._speed.sub(this._speed.clone().mult(this._defaultDecSpeed));
        }
    }
    
    public get speed() {
        return this._speed;
    }
}