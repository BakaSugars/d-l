import Event from '_src/utils/event';
import Point from '_src/utils/point';
import Camera from '_src/client/view/camera';

export enum MOUSE_EVENT {
    MOVE = 'mousemove',
    DOWN = 'mousedown',
    UP = 'mouseup',
    LEFTUP = 'mouseup',
    LEFTDOWN = 'leftdown',
    RIGHTDOWN = 'rightdown',
    RIGHTUP = 'rightup'
}

export function mousePos(el: HTMLElement, e: any, rect: ClientRect) {
    e = e.touches ? e.touches[0] : e;
    return new Point(e.clientX - rect.left - el.clientLeft, e.clientY - rect.top - el.clientTop, 0);
}


export class GMouseEvent extends Event {
    private _originEvent: MouseEvent;
    private _el: HTMLElement;
    private _mousePos: Point;
    private _coordinate: Point;
    constructor(type: string, e: MouseEvent, el: HTMLElement, camera: Camera) {
        super(type);
        this._el = el;
        this._originEvent = e;
        const point = new Point(e.clientX, e.clientY, 0);
        const worldCoordinate = camera.pixelToCoordinate(point);
        this._coordinate = worldCoordinate;
    }

    public get mousePos() {
        if (!this._mousePos) {
            this._mousePos = mousePos(this._el, this._originEvent, this._el.getBoundingClientRect());
        }
        return this._mousePos;
    }

    public get coord() {
        return this._coordinate;
    }

    public get originEvent() {
        return this._originEvent;
    }
}