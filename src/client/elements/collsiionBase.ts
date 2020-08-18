import EventEmitter from "_src/utils/eventEmitter";
import { CollsionType } from "_src/client/elements/collsionManager";
import Event from "_src/utils/event";

export enum CollsionEvent {
    Destroy = 'del',
    Happen = 'hal'
}

export abstract class CollsionBase extends EventEmitter {
    private _type: CollsionType;
    constructor(type: CollsionType) {
        super();
        this._type = type;
    }
    
    public get type() {
        return this._type;
    }

    public abstract intersect(collsionSomething: CollsionBase): boolean;

    public destroy() {
        this.emit(new Event(CollsionEvent.Destroy, this));
        super.destroy();
    }
}