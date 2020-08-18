import { EventEmitter } from "events";
import Point from "_src/utils/point";
import { CollsionBase } from "_src/client/elements/collsiionBase";
import { CollsionType } from "_src/client/elements/collsionManager";

export default class CollsionBox extends CollsionBase {
    private _leftTop: Point;
    private _rightBottom: Point;
    constructor(lt: Point, rb: Point, type: CollsionType) {
        super(type);
        this._leftTop = lt;
        this._rightBottom = rb;
    }

    public get lt() {
        return this._leftTop;
    }

    public get rb() {
        return this._rightBottom;
    }

    public intersect(collsionUnit: CollsionBase): boolean {
        if (collsionUnit instanceof CollsionBox) {
            return this._intersectBox(collsionUnit);
        }
        return false;
    }

    private _intersectBox(box: CollsionBox): boolean {
        if (
            this.lt.x <= box.rb.x &&
            this.lt.y <= box.rb.y &&
            this.lt.x >= box.lt.x &&
            this.lt.y >= box.lt.y
        ) {
            return true;
        }
        if (
            box.lt.x <= this.rb.x &&
            box.lt.y <= this.rb.y &&
            box.lt.x >= this.lt.x &&
            box.lt.y >= this.lt.y
        ) {
            return true;
        }
        return false;
    }
}