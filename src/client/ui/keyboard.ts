import EventEmitter from "_src/utils/eventEmitter";
import Event from "_src/utils/event";
import Point from "_src/utils/point";

export const enum KeyCode {
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
    Q = 81,
    E = 69,
    W = 87,
    S = 83,
    A = 65,
    D = 68,
    Plus = 187,
    Minus = 189,
    PlusFirefox = 61,
    MinusFirefox = 173
}

export const SPEED_BASE = 0.01;
const speedMap = {
};
speedMap[KeyCode.W] = new Point(0, -1, 0);
speedMap[KeyCode.A] = new Point(-1, 0, 0);
speedMap[KeyCode.S] = new Point(0, 1, 0);
speedMap[KeyCode.D] = new Point(1, 0, 0);

export default class Keyboard extends EventEmitter{
    private _element: HTMLElement;
    private _nowFrameEvent: {[index: number]: Point} = {};
    constructor(element: HTMLElement) {
        super();
        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
        this._element = element;
        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);
        this._getNowFrameEvent();
    }

    private keyDown(e: KeyboardEvent) {
        const keyCode = e.keyCode;
        if (speedMap[keyCode]) {
            this._nowFrameEvent[keyCode] = speedMap[keyCode];
        }
    }

    private keyUp(e: KeyboardEvent) {
        const keyCode = e.keyCode;
        if (this._nowFrameEvent[e.keyCode]) {
            delete this._nowFrameEvent[e.keyCode]
        }
    }

    private _getNowFrameEvent() {
        const loop = () => {
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    const vector = new Point(0, 0, 0);
                    Object.keys(this._nowFrameEvent).forEach((key: string) => {
                        vector.add(this._nowFrameEvent[key]);
                    });
                    if (vector.mag() === 0) {
                        loop();
                        return;
                    }
                    vector.unit();
                    vector.mult(SPEED_BASE);
                    this.emit(new Event('change_speed', vector));
                    loop();
                });
            });
        }
        loop();
    }
}