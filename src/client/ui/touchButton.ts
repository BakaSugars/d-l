import EventEmitter from "_src/utils/eventEmitter";
import Point from "_src/utils/point";
import Event from "_src/utils/event";

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

export enum BUTTON_EVENT {
    DOWN = "BUTTONDOWN",
    UP = "BUTTONUP"
}

document.body.addEventListener('touchmove', function (e) {
	e.preventDefault();
	e.stopPropagation();
}, {passive: false})

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

    public get text() {
        return this._text;
    }

    private _init() {
        this._button = document.createElement('button');
        const PX = 'px';
        this._button.textContent = this._text;
        this._button.style.width = this._size.x + PX;
        this._button.style.height = this._size.y + PX;
        this._button.style.position = 'absolute';
        this._button.style.userSelect = 'none';
        this._button.style.opacity = '0.3';
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
        this._button.addEventListener('mousedown', this._touchStart);
        this._button.addEventListener('mouseup', this._touchEnd);
    }

    private _touchStart(e: TouchEvent) {
        e.stopPropagation();
        this.emit(new Event(BUTTON_EVENT.DOWN, this))
    }

    private _touchEnd(e: TouchEvent) {
        e.stopPropagation();
        this.emit(new Event(BUTTON_EVENT.UP, this));
    }
}