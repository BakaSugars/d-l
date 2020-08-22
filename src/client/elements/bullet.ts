import Point from "_src/utils/point";
import EventEmitter from "_src/utils/eventEmitter";
import Event from "_src/utils/event";
import { Element, ElementOption } from "_src/client/elements/element";
import { CollsionType, CollsionManager } from "_src/client/elements/collsionManager";
import Shooter from "_src/client/elements/shooter";
import { CollsionEvent, CollsionBase } from "_src/client/elements/collsiionBase";

export const BulletEvent = {
    DESTROY: 'del',
}

export default class Bullet extends Element {
    private _lifeTime: number = 5000;
    private _lifeEndTimeout: any;
    protected _collsionUnitType = CollsionType.Bullet;
    private _owner: Shooter;
    constructor(opt: ElementOption) {
        super(opt);
        this.direction = this.speed.clone().unit();
        this._lifeEndTimeout = setTimeout(() => {
            this.destroy();
        }, this._lifeTime);
        this._registEvent();
    }

    public get owner() {
        return this._owner;
    }

    public set owner(shooter: Shooter) {
        this._owner = shooter;
    }

    public addCollsionBullet(collsionManager: CollsionManager) {
        collsionManager.addCollsionUnit(this._collsionUnit, {
            collisionTypes: [
                CollsionType.Shooter,
                CollsionType.Border
            ]
        });
    }

    public destroy() {
        clearTimeout(this._lifeEndTimeout);
        this._owner = null;
        this.emit(new Event(BulletEvent.DESTROY, this));
        super.destroy();
    }

    private _registEvent() {
        this._collsionUnit.on(CollsionEvent.Happen, (event: Event) => {
            const byCollsion: CollsionBase = event.data;
            const type = byCollsion.from.collsionType;
            if (type === CollsionType.Border) {
                this._borderCollsion();
            }
        });
    }

    private _borderCollsion() {
        this.destroy();
    }
}