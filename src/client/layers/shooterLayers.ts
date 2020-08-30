import { Layer } from "_src/client/layers/layer";
import Shooter from "_src/client/elements/shooter";
import mat4 from "_src/utils/mat4";
import Buffer, { Attribute } from "_src/client/render/buffer";
import Renderer from "_src/client/render/renderer";
import Point from "_src/utils/point";

export default class ShooterLayer extends Layer {
    private _shooters: Shooter[] = [];
    protected _vertexBufferByteSize: number = 20
    protected _programType = 'circle';

    constructor(renderer: Renderer) {
        super(renderer);
        this._initProgram();
    }

    public get shooters() {
        return this._shooters;
    }

    public addShooter(shooter: Shooter) {
        this._shooters.push(shooter);
    }

    public update () {
        const segment = this._createSegment();
        const shooterNum = this._shooters.length + 1;
        this.vertexArray = new ArrayBuffer(this._vertexBufferByteSize * shooterNum * 4);
        this._elementArray = new Uint16Array(shooterNum * 6);
        this._shooters.forEach((s: Shooter, index: number) => {
            if (s.destroyed) {
                return;
            }
            this._resolveShooter(s, index);
        });
        segment.vertexLength = shooterNum * 4;
        segment.primitiveLength = shooterNum * 2;
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

    private _resolveShooter(s: Shooter, index: number) {
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

    private _resolveVeretx(s: Shooter, index: number, offsetX: number, offsetY: number) {
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