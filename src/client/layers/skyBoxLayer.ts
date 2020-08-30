import { Layer } from "_src/client/layers/layer";
import Renderer from "_src/client/render/renderer";
import Buffer, { Attribute } from "_src/client/render/buffer";

export class SkyBoxLayer extends Layer {
    protected _programType = 'skybox';
    protected _vertexBufferByteSize = 4;
    constructor(renderer: Renderer) {
        super(renderer);
        this._initProgram();
    }

    public update() {
        this._getVertexBuffer();
        this._program.bindUniform(this._gl, 'u_color', [0, 0, 255, 255]);
    }

    protected _createGLBufferGroup() {
        const attributes: Attribute[] = [];
        attributes.push({
            name: 'a_pos',
            type: 'SHORT',
            components: 2,
            offset: 0
        });
        return {
            vertexLayoutArrayBuffer: new Buffer(this._gl, this._vertexArray, 'ARRAY_BUFFER', this._vertexBufferByteSize, attributes),
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

    private _getVertexBuffer() {
        const vertexArray = [
            -1, 1,
            1, 1,
            -1, -1,
            1, -1,
        ];
        const elementArray = [
            0, 1, 2,
            3, 1, 2
        ];
        this._vertexArray = new Int16Array(vertexArray).buffer;
        this._elementArray = new Uint16Array(elementArray);
        const segment = this._createSegment();
        segment.vertexLength = 4;
        segment.primitiveLength = 2;
        this._segments = [segment];
    }
}