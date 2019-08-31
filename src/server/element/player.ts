import GameElement from "./gameElment";
import { Connection } from "../net/connection";
import Point from "_src/utils/point";

export class Player extends GameElement {
    private _connection: Connection
    constructor(con: Connection) {
        super(null);
        this._connection = con;
        this._connection.on('onmessage', this.onMessage.bind(this));
    }

    public onMessage(data: any) {
        console.log(data);
    }
}