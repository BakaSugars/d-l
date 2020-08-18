import Point from "_src/utils/point";
import EventEmitter from "_src/utils/eventEmitter";
import Event from "_src/utils/event";
import { Element, ElementOption } from "_src/client/elements/element";
import { CollsionType, CollsionManager } from "_src/client/elements/collsionManager";

export const BulletEvent = {
    DESTROY: 'del',
}

export default class Bullet extends Element {
    private _lifeTime: number = 5000;
    private _lifeEndTimeout: any;
    protected _collsionUnitType = CollsionType.Bullet;
    constructor(opt: ElementOption) {
        super(opt);
        this.direction = this.speed.clone().unit();
        this._lifeEndTimeout = setTimeout(() => {
            this.destroy();
        }, this._lifeTime);
        this._collsionUnitType = CollsionType.Bullet;
    }

    public addCollsionBullet(collsionManager: CollsionManager) {
        collsionManager.addCollsionUnit(this._collsionUnit, {
            collisionTypes: [
                CollsionType.Bullet,
                CollsionType.Shooter,
                CollsionType.Border
            ]
        });
    }

    public destroy() {
        clearTimeout(this._lifeEndTimeout);
        this.emit(new Event(BulletEvent.DESTROY, this));
        super.destroy();
    }
}