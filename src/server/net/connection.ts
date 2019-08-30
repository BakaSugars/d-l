import EventEmitter from "_src/utils/eventEmitter";
import Event from "_src/utils/event";

export class Connection extends EventEmitter{
    private _ws: any
    constructor(ws: any) {
        super();
        this._ws = ws;
        ws.on('message', this._onMessage.bind(this));
    }

    public send(msg: ArrayBuffer) {
        this._ws.send(msg);
    } 
    
    private _onMessage(message: any) {
        this.emit(new Event('onmessage', message));
        console.log(message);
    }
}