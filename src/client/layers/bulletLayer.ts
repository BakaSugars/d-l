import { Layer } from "_src/client/layers/layer";
import mat4 from "_src/utils/mat4";
import Buffer, { Attribute } from "_src/client/render/buffer";
import Renderer from "_src/client/render/renderer";
import { BulletManager } from "_src/client/elements/bulletManager";
import Shooter from "_src/client/elements/shooter";
import Bullet from "_src/client/elements/bullet";
import Point from "_src/utils/point";

export default class BulletLayer extends Layer {
    private _bulletManagers: BulletManager[] = [];
    protected _vertexBufferByteSize: number = 20
    protected _programType = 'triangle';

    constructor(renderer: Renderer) {
        super(renderer);
        this._initProgram();
    }

    public addBulletManager(shooter: Shooter) {
        this._bulletManagers.push(shooter.bulletManager);
    }

    public update() {
        const segment = this._createSegment();
        let bulletNum = 0;
        this._bulletManagers.forEach((bulletManager: BulletManager) => {
            bulletNum += bulletManager.bulletNum;
        });
        this.vertexArray = new ArrayBuffer(bulletNum * 4 * this._vertexBufferByteSize);
        this._elementArray = new Uint16Array(bulletNum * 6);
        let bulletIndex = 0;
        this._bulletManagers.forEach((manager: BulletManager) => {
            manager.forEach((bullet: Bullet) => {
                this._resolveBullet(bullet, bulletIndex);
                bulletIndex ++;
            });
        });
        segment.vertexLength = bulletNum * 4;
        segment.primitiveLength = bulletNum * 2;
        this._segments = [segment];
    }

    protected _createGLBufferGroup() {
        const attributes: Attribute[] = [];
        attributes.push({
            name: 'a_pos',
            type: 'FLOAT',
            components: 3,
            offset: 0
        });
        attributes.push({
            name: 'a_infos',
            type: 'FLOAT',
            components: 1,
            offset: 12
        });
        attributes.push({
            name: 'a_color',
            type: 'UNSIGNED_BYTE',
            components: 4,
            offset: 16
        });
        return {
            vertexLayoutArrayBuffer: new Buffer(this._gl, this._vertexArray, 'ARRAY_BUFFER', 20, attributes),
            elementArrayBuffer: new Buffer(this._gl, this._elementArray.buffer, 'ELEMENT_ARRAY_BUFFER', 6, [{
                components: 3,
                name: 'vertices',
                offset: 0,
                type: 'UNSIGNED_SHORT'
            }]),
            paintVertexArrayBuffer: null as Buffer,
            segments: this._segments
        }
    }

    private _resolveBullet(s: Bullet, index: number) {
        const beforeIndex = index;
        index = index * 4;
        this._resolveVeretx(s, index, 0, 1);
        this._resolveVeretx(s, index + 1, 1, 1);
        this._resolveVeretx(s, index + 2, 1, 0);
        this._resolveVeretx(s, index + 3, 0, 0);
        let elementOffset = beforeIndex * 6;
        this._elementArray[elementOffset++] = index;
        this._elementArray[elementOffset++] = index + 1;
        this._elementArray[elementOffset++] = index + 2;
        this._elementArray[elementOffset++] = index;
        this._elementArray[elementOffset++] = index + 2;
        this._elementArray[elementOffset++] = index + 3;

    };

    private _resolveVeretx(s: Bullet, index: number, offsetX: number, offsetY: number) {
        const floatOffset = index * this._vertexBufferByteSize / 4;
        const uint8Offset = index * this._vertexBufferByteSize;
        const x = s.loc.x;
        const y = s.loc.y;
        const z = s.loc.z;
        const color = s.color;
        const size = s.size;
        this.float32VertexArray[floatOffset] = x
        this.float32VertexArray[floatOffset + 1] = y;
        this.float32VertexArray[floatOffset + 2] = z;
        const infos = (size * 2 + offsetX) * 2 + offsetY;
        this.float32VertexArray[floatOffset + 3] = infos;
        this.uint8VertexArray[uint8Offset + 16] = color[0];
        this.uint8VertexArray[uint8Offset + 17] = color[1];
        this.uint8VertexArray[uint8Offset + 18] = color[2];
        this.uint8VertexArray[uint8Offset + 19] = color[3];
    }
}