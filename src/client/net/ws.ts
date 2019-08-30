import EventEmitter from "_src/utils/eventEmitter";
import Event from "_src/utils/event";

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

    public send(msg: ArrayBuffer) {
        this._ws.send(msg);
    }

    private _onOpen() {
        console.log('connect success');
        this.emit(new Event('consuccess'));
        this._status = SocketStatus.Connected;
    }

    private _onMessage(e: any) {
        this.emit(new Event('onmessage', e.data));
        console.log('get message');
    }

    private _onClose() {
        console.log('connnect closed');
        this.emit(new Event('conclose'));
        this._status = SocketStatus.Closed;
    }
}