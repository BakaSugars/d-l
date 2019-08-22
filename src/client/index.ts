import { Player } from "_src/client/elements/player";
import { Scene } from "_src/client/elements/scene";
import Renderer from "_src/client/render/renderer";
import Camera from "_src/client/view/camera";
import { ViewPort } from "_src/client/view/viewPort";
import Keyboard from "_src/client/ui/keyboard";
import EventEmitter from "_src/utils/eventEmitter";
import Point from "_src/utils/point";
import WSocket from "./net/ws";
import { wsServerUrl } from "_src/utils/constant";


export class Game extends EventEmitter{
    private _scene: Scene;
    private _renderer: Renderer;
    private _viewPort: ViewPort;
    private _player: Player;
    private _keyBoard: Keyboard;
    private _ws: WSocket;
    constructor() {
        super();
        const element = document.getElementById('game') as HTMLCanvasElement;
        this._viewPort = new ViewPort(element);
        this._renderer = new Renderer(element);
        this._scene = new Scene(10, 10, this._renderer);
        this._keyBoard = new Keyboard(element);
        this._ws = new WSocket(wsServerUrl);
    }

    public connectPlayer() {
        const camera = new Camera(this._viewPort);
        this._player = new Player('shujingwei', 'sjwsjw', camera);
        this._scene.joinPlayer(this._player);
        this._keyBoard.on('change_speed', (vector: Point) => {
            this._player.shooter.speed.add(vector);
        });
    }
    
    public framePaint() {
        const loop = () => {
            window.requestAnimationFrame(() => {
                this._scene.setView(this._player);
                this._renderer.clearColor([0, 0, 0, 50]);
                this._scene.draw();
                loop();
            });
        }
        loop();
    }

    public start() {
        this.framePaint();
    }
}

const game = new Game();
game.connectPlayer();
game.start();


