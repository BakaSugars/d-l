import GameElement from "./gameElment";
import { Connection } from "../net/connection";
import Point from "_src/utils/point";
import { PlayerMessageType } from "_src/utils/constant";
import Event from "_src/utils/event";

export class Player extends GameElement {
    private _connection: Connection
    constructor(con: Connection) {
        super(null);
        this._connection = con;
        this._connection.on('onmessage', this.onMessage.bind(this));
    }

    public onMessage(data: any) {
        if (data[0] === PlayerMessageType.UPDATE) {
            this.emit(new Event('update', data));
            console.log('update ' + this.id);
            this.updatePlayer(new Int32Array(data));
        }
    }

    public updatePlayer(data: any) {
        this.loc = new Point(data[1], data[2], 0);
    }
}