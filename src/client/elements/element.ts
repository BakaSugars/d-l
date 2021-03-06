import EventEmitter from "_src/utils/eventEmitter";
import Point from "_src/utils/point";
import { createId, INFINITY } from "_src/utils/util";
import CollsionBox from "_src/client/elements/collisionBox";
import { CollsionBase, CollsionEvent } from "_src/client/elements/collsiionBase";
import { CollsionType } from "_src/client/elements/collsionManager";

export interface ElementOption {
    loc: Point;
    speed?: Point;
    color?: number[];
    size?: number;
    lifePoint?: number;
}

export abstract class Element extends EventEmitter {
    private _loc: Point;
    private _id: number;
    private _speed: Point = new Point(0, 0, 0);
    // xy,yz,zx轴面上形成的角度
    private _direction: Point = new Point(1, 0, 0);
    private _lastUpdateTime: number;
    protected _color = [0, 0, 0, 255];
    private _size = 1;
    protected _collsionUnit: CollsionBox;
    protected _collsionUnitType: CollsionType;
    protected _lifePoint = INFINITY;

    constructor(opt: ElementOption) {
        super();
        const { loc, speed, color, size = this._size, lifePoint } = opt;
        this._loc = loc;
        this._speed = speed || this._speed;
        this._color = color || this._color;
        this._size = size || this._size;
        this._lifePoint = lifePoint || this._lifePoint;
        this._lastUpdateTime = Date.now();
        this._id = createId();
        this._regCollsion();
    }

    public update() {};
    
    public get collsionType() {
        return this._collsionUnitType;
    }

    public get collsionUnit() {
        return this._collsionUnit;
    }

    public get size() {
        return this._size;
    }

    public set size(size: number) {
        this._size = size;
    }

    public get color() {
        return this._color;
    }

    public set color(color: number[]) {
        this._color = color;
    }

    public get id() {
        return this._id;
    }

    public get loc() {
        return this._loc;
    }

    public set loc(loc: Point) {
        this._loc = loc;
    }

    public get direction() {
        return this._direction;
    }

    public set direction(dir: Point) {
        this._direction = dir;
    }

    public get speed() {
        return this._speed;
    }

    public set speed(v: Point) {
        this._speed = v;
    }

    public get lastUpdateTime() {
        return this._lastUpdateTime;
    }

    public updateLocation() {
        const now = Date.now();
        const deltaTime = now - this._lastUpdateTime;
        this._lastUpdateTime = now;
        const deltaDistance = this._speed.clone().mult(deltaTime);
        this._loc = this._loc.add(deltaDistance);
        if (this._collsionUnit) {
            this.updateCollsionUnit();
        }
    }

    public updateCollsionUnit() {
        const deltaPoint = this._getCollsionPoint();
        this._collsionUnit.lt = this._loc.clone().sub(deltaPoint);
        this._collsionUnit.rb = this._loc.clone().add(deltaPoint);
    }

    public destroy() {
        this._collsionUnit.destroy();
        super.destroy();
    }

    protected _getCollsionPoint() {
        const deltaValue = this._size / 2;
        const deltaPoint = new Point(deltaValue, deltaValue, 0);
        return deltaPoint;
    }

    protected _regCollsion() {
        const deltaPoint = this._getCollsionPoint();
        this._collsionUnit = new CollsionBox(
            this._loc.clone().sub(deltaPoint),
            this._loc.clone().add(deltaPoint),
        )
        this._collsionUnit.from = this;
    }
}