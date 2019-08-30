import EventEmitter from "_src/utils/eventEmitter";
import * as rbush from 'rbush';
import GameElement from "./gameElment";

export default class World extends EventEmitter {
    private _width: number;
    private _height: number;
    private _elementBush: rbush.RBush<GameElement>;
    constructor(width: number, height: number) {
        super();
        this._width = width;
        this._height = height;
        this._elementBush = rbush() as rbush.RBush<GameElement>;
    }

    public addGameElement(el: GameElement) {
        this._elementBush.insert(el);
    }

    public removeGameElement(el: GameElement) {
        this._elementBush.remove(el);
    }

    public searchElement(el: GameElement, width: number) {
        return this._elementBush.search({
            minX: el.getX() - width,
            minY: el.getY() - width,
            maxX: el.getX() + width,
            maxY: el.getY() + width
        })
    }
}