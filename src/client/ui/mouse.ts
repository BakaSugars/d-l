import EventEmitter from "_src/utils/eventEmitter";
import Point from "_src/utils/point";
import Event from "_src/utils/event";
import Camera from "_src/client/view/camera";

export const MOUSE_EVENT = {
    MOVE: 'mousemove',
    DOWN: 'mousedown',
    UP: 'mouseup',
}

export class Mouse extends EventEmitter {
    private _element: HTMLElement;
    private _camera: Camera;
    constructor(ele: HTMLElement, camera: Camera) {
        super();
        this._element = ele;
        this._camera = camera;
        document.addEventListener(MOUSE_EVENT.MOVE, this._onMouseMove.bind(this));
        document.addEventListener(MOUSE_EVENT.DOWN, this._onMouseDown.bind(this));
        document.addEventListener(MOUSE_EVENT.UP, this._onMouseUp.bind(this));
    }

    public init(camera: Camera) {
        this._camera = camera;
    }

    private _onMouseMove(e: MouseEvent) {
        const worldCoordinate = this._getMouseCoordinate(e);
        this.emit(new Event(MOUSE_EVENT.MOVE, worldCoordinate));
    }

    private _onMouseDown(e: MouseEvent) {
        const coord = this._getMouseCoordinate(e);
        this.emit(new Event(MOUSE_EVENT.DOWN, coord));
    }
    private _onMouseUp(e: MouseEvent) {
        const coord = this._getMouseCoordinate(e);
        this.emit(new Event(MOUSE_EVENT.UP, coord));
    }

    private _getMouseCoordinate(e: MouseEvent) {
        const point = new Point(e.clientX, e.clientY, 0);
        const worldCoordinate = this._camera.pixelToCoordinate(point);
        return worldCoordinate;
    }
}