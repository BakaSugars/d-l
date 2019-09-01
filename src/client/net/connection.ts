import EventEmitter from "_src/utils/eventEmitter";
import WSocket from "_src/client/net/ws";
import { wsServerUrl, PlayerMessageType } from "_src/utils/constant";
import { Player } from "_src/client/elements/player";

export class Connection extends EventEmitter {
    private _ws: WSocket;
    private _player: Player
    private _open = false;
    constructor(player: Player) {
        super();
        this._player = player;
        this._ws = new WSocket(wsServerUrl);
        this.on('connect success', this._startPushServer.bind(this));
        this.on('connect closed', this._stopPushServer.bind(this));
    }

    private _startPushServer() {
        if (!this._open) {
            this._open = true;
            const loop = () => {
                window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => {
                        window.requestAnimationFrame(() => {
                            this._updatePlayer();
                            if (this._open)
                            loop();
                        });
                    });
                });
            }
            loop();
        }
    }

    private _updatePlayer() {
        const array = new Int32Array([PlayerMessageType.UPDATE, ...this._player.loc.toArray()]);
        this._ws.send(array.buffer);
    }

    private _stopPushServer() {
        this._open = false;
    }
}