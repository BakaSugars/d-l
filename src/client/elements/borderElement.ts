import { RectElement, RectElementOption } from "_src/client/elements/rectangelElement";
import { CollsionType } from "_src/client/elements/collsionManager";

export class BorderElement extends RectElement {
    protected _collsionUnitType = CollsionType.Border;
    constructor(option: RectElementOption) {
        super(option);
        this.updateLocation();
    }

    public get collisionUnit() {
        return this._collsionUnit;
    }
}