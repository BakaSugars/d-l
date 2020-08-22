import { EventEmitter } from "events";
import Point from "_src/utils/point";
import { CollsionBase } from "_src/client/elements/collsiionBase";
import { CollsionType } from "_src/client/elements/collsionManager";

export default class CollsionBox extends CollsionBase {
    private _leftTop: Point;
    private _rightBottom: Point;
    constructor(lt: Point, rb: Point) {
        super();
        this._leftTop = lt;
        this._rightBottom = rb;
    }

    public get center() {
        return this.lt.clone().add(this.rb).div(2);
    }

    public get width() {
        return this.rb.x - this.lt.x;
    }

    public get height() {
        return this.rb.y - this.lt.y;
    }

    public get lt() {
        return this._leftTop;
    }

    public get rb() {
        return this._rightBottom;
    }

    public set lt(lt: Point) {
        this._leftTop = lt;
    }

    public set rb(rb: Point) {
        this._rightBottom = rb;
    }

    public intersect(collsionUnit: CollsionBase): boolean {
        if (collsionUnit instanceof CollsionBox) {
            return this._intersectBox(collsionUnit);
        }
        return false;
    }

    private _intersectBox(box: CollsionBox): boolean {
        const deltaX = Math.abs(box.center.x - this.center.x);
        const deltaY = Math.abs(box.center.y - this.center.y);
        const toleranceX = (this.width + box.width) / 2;
        const toleranceY = (this.height + box.height) / 2;
        if (deltaX <= toleranceX && deltaY <= toleranceY) {
            return true;
        }
        return false;
    }
}