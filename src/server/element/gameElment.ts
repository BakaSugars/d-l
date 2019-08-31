import Point from "_src/utils/point";
import { createId } from "_src/utils/util";
import EventEmitter from "_src/utils/eventEmitter";

export default class GameElement extends EventEmitter {
    private _loc: Point;
    private _type: number;
    private _id: number;
    constructor (point: Point) {
        super();
        this._loc = point;
        this._id = createId();
    }

    public get id() {
        return this._id;
    }

    public get loc() {
        return this._loc
    }

    public set loc(val: Point) {
        this._loc = val;
    }

    public get type() {
        return this._type;
    }

    public getX() {
        return this.loc.x;
    }

    public getY() {
        return this.loc.y;
    }

    public get minX() {
        return this.loc.x;
    }

    public get minY() {
        return this.loc.y;
    }

    public get maxX() {
        return this.loc.x;
    }

    public get maxY() {
        return this.loc.y;
    }
}