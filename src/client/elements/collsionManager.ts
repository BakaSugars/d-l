import EventEmitter from "_src/utils/eventEmitter";
import { CollsionBase, CollsionEvent } from "_src/client/elements/collsiionBase";
import { Link } from "_src/utils/link";
import Event from "_src/utils/event";

export enum CollsionType {
    Bullet,
    Shooter,
    Grid,
    Border
}

export interface CollsionOption {
    collisionTypes: CollsionType[],
}

export class CollsionManager extends EventEmitter {
    private _collsionMap: {
        [index: number]: Link<CollsionBase>;
    }
    constructor() {
        super();
    }

    public clear() {
        this._collsionMap  = {};
    }

    public addCollsionUnit(unit: CollsionBase, option: CollsionOption) {
        const { collisionTypes } = option;
        const newLink = new Link<CollsionBase>(unit);
        if (this._collsionMap[unit.type]) {
            this._collsionMap[unit.type].nextLink = newLink;
        }
        this._collsionMap[unit.type] = newLink;
        let destroyFlag = false;
        unit.once(CollsionEvent.Destroy, () => {
            destroyFlag = true;
            newLink.destroy();
        });
        collisionTypes.forEach((collisionType: CollsionType) => {
            let nowLink = this._collsionMap[collisionType];
            while (nowLink) {
                if (destroyFlag) {
                    return;
                }
                const result = nowLink.value.intersect(unit);
                if (result) {
                    nowLink.value.emit(new Event(CollsionEvent.Happen, unit));
                }
            }
        });

    }
}