import Point from "_src/utils/point";

export default class Bullet {
    private _loc: Point;
    private _speed: number;
    private _size: number = 1;
    private _lifeTime: number = 2000;
    constructor(loc: Point, speed: number, size?: number) {
        this._loc = loc;
        this._speed = speed;
        this._size = size || this._size;
    }
}