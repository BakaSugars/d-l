import Point from "_src/utils/point";
import { Element } from "_src/client/elements/element";
import CollsionBox from "_src/client/elements/collisionBox";
import { CollsionType, CollsionManager } from "_src/client/elements/collsionManager";

export class Border extends Element {
    private _width: number;
    private _height: number;
    private _gridSize: number;
    protected _collsionUnitType = CollsionType.Border;
    constructor(width: number, height: number, gridSize: number) {
        super({
            loc: new Point(0, 0, 0),
            speed: new Point(0, 0, 0)
        })
        this._width = width * gridSize;
        this._height = height * gridSize;
        this._gridSize = gridSize;
    }

    public updateCollsionUnit() {
        const deltaValueX = this._width / 2;
        const deltaValueY = this._height / 2;
        const deltaPoint = new Point(deltaValueX, deltaValueY, 0);
        this._collsionUnit = new CollsionBox(
            this.loc.clone().sub(deltaPoint),
            this.loc.clone().add(deltaPoint),
            this._collsionUnitType
        )
    }

    public addCollsionUnit(collisionManager: CollsionManager) {
        collisionManager.addCollsionUnit(this._collsionUnit, {
            collisionTypes: [
                CollsionType.Bullet,
                CollsionType.Bullet
            ]
        });
    }
    
    public inBorder(p: Point) {
        if (p.x < -this._width / 2 || p.x > this._width / 2) {
            return false;
        }
        if (p.y < -this._height / 2 || p.y > this._height / 2) {
            return false;
        }
    }
}