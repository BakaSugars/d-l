import { Layer } from "_src/client/layers/layer";
import Grid from "_src/client/elements/grid";
import mat4 from "_src/utils/mat4";
import Buffer, { Attribute } from "_src/client/render/buffer";
import Renderer from "_src/client/render/renderer";

export class GridLayer extends Layer {
    private _grids: Grid[] = [];
    protected _programType = 'triangle';
    protected _vertexBufferByteSize = 20;
    constructor(renderer: Renderer) {
        super(renderer);
        this._initProgram();
    }

    public addGrid(grid: Grid) {
        this._grids.push(grid);
    }

    public getGrid(index: number) {
        return this._grids[index];
    }

    public update(): any {
        const segment = this._createSegment();
        this.vertexArray = new ArrayBuffer(this._vertexBufferByteSize * this._grids.length * 4);
        this._elementArray = new Uint16Array(this._grids.length * 6);
        this._grids.forEach((s: Grid, index: number) => {
            this._resolveGrid(s, index);
        });
        segment.vertexLength = this._grids.length * 4;
        segment.primitiveLength = this._grids.length * 2;
        this._segments = [segment];
    };
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

    private _resolveGrid(g: Grid, index: number) {
        const beforeIndex = index;
        index = index * 4;
        this._resolveVeretx(g, index, 0, 1);
        this._resolveVeretx(g, index + 1, 1, 1);
        this._resolveVeretx(g, index + 2, 1, 0);
        this._resolveVeretx(g, index + 3, 0, 0);
        let elementOffset = beforeIndex * 6;
        this._elementArray[elementOffset++] = index;
        this._elementArray[elementOffset++] = index + 1;
        this._elementArray[elementOffset++] = index + 2;
        this._elementArray[elementOffset++] = index;
        this._elementArray[elementOffset++] = index + 2;
        this._elementArray[elementOffset++] = index + 3;
    }

    private _resolveVeretx(g: Grid, index: number, offsetX: number, offsetY: number) {
        const floatOffset = index * this._vertexBufferByteSize / 4;
        const uint8Offset = index * this._vertexBufferByteSize;
        const x = g.center.x;
        const y = g.center.y;
        const z = g.center.z;
        const color = g.color;
        const size = g.width - g.padding * 2;
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
