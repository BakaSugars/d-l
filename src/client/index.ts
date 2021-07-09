import { Player } from "_src/client/elements/player";
import { Scene } from "_src/client/elements/scene";
import Renderer from "_src/client/render/renderer";
import Camera from "_src/client/view/camera";
import { ViewPort } from "_src/client/view/viewPort";
import Keyboard from "_src/client/ui/keyboard";
import EventEmitter from "_src/utils/eventEmitter";
import Point from "_src/utils/point";
// import WSocket from "./net/ws";
import { wsServerUrl } from "_src/utils/constant";
import { Connection } from "_src/client/net/connection";
import { Mouse } from "_src/client/ui/mouse";


export class Game extends EventEmitter{
    private _scene: Scene;
    private _renderer: Renderer;
    private _viewPort: ViewPort;
    private _player: Player;
    private _connection: Connection;
    private _container: HTMLElement;
    constructor() {
        super();
        const element = document.getElementById('game') as HTMLCanvasElement;
        this._viewPort = new ViewPort(element);
        this._renderer = new Renderer(element);
        this._scene = new Scene(30, 30, this._renderer);
        this._container = element;
    }

    public connectPlayer() {
        const camera = new Camera(this._viewPort);
        const keyboard = new Keyboard(this._container);
        const mouse = new Mouse(this._container, camera);
        this._player = new Player({
            id: 'shujingwei',
            secret: 'sjwsjw',
            camera,
            keyboard,
            mouse
        });
        this._scene.joinPlayer(this._player);
        // this._connection = new Connection(this._player);
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


