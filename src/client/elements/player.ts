import Shooter from "_src/client/elements/shooter";
import Point from "_src/utils/point";
import Camera from "_src/client/view/camera";

export class Player {
    private _secret: string;
    private _id: string;
    private _shooter: Shooter;
    private _camera: Camera;
    constructor(id: string, secret: string, camera: Camera) {
        this._secret = secret;
        this._id = id;
        this._camera = camera;
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
        this._shooter = new Shooter(loc, this._id, this._secret);
        return this._shooter;
    }
}