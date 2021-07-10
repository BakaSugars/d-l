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
import { UIElement } from "_src/client/ui/uiElement";


export class Game extends EventEmitter{
    private _scene: Scene;
    private _renderer: Renderer;
    private _viewPort: ViewPort;
    private _player: Player;
    private _connection: Connection;
    private _container: HTMLElement;
    private _canvas: HTMLCanvasElement;
    private _uiElement: UIElement;
    constructor() {
        super();
        const container = document.getElementById('gameContainer');
        this._container = container;
        this._uiElement = new UIElement(this._container);
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        container.appendChild(canvas);
        canvas.id = 'game';
        this._viewPort = new ViewPort(canvas);
        this._renderer = new Renderer(canvas);
        this._scene = new Scene(30, 30, this._renderer);
        this._canvas = canvas;
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
            mouse,
            uiElement: this._uiElement
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


