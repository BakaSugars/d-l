import Point from "_src/utils/point";
import mat4 from "_src/utils/mat4";
import { ViewPort } from "_src/client/view/viewPort";

export default class Camera {
    private _loc: Point = new Point(0, 0, 0);
    private _mvpMatrix: mat4
    private _pixelHeight: number;
    private _pixelWidth: number;
    private _fov = 0.4435011087932844;
    private _pixelToWorldCenter: number;
    private _currentPitch: number = 0;
    private _currentAngle: number = 0;
    private _viewPixelDistance: number;
    private _modelViewMatrix: mat4;
    private _projMatrix: mat4;
    private _scale: number = 1;
    private _pixelMatrix: mat4;
    private _pixelMatrixReverse: mat4;

    constructor(viewport: ViewPort) {
        this._pixelHeight = viewport.canvas.offsetHeight;
        this._pixelWidth = viewport.canvas.offsetWidth;
        this.setLoc(new Point(0, 0, 0));
    }

    public get mvpMatrix() {
        return this._mvpMatrix;
    }

    public setLoc(loc: Point) {
        this._loc = loc;
        this._updateMVPMatrix();
        this._updatePixelMatrix();
    }

    public setPitch(pitch: number) {
        this._currentPitch = pitch;
        this._updateMVPMatrix();
        this._updatePixelMatrix();
    }

    public setAngle(angle: number) {
        this._currentAngle = angle;
        this._updateMVPMatrix();
        this._updatePixelMatrix();
    }

    private _updateMVPMatrix() {
        this._pixelToWorldCenter = 0.5 * this._pixelHeight / Math.tan(this._fov / 2);
        const worldAngle = this._currentPitch + Math.PI / 2;
        const centerToViewTopLinePixel = this._pixelToWorldCenter * Math.sin(this._fov / 2);
        const maxHalfScreenPixel = centerToViewTopLinePixel / Math.sin(Math.PI / 2 - this._fov / 2 - this._currentPitch);
        this._viewPixelDistance =
            (maxHalfScreenPixel * Math.cos(Math.PI / 2 - this._currentPitch) + this._pixelToWorldCenter) * 1.01;
        const aspect = this._pixelWidth / this._pixelHeight;

        // We will use model-view matrix sometimes, so we need to save it.
        this._modelViewMatrix = mat4.create();
        mat4.scale(this._modelViewMatrix, this._modelViewMatrix, [1, -1, 1]);
        mat4.translate(this._modelViewMatrix, this._modelViewMatrix, [0, 0, -this._pixelToWorldCenter]);
        mat4.rotateX(this._modelViewMatrix, this._modelViewMatrix, this._currentPitch);
        mat4.rotateZ(this._modelViewMatrix, this._modelViewMatrix, this._currentAngle);
        mat4.translate(this._modelViewMatrix, this._modelViewMatrix, [
            -this._loc.x * this._scale,
            -this._loc.y * this._scale,
            0
        ]);
        mat4.scale(this._modelViewMatrix, this._modelViewMatrix, [1, 1, this._scale, 1]);

        this._projMatrix = mat4.create();
        mat4.perspective(this._projMatrix, this._fov, aspect, 1, this._viewPixelDistance);

        this._mvpMatrix = mat4.create();
        mat4.multiply(this._mvpMatrix, this._projMatrix, this._modelViewMatrix);
    }

    private _updatePixelMatrix() {
        const m = mat4.create();
        mat4.scale(m, m, [this._pixelWidth / 2, -this._pixelHeight / 2, 1]);
        mat4.translate(m, m, [1, -1, 0]);
        mat4.multiply(m, m, this._mvpMatrix);
        this._pixelMatrix = m;
        this._pixelMatrixReverse = mat4.invert(mat4.create(), this._pixelMatrix);
        if (!this._pixelMatrixReverse) {
            throw new Error('Fail to reverse pixel matrix');
        }
    }
}