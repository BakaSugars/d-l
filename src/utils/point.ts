export default class Point {
    private _x: number;
    private _y: number;
    private _z: number;
    constructor(x: number, y: number, z: number) {
        this._x = x;
        this._y = y;
        this._z = z;
    }
    public get x () { return this._x }
    public get y () { return this._y }
    public get z () { return this._z }

    public add(p: Point) {
        this._x += p.x;
        this._y += p.y;
        this._z += p.z;
        return this;
    }

    public sub(p: Point) {
        this._x -= p.x;
        this._y -= p.y;
        this._z -= p.z;
        return this;
    }

    public unit() {
        const mag = this.mag();
        if (mag === 0) {
            return this;
        }
        this.div(this.mag());
        return this;
    }

    public mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public mult(n: number): Point {
        this._x *= n;
        this._y *= n;
        this._z *= n;
        return this;
    }

    public multVector(v: Point) {
        return v.x * this._x + v.y * this._y + v.z * this._z;
    }

    public div(n: number): Point {
        this._x /= n;
        this._y /= n;
        this._z /= n;
    return this;
    }

    public clone() {
        return new Point(this._x, this._y, this._z);
    }

    public toArray() {
        return [this. x, this.y];
    }

    public reverse() {
        this._x = -this._x;
        this._y = -this._y;
        this._z = -this._z;
        return this;
    }

    public rotate(r: number) {
        const x = this._x;
        const y = this._y;
        this._x = x * Math.cos(r) - y * Math.sin(r);
        this._y = x * Math.sin(r) + y * Math.cos(r);
        return this;
    }
}