import EventEmitter from "_src/utils/eventEmitter";
import * as rbush from 'rbush';
import GameElement from "./gameElment";
import { Player } from "_src/server/element/player";

export default class World extends EventEmitter {
    private _width: number;
    private _height: number;
    private _elementBush: rbush.RBush<GameElement>;
    private _playerMap: { [index: string]: Player } = {};
    constructor(width: number, height: number) {
        super();
        this._width = width;
        this._height = height;
        this._elementBush = rbush() as rbush.RBush<GameElement>;
    }

    public addPlayer(player: Player) {
        this._playerMap[player.id] = player;
        let cb: any;
        player.on('update', cb = () => {
            this.addGameElement(player);
            player.off('update', cb);
        });
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