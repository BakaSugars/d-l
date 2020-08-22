import Point from "_src/utils/point";
import { Element, ElementOption } from "_src/client/elements/element";
import { BulletManager } from "_src/client/elements/bulletManager";
import { CollsionManager, CollsionType } from "_src/client/elements/collsionManager";
import Bullet from "_src/client/elements/bullet";
import { CollsionEvent, CollsionBase } from "_src/client/elements/collsiionBase";
import Event from "_src/utils/event";

export interface ShooterOption extends ElementOption {
    uid: string;
    camp: number;
}

export default class Shooter extends Element {
    private _uid: string;
    private _defaultDecSpeed: number = 0.04;
    private _maxFirePerSec = 3;
    private _minFireTime = 1000 / 3;
    private _lastFireTime = 0;
    private _bulletSpeed = 0.1;
    private _bulletManager = new BulletManager;
    private _setIntervalFire: any;
    private _bulletColor = [255, 153, 17, 255];
    private _bulletSize = 6;
    private _lastLoc: Point;
    private _camp: number;
    private _originColor: number[];
    protected _collsionUnitType = CollsionType.Shooter;
    constructor(opt: ShooterOption) {
        super(opt);
        const { uid, camp } = opt;
        this._uid = uid;
        this.size = 10;
        this._camp = opt.camp;
        this._bulletManager.setParent(this);
        this._registEvent();
    }

    public set bulletSize(size: number) {
        this._bulletSize = size;
    }

    public set bulletColor(color: number[]) {
        this._bulletColor = color;
    }

    public set bulletSpeed(speed: number) {
        this._bulletSpeed = speed;
    }

    public set maxFirePerSec(num: number) {
        this._maxFirePerSec = num;
        this._minFireTime = 1000 / num;
    }

    public get uid() {
        return this._uid;
    }

    public get bulletManager() {
        return this._bulletManager;
    }

    public addCollsionUnit(collisionManager: CollsionManager) {
        collisionManager.addCollsionUnit(this._collsionUnit, {
            collisionTypes: [
                CollsionType.Border,
                CollsionType.Bullet
            ]
        });
        this._bulletManager.addCollsionUnit(collisionManager);
    }

    public update() {
        this._lastLoc = this.loc.clone();
        this.updateLocation();
        if (this.speed.mag() !== 0) {
            this.speed.sub(this.speed.clone().mult(this._defaultDecSpeed));
        }
        this._bulletManager.update();
    }

    public startFire() {
        const now = Date.now();
        if (now - this._lastFireTime < this._minFireTime) {
            return false;
        }
        if (this._setIntervalFire) {
            clearInterval(this._setIntervalFire);
        }
        this._lastFireTime = now;
        this.fire();
        this._setIntervalFire = setInterval(() => {
            this.fire();
        }, this._minFireTime);
        return true;
    }

    public endFire() {
        if (this._setIntervalFire) {
            clearInterval(this._setIntervalFire);
        }
    }

    public destroy() {
        this._collsionUnit.destroy();
        this._bulletManager.destroy();
        super.destroy();
    }

    public fire() {
        const bullet = this._bulletManager.addBullet({
            loc: this.loc.clone(),
            speed: this.direction.clone().mult(this._bulletSpeed).add(this.speed),
            color: this._bulletColor,
            size: this._bulletSize
        });
        bullet.owner = this;
    }

    private _judgeEnemyBullet(collsiionBase: CollsionBase) {
        const element = collsiionBase.from as Bullet;
        const uid = element.owner.uid;
        return this._uid !== uid;
    }

    private _registEvent() {
        this._collsionUnit.on(CollsionEvent.Happen, (event: Event) => {
            const byCollison: CollsionBase = event.data;
            const type = byCollison.from.collsionType;
            if (type === CollsionType.Border) {
                this._borderCollision();
            } else if (type === CollsionType.Bullet) {
                this._bulletCollsion(byCollison);
            }
        });
    }

    private _bulletCollsion(collsionUnit: CollsionBase) {
        if (!this._judgeEnemyBullet(collsionUnit)) {
            return;
        }
        if (!this._originColor) {
            this._originColor = this.color;
        }
        this.color = [255, 0, 0, 255];
        const bullet = collsionUnit.from;
        this.speed.add(bullet.speed.mult(bullet.size / this.size));
        collsionUnit.from.destroy();
        setTimeout(() => {
            this.color = this._originColor;
        }, 1000);
    }

    private _borderCollision() {
        this.loc = this._lastLoc;
        this.speed = new Point(0, 0, 0);
    }
}