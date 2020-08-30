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

export interface BulletOption extends ElementOption {
    damage?: number;
}

const DMG_SPEED_K = 0.1
const MIN_DMG = 1;

export default class Bullet extends Element {
    private _lifeTime: number = 5000;
    private _lifeEndTimeout: any;
    protected _collsionUnitType = CollsionType.Bullet;
    private _owner: Shooter;
    private _baseDamage: number = 2;
    constructor(opt: BulletOption) {
        super(opt);
        this.direction = this.speed.clone().unit();
        this._baseDamage = opt.damage || this._baseDamage;
        this._lifeEndTimeout = setTimeout(() => {
            this.destroy();
        }, this._lifeTime);
        this._registEvent();
    }

    public getDamage(element: Element) {
        const speed = this.speed.mag();
        const deltaSpeed = this.speed.clone().unit().multVector(element.speed);
        let resultSpeed = speed + deltaSpeed;
        if (resultSpeed <= 0) {
            return 0;
        }
        if (this.speed.mag() === 0) {
            return 0;
        }
        if (resultSpeed > speed) {
           resultSpeed = speed * 1.51;
        } else {
           resultSpeed = speed * 0.67;
        }
        const dmg = Math.max(Math.round(resultSpeed / speed * this._baseDamage), MIN_DMG);
        return dmg;
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