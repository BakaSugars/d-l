import Point from "_src/utils/point";
import { Element, ElementOption } from "_src/client/elements/element";
import { BulletManager } from "_src/client/elements/bulletManager";
import { CollsionManager, CollsionType } from "_src/client/elements/collsionManager";
import Bullet from "_src/client/elements/bullet";

export interface ShooterOption extends ElementOption {
    uid: string;
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
    protected _collsionUnitType = CollsionType.Shooter;
    constructor(opt: ShooterOption) {
        super(opt);
        const { uid } = opt;
        this._uid = uid;
        this.size = 10;
        this._bulletManager.setParent(this);
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
        this._bulletManager
    }

    public update() {
        this.updateLocation();
        if (this.speed.mag() !== 0) {
            this.speed.sub(this.speed.clone().mult(this._defaultDecSpeed));
        }
        this._bulletManager.update();
    }

    public startFire() {
        const now = Date.now();
        if (now - this._lastFireTime < this._minFireTime) {
            return;
        }
        if (this._setIntervalFire) {
            clearInterval(this._setIntervalFire);
        }
        this._lastFireTime = now;
        this.fire();
        this._setIntervalFire = setInterval(() => {
            this.fire();
        }, this._minFireTime);
    }

    public endFire() {
        if (this._setIntervalFire) {
            clearInterval(this._setIntervalFire);
        }
    }

    public fire() {
        this._bulletManager.addBullet({
            loc: this.loc.clone(),
            speed: this.direction.clone().mult(this._bulletSpeed).add(this.speed),
            color: this._bulletColor,
            size: this._bulletSize
        });
    }
}