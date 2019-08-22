import { EventEmitter } from "events";

const SocketStatus = {
    Connecting: 0,
    Connected: 1,
    Closed: 2,
}

export default class WSocket extends EventEmitter {
    private _ws: WebSocket;
    private _status: number = SocketStatus.Connecting;
    constructor(url: string) {
        super();
        this._ws = new WebSocket(url);
        this._ws.onmessage = this._onMessage.bind(this);
        this._ws.onopen = this._onOpen.bind(this);
        this._ws.onclose = this._onClose.bind(this);
    }

    private _onOpen() {
        console.log('connect success');
        this._status = SocketStatus.Connected;
    }

    private _onMessage(e: any) {
        console.log(e.data);
    }

    private _onClose() {
        console.log('connnect closed');
        this._status = SocketStatus.Closed;
    }
}