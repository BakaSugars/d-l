import { Element, ElementOption } from "_src/client/elements/element";
import EventEmitter from "_src/utils/eventEmitter";

export enum ActionMode {
    Wait,
    Search,
    Attack
}

export abstract class BaseAi extends EventEmitter {
    protected _myObj: Element;
    protected _targetObj: Element;
    protected _actionMode: ActionMode;
    constructor() {
        super();
        this._actionMode = ActionMode.Wait;
    }

    public set myObj(obj: Element) {
        this._myObj = obj;
    }

    public set targetObj(obj: Element) {
        this._targetObj = obj;
    }

    public set actionMode(mode: ActionMode) {
        this._actionMode = mode;
    }

    public abstract update(): any;

    public destroy() {
        this._myObj = null;
        this._targetObj = null;
        super.destroy();
    }
}