import Point from "_src/utils/point";
import mat4 from "_src/utils/mat4";
import { ViewPort } from "_src/client/view/viewPort";
import vec4 from "_src/utils/vec4";

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
    private _directionVPInverseMatrix: mat4;

    constructor(viewport: ViewPort) {
        this._pixelHeight = viewport.canvas.offsetHeight;
        this._pixelWidth = viewport.canvas.offsetWidth;
        this.setLoc(new Point(0, 0, 0));
        this.setPitch(1);
    }

    public get vpInverseMatrix() {
        return this._directionVPInverseMatrix;
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

    public pixelToCoordinate(pixel: Point): Point {
        const A = vec4.create();
        const B = vec4.create();
        vec4.transformMat4(A, [pixel.x, pixel.y, 0, 1], this._pixelMatrixReverse);
        vec4.transformMat4(B, [pixel.x, pixel.y, 1, 1], this._pixelMatrixReverse);
        const x = (A[2] / A[3] * B[0] / B[3] - A[0] / A[3] * B[2] / B[3]) / (A[2] / A[3] - B[2] / B[3]);
        const y = (A[2] / A[3] * B[1] / B[3] - B[2] / B[3] * A[1] / A[3]) / (A[2] / A[3] - B[2] / B[3]);
        const point = new Point(x, y, 0);
        const testp = vec4.create();
        vec4.transformMat4(testp, [x, y, 0, 1], this._modelViewMatrix);
        if (testp[2] >= 0) {
            console.warn('The point are beyond the scope of the screen and the projection is incorrect.');
        }
        return point;
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

        // get vp inverse matrix for skybox
        const directionVpMatrix = mat4.create();
        mat4.copy(directionVpMatrix, this._modelViewMatrix);
        directionVpMatrix[12] = 0;
        directionVpMatrix[13] = 0;
        directionVpMatrix[14] = 0;
        mat4.multiply(directionVpMatrix, this._projMatrix, directionVpMatrix);

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