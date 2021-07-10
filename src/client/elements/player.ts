import Shooter from "_src/client/elements/shooter";
import Point from "_src/utils/point";
import Camera from "_src/client/view/camera";
import Keyboard from "_src/client/ui/keyboard";
import { Mouse, MOUSE_EVENT } from "_src/client/ui/mouse";
import Event from "_src/utils/event";
import { GMouseEvent } from "_src/client/ui/mouseEvent";
import { UIElement } from "../ui/uiElement";

export interface PlayerConfig {
    id: string;
    secret: string;
    camera: Camera;
    keyboard?: Keyboard;
    mouse?: Mouse;
    uiElement?: UIElement;
}

export class Player {
    private _secret: string;
    private _id: string;
    private _shooter: Shooter;
    private _camera: Camera;
    private _mouse: Mouse;
    private _keyboard: Keyboard;
    private _uiElement: UIElement;
    constructor(config: PlayerConfig) {
        const {secret, id, camera, keyboard, mouse, uiElement} = config;
        this._keyboard = keyboard;
        this._mouse = mouse;
        this._uiElement = uiElement;
        this._secret = secret;
        this._id = id;
        this._camera = camera;
        this._bindKeyboard();
        this._bindMouse();
        this._bindUIElement();
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
            camp: 0
        });
        return this._shooter;
    }

    private _bindMouse() {
        if (!this._mouse) {
            return false;
        }
        this._bindMouseDown();
        this._mouse.on(MOUSE_EVENT.MOVE, (event: GMouseEvent) => {
            const direction = event.coord.sub(this._shooter.loc);
            this._shooter.direction = direction.unit();
        });
    }

    private _bindMouseDown () {
        this._bindLeft();
        this._bindRight();
    }

    private _bindLeft() {
        this._mouse.once(MOUSE_EVENT.LEFTDOWN, () => {
            this._shooter.startFire();
            this._mouse.once(MOUSE_EVENT.LEFTUP, () => {
                this._shooter.endFire();
                this._bindLeft();
            });
        });
    }

    private _bindRight() {
        const pitchK = 0.01;
        const angleK = 0.01;
        this._mouse.once(MOUSE_EVENT.RIGHTDOWN, (e: GMouseEvent) => {
            let cb: (e: GMouseEvent) => any;
            let beforeLoc = e.mousePos;
            console.log(beforeLoc);
            this._mouse.on(MOUSE_EVENT.MOVE, cb = (e: GMouseEvent) => {
                const nowLoc = e.mousePos;

                const deltaPoint = nowLoc.clone().sub(beforeLoc);
                const deltaAngle = deltaPoint.x * angleK;
                const deltaPitch = deltaPoint.y * pitchK;

                this._camera.setAngle(this._camera.angle - deltaAngle);
                this._camera.setPitch(this._camera.pitch + deltaPitch);

                beforeLoc = nowLoc;
            });
            this._mouse.once(MOUSE_EVENT.RIGHTUP, () => {
                this._mouse.off(MOUSE_EVENT.MOVE, cb);
                this._bindRight();
            });
        });
    }

    private _bindKeyboard() {
        if (!this._keyboard) {
            return false;
        }

        this._keyboard.on('change_speed', (e: Event) => {
            const vector = e.data;
            const angle = this._camera.angle;
            this.shooter.speed.add(vector.rotate(-angle));
        });
    }

    private _bindUIElement() {
        if (!this._uiElement) {
            return false;
        }

        this._uiElement.on('change_speed', (e: Event) => {
            console.log('e', e);
            const vector = e.data;
            const angle = this._camera.angle;
            this.shooter.speed.add(vector.rotate(-angle));
        });
    }
}