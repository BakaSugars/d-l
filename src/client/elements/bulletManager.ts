import Bullet, { BulletEvent } from './bullet';
import Point from '_src/utils/point';
import EventEmitter from '_src/utils/eventEmitter';
import { ElementOption } from '_src/client/elements/element';
import { Link } from '_src/utils/link';
import { CollsionManager } from '_src/client/elements/collsionManager';

export class BulletManager extends EventEmitter {
    private _bulletLink: Link<Bullet>;
    private _bulletNum: number = 0;
    constructor() {
        super();
    }

    public addBullet(option: ElementOption) {
        this._bulletNum ++;
        const bullet = new Bullet(option);
        const newLink = new Link<Bullet>(bullet);
        if (this._bulletLink) {
            newLink.beforeLink = this._bulletLink;
        }
        this._bulletLink = newLink;
        bullet.once(BulletEvent.DESTROY, () => {
            if (this._bulletLink === newLink) {
                this._bulletLink = newLink.nextLink || newLink.beforeLink;
            }
            newLink.destroy();
            this._bulletNum --;
        });
        return bullet;
    }

    public addCollsionUnit(collsionManager: CollsionManager) {
        this.forEach((bullet: Bullet) => {
            bullet.addCollsionBullet(collsionManager);
        });
    }

    public get bulletNum() {
        return this._bulletNum;
    }

    public forEach(handle: (bullet: Bullet) => any) {
        if (!this._bulletLink) {
            return;
        }
        let nowBullet = this._bulletLink;
        while(nowBullet) {
            handle(nowBullet.value);
            nowBullet = nowBullet.beforeLink;
        }
    }

    public destroy() {
        this.forEach((bullet: Bullet) => {
            bullet.destroy();
        });
        super.destroy();
    }

    public update() {
        this.forEach((bullet: Bullet) => {
            bullet.updateLocation();
        });
    }
}