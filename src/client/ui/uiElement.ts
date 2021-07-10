import EventEmitter from "_src/utils/eventEmitter";
import { TouchButton, POSITION, BUTTON_EVENT } from "_src/client/ui/touchButton";
import Point from "_src/utils/point";
import Event from "_src/utils/event";
import { SPEED_BASE } from "./keyboard";

const speedMap = {
};
speedMap['w'] = new Point(0, -1, 0);
speedMap['a'] = new Point(-1, 0, 0);
speedMap['s'] = new Point(0, 1, 0);
speedMap['d'] = new Point(1, 0, 0);

export class UIElement extends EventEmitter {
    private _element: HTMLElement;
    private _container: HTMLElement;
    private _buttons: TouchButton[] = [];
    private _nowFrameEvent: {[index: number]: Point} = {};
    constructor(container: HTMLElement) {
        super();
        this._container = container;
        this._init();
    }

    private _init() {
        this._element = document.createElement('div');
        this._element.style.height = '100%';
        this._element.style.width = '100%';
        this._element.style.position = 'absolute';
        this._container.appendChild(this._element);
        this._initButton();
        this._registEvent();
        this._getNowFrameEvent();
    }

    private _initButton() {
        const globalOffset = new Point(20, 20, 0);
        const buttonSize = new Point(80, 80, 0);
        const margin = 5;
        const buttonConfigs = [
            {
                text: 'a',
                offset: globalOffset,
                position: POSITION.BOTTOM_LEFT
            },
            {
                text: 's',
                offset: globalOffset.clone().add(new Point(buttonSize.x + margin, 0, 0)),
                position: POSITION.BOTTOM_LEFT
            },
            {
                text: 'd',
                offset: globalOffset.clone().add(
                    new Point(buttonSize.x * 2 + margin * 2, 0, 0)
                ),
                position: POSITION.BOTTOM_LEFT
            },
            {
                text: 'w',
                offset: globalOffset.clone().add(
                    new Point(buttonSize.x + margin, buttonSize.y + margin, 0)
                ),
                position: POSITION.BOTTOM_LEFT
            }
        ];
        buttonConfigs.forEach((config) => {
            const {text, offset, position} = config;
            const button = new TouchButton({
                container: this._element,
                text,
                offset,
                position,
                size: buttonSize
            });
            this._buttons.push(button);
            button.setParent(this);
        });
    }

    private _registEvent() {
        this._onButtonUp = this._onButtonUp.bind(this);
        this._onButtonDown = this._onButtonDown.bind(this);
        this.on(BUTTON_EVENT.DOWN, this._onButtonDown);
        this.on(BUTTON_EVENT.UP, this._onButtonUp);
    }

    private _onButtonDown(e: Event) {
        const button = e.data as TouchButton;
        const text = button.text;
        console.log(text);
        this._nowFrameEvent[text] = speedMap[text];
    }

    private _onButtonUp(e: Event) {
        const button = e.data as TouchButton;
        const text = button.text;
        if (this._nowFrameEvent[text]) {
            delete this._nowFrameEvent[text]
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