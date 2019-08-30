import GameElement from "./gameElment";
import { Connection } from "../net/connection";
import Point from "_src/utils/point";

export class Player extends GameElement {
    private _connection: Connection
    constructor(p: Point, con: Connection) {
        super(p);
        this._connection = con;
    }
}