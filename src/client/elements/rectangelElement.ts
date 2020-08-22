import { Element, ElementOption } from "_src/client/elements/element";
import Point from "_src/utils/point";

export interface RectElementOption extends ElementOption {
    height: number;
    width: number;
}

export class RectElement extends Element {
    private _height: number;
    private _width: number;
    constructor(option: RectElementOption) {
        super(option);
        this._height = option.height;
        this._width = option.width;
    }

    protected _getCollsionPoint() {
        const deltaValueX = this._width / 2;
        const deltaValueY = this._height / 2;
        const deltaPoint = new Point(deltaValueX, deltaValueY, 0);
        return deltaPoint;
    }
}