import Shooter from "_src/client/elements/shooter";
import Point from "_src/utils/point";
import Camera from "_src/client/view/camera";
import Keyboard from "_src/client/ui/keyboard";
import { Mouse, MOUSE_EVENT } from "_src/client/ui/mouse";
import Event from "_src/utils/event";

export interface PlayerConfig {
    id: string;
    secret: string;
    camera: Camera;
    keyboard?: Keyboard;
    mouse?: Mouse;
}

export class Player {
    private _secret: string;
    private _id: string;
    private _shooter: Shooter;
    private _camera: Camera;
    private _mouse: Mouse;
    private _keyboard: Keyboard
    constructor(config: PlayerConfig) {
        const {secret, id, camera, keyboard, mouse} = config;
        this._keyboard = keyboard;
        this._mouse = mouse;
        this._secret = secret;
        this._id = id;
        this._camera = camera;
        this._bindKeyboard();
        this._bindMouse();
    }

    public set loc(val: Point) {
        this._shooter.loc = val;
    }

    public get loc() {
        return this._shooter.loc;
    }

    public get camera () {
        return this._camera;
    }

    public set camera(val: Camera) {
        this._camera = val;
    }

    public get shooter() {
        return this._shooter;
    }

    public fitCamera() {
        this._camera.setLoc(this._shooter.loc);
    }

    public createShooter(loc: Point) {
        this._shooter = new Shooter({
            loc,
            uid: this._id,
        });
        return this._shooter;
    }

    private _bindMouse() {
        if (!this._mouse) {
            return false;
        }
        this._bindMouseDown();
        this._mouse.on(MOUSE_EVENT.MOVE, (event: Event) => {
            const coord = event.data;
            const direction = event.data.sub(this._shooter.loc);
            this._shooter.direction = direction.unit();
        });
    }

    private _bindMouseDown () {
        this._mouse.once(MOUSE_EVENT.DOWN, () => {
            this._shooter.startFire();
            this._mouse.once(MOUSE_EVENT.UP, () => {
                this._shooter.endFire();
                this._bindMouseDown();
            });
        });
    }

    private _bindKeyboard() {
        if (!this._keyboard) {
            return false;
        }

        this._keyboard.on('change_speed', (vector: Point) => {
            this.shooter.speed.add(vector);
        });
    }
}