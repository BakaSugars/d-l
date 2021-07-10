import EventEmitter from "_src/utils/eventEmitter";
import Point from "_src/utils/point";

export interface ITouchButtonConfiig {
    container: HTMLElement,
    text: string,
    offset: Point;
    size: Point;
    position: POSITION;
}

export enum POSITION {
    TOP_LEFT = 1,
    TOP_RIGHT = 2,
    BOTTOM_LEFT = 3,
    BOTTOM_RIGHT = 4
}

export class TouchButton extends EventEmitter {
    private _button: HTMLElement;
    private _text: string;
    private _offset: Point;
    private _size: Point;
    private _container: HTMLElement
    private _position: POSITION
    constructor(config: ITouchButtonConfiig) {
        super();
        const {container, text, offset, size, position} = config;
        this._text = text;
        this._offset = offset;
        this._size = size;
        this._container = container;
        this._position = position;
        this._init();
    }

    private _init() {
        this._button = document.createElement('button');
        const PX = 'px';
        this._button.textContent = this._text;
        this._button.style.width = this._size.x + PX;
        this._button.style.height = this._size.y + PX;
        this._button.style.position = 'absolute';
        if (this._position === POSITION.TOP_LEFT) {
            this._button.style.top = this._offset.y + PX;
            this._button.style.left = this._offset.x + PX;
        } else if (this._position === POSITION.TOP_RIGHT) {
            this._button.style.top = this._offset.y + PX;
            this._button.style.right = this._offset.x + PX;
        } else if (this._position === POSITION.BOTTOM_LEFT) {
            this._button.style.bottom = this._offset.y + PX;
            this._button.style.left = this._offset.x + PX;
        } else if (this._position === POSITION.BOTTOM_RIGHT) {
            this._button.style.bottom = this._offset.y + PX;
            this._button.style.right = this._offset.x + PX;
        }
        this._container.appendChild(this._button);
        this._registEvent();
    }

    private _registEvent() {
        this._touchStart = this._touchStart.bind(this);
        this._touchEnd = this._touchEnd.bind(this);
        this._button.addEventListener('touchstart', this._touchStart);
        this._button.addEventListener('touchend', this._touchEnd);
    }

    private _touchStart() {

    }

    private _touchEnd() {

    }
}