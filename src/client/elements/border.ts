import Point from "_src/utils/point";
import { Element } from "_src/client/elements/element";
import CollsionBox from "_src/client/elements/collisionBox";
import { CollsionType, CollsionManager } from "_src/client/elements/collsionManager";
import { BorderElement } from "_src/client/elements/borderElement";

const InfinityNum = 100000;

export class Border {
    private _width: number;
    private _height: number;
    private _gridSize: number;
    private _borderWidth = InfinityNum;
    private _topBorder: BorderElement;
    private _leftBorder: BorderElement;
    private _rightBorder: BorderElement;
    private _bottomBorder: BorderElement;
    private _borders: BorderElement[] = [];
    constructor(width: number, height: number, gridSize: number) {
        this._width = width * gridSize;
        this._height = height * gridSize;
        this._gridSize = gridSize;
        this.initBorders();
    }

    protected _getCollsionPoint() {
        const deltaValueX = this._width / 2;
        const deltaValueY = this._height / 2;
        const deltaPoint = new Point(deltaValueX, deltaValueY, 0);
        return deltaPoint;
    }

    public addCollsionUnit(collisionManager: CollsionManager) {
        this._borders.forEach((border: BorderElement) => {     
            collisionManager.addCollsionUnit(border.collisionUnit, {
                collisionTypes: [
                    CollsionType.Bullet,
                    CollsionType.Shooter
                ]
            });
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

    private initBorders() {
        const half = this._borderWidth / 2;
        this._topBorder = new BorderElement({
            loc: new Point(0, -this._height / 2 - half, 0),
            height: this._borderWidth,
            width: this._width
        });
        this._borders.push(this._topBorder);
        this._rightBorder = new BorderElement({
            loc: new Point(this._width / 2 + half, 0, 0),
            height: this._height,
            width: this._borderWidth
        });
        this._borders.push(this._rightBorder);
        this._leftBorder = new BorderElement({
            loc: new Point(-this._width / 2 - half, 0, 0),
            height: this._height,
            width: this._borderWidth
        });
        this._borders.push(this._leftBorder);
        this._bottomBorder = new BorderElement({
            loc: new Point(0, this._height / 2 + half, 0),
            height: this._borderWidth,
            width: this._width
        });
        this._borders.push(this._bottomBorder);
    }
}