export class Connection {
    private _ws: any
    constructor(ws: any) {
        this._ws = ws;
        ws.on('message', this._onMessage);
    }
    
    private _onMessage(message: any) {
        console.log(message);
    }
}