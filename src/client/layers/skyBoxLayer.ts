import { Layer } from "_src/client/layers/layer";
import Renderer from "_src/client/render/renderer";
import Buffer, { Attribute } from "_src/client/render/buffer";
import { TextureCube, createSkyBoxTexture } from "_src/client/render/textureCube";

export class SkyBoxLayer extends Layer {
    protected _programType = 'skybox';
    protected _vertexBufferByteSize = 4;
    private _texture: TextureCube;
    constructor(renderer: Renderer) {
        super(renderer);
        this._initProgram();
        this._loadPromise = createSkyBoxTexture().then((tex: TextureCube) => {
            this._texture = tex;
            console.log(tex);
        });
    }

    public update() {
        this._texture.upload(this._gl);
        this._program.bindUniform(this._gl, 'u_sky_cube', 0);
        this._texture.bind(this._gl, this._gl.LINEAR, this._gl.REPEAT);
        this._gl.activeTexture(this._gl.TEXTURE0);
        this._updateVertexBuffer();
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

    private _updateVertexBuffer() {
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