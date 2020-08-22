import EventEmitter from "_src/utils/eventEmitter";
import Event from "_src/utils/event";
import { Element } from "_src/client/elements/element";

export enum CollsionEvent {
    Destroy = 'del',
    Happen = 'hal'
}

export abstract class CollsionBase extends EventEmitter {
    private _from: Element;
    constructor() {
        super();
    }

    public get from() {
        return this._from;
    }

    public set from(element: Element) {
        this._from = element;
    }
    
    public abstract intersect(collsionSomething: CollsionBase): boolean;

    public destroy() {
        this.emit(new Event(CollsionEvent.Destroy, this));
        this._from = null;
        super.destroy();
    }
}