import EventEmitter from "_src/utils/eventEmitter";
import { TouchButton, POSITION } from "_src/client/ui/touchButton";
import Point from "_src/utils/point";

export class UIElement extends EventEmitter {
    private _element: HTMLElement;
    private _container: HTMLElement;
    private _buttons: TouchButton[];
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
    }

    private _initButton() {
        const globalOffset = new Point(20, 20, 0);
        const buttonSize = new Point(40, 40, 0);
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
            },
            {
                text: 'fire',
                offset: globalOffset,
                position: POSITION.BOTTOM_RIGHT
            }
        ];
        buttonConfigs.forEach((config) => {
            const {text, offset, position} = config;
            const upButton = new TouchButton({
                container: this._element,
                text,
                offset,
                position,
                size: buttonSize
            });
        });
    }
}