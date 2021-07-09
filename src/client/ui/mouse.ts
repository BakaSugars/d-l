import EventEmitter from "_src/utils/eventEmitter";
import Point from "_src/utils/point";
import Event from "_src/utils/event";
import Camera from "_src/client/view/camera";
import Coordinate from "_src/utils/coordinate";
import { GMouseEvent } from "_src/client/ui/mouseEvent";

export const MOUSE_EVENT = {
    MOVE: 'mousemove',
    DOWN: 'mousedown',
    UP: 'mouseup',
    LEFTUP: 'mouseup',
    LEFTDOWN: 'leftdown',
    RIGHTDOWN: 'rightdown',
    RIGHTUP: 'rightup'
}

enum Button {
    Left,
    Center,
    Right,
}

export class Mouse extends EventEmitter {
    private _element: HTMLElement;
    private _camera: Camera;
    constructor(ele: HTMLElement, camera: Camera) {
        super();
        this._element = ele;
        console.log(this._element);
        this._camera = camera;
        this._element.oncontextmenu = (e) => {
            e.preventDefault();
        };
        document.addEventListener(MOUSE_EVENT.MOVE, this._onMouseMove.bind(this));
        document.addEventListener(MOUSE_EVENT.DOWN, this._onMouseDown.bind(this));
        document.addEventListener(MOUSE_EVENT.UP, this._onMouseUp.bind(this));
    }

    public init(camera: Camera) {
        this._camera = camera;
    }

    private _onMouseMove(e: MouseEvent) {
        this.emit(new GMouseEvent(MOUSE_EVENT.MOVE, e, this._element, this._camera));
    }

    private _onMouseDown(e: MouseEvent) {
        this.emit(new GMouseEvent(MOUSE_EVENT.DOWN, e, this._element, this._camera));
        if (e.button === Button.Left) {
            this._leftDown(e);
        } else if (e.button === Button.Right) {
            this._rightDown(e);
        }
    }

    private _onMouseUp(e: MouseEvent) {
        this.emit(new GMouseEvent(MOUSE_EVENT.UP, e, this._element, this._camera));
        if (e.button === Button.Left) {
            this._leftUp(e);
        } else if (e.button === Button.Right) {
            this._rightUp(e);
        }
    }

    private _leftDown(e: MouseEvent) {
        this.emit(new GMouseEvent(MOUSE_EVENT.LEFTDOWN, e, this._element, this._camera));
    }

    private _leftUp(e: MouseEvent) {
        this.emit(new GMouseEvent(MOUSE_EVENT.LEFTUP, e, this._element, this._camera));
    }

    private _rightDown(e: MouseEvent) {
        this.emit(new GMouseEvent(MOUSE_EVENT.RIGHTDOWN, e, this._element, this._camera));
    }

    private _rightUp(e: MouseEvent) {
        this.emit(new GMouseEvent(MOUSE_EVENT.RIGHTUP, e, this._element, this._camera));
    }
}