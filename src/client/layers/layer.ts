import mat4 from "_src/utils/mat4";
import { Segment, getEmptySegment, BufferGroup } from "_src/client/render/buffer";
import Renderer from "_src/client/render/renderer";
import { Program } from "_src/client/render/program";

export abstract class Layer {
    protected _vertexArray: ArrayBuffer;
    protected _elementArray: Uint16Array;
    protected _gl: WebGLRenderingContext;
    protected _segments: Segment[];
    protected _renderer: Renderer;
    protected _program: Program;
    protected _uint32VertexArray: Uint32Array;
    protected _uint16VertexArray: Uint16Array;
    protected _uint8VertexArray: Uint8Array;
    protected _int32VertexArray: Int32Array;
    protected _int16VertexArray: Int16Array;
    protected _int8VertexArray: Int8Array;
    protected _float32VertexArray: Float32Array;
    protected _float64VertexArray: Float64Array;
    protected _programType: string;
    protected _vertexBufferByteSize: number;
    protected _loadPromise: Promise<any>;

    constructor(renderer: Renderer) {
        this._renderer = renderer;
        this._gl = this._renderer.gl;
    }

    public get loadPromise() {
        return this._loadPromise;
    }

    public set loadPromise(promise: any) {
        this._loadPromise = promise;
    }

    public draw(matrix?: mat4) {
        this._renderer.useProgram(this._program);
        this.update();
        if (this._vertexArray && !this._vertexArray.byteLength) {
            return;
        }
        if (matrix) {
            this._program.bindNoCachedMatrix(this._gl, new Float32Array(matrix));
        }
        const buffers = this._createGLBufferGroup();
        for (const segment of this._segments) {
            this._program.bindVAO(this._gl, buffers, segment);
            this._program.draw(this._gl, segment);
        }
    }

    public get uint32VertexArray(): Uint32Array {
        if (!this._uint32VertexArray) {
            this._uint32VertexArray = new Uint32Array(this._vertexArray);       
        }
        return this._uint32VertexArray;
    }

    public get uint16VertexArray() {
        if (!this._uint16VertexArray) {
            this._uint16VertexArray = new Uint16Array(this._vertexArray);
        }
        return this._uint16VertexArray;
    }

    public get uint8VertexArray() {
        if (!this._uint8VertexArray) {
            this._uint8VertexArray = new Uint8Array(this._vertexArray)
        }
        return this._uint8VertexArray;
    }

    public get int32VertexArray() {
        if (!this._int32VertexArray) {
            this._int32VertexArray = new Int32Array(this._vertexArray);
        }
        return this._int32VertexArray;
    }

    public get int16VertexArray() {
        if (!this._int16VertexArray) {
            this._int16VertexArray = new Int16Array(this._vertexArray);
        }
        return this._int16VertexArray;
    }

    public get int8VertexArray() {
        if (!this._int8VertexArray) {
            this._int8VertexArray = new Int8Array(this._vertexArray);
        }
        return this._int8VertexArray;
    }

    public get float32VertexArray() {
        if (!this._float32VertexArray) {
            this._float32VertexArray = new Float32Array(this._vertexArray);
        }
        return this._float32VertexArray;
    }

    public get float64VertexArray() {
        if (!this._float64VertexArray) {
            this._float64VertexArray = new Float64Array(this._vertexArray);
        }
        return this._float64VertexArray;
    }

    public set vertexArray(val: ArrayBuffer) {
        this._vertexArray = val;
        this._uint32VertexArray = null;
        this._uint16VertexArray = null;
        this._uint8VertexArray = null;
        this._int32VertexArray = null;
        this._int16VertexArray = null;
        this._int8VertexArray = null;
        this._float32VertexArray = null;
        this._float64VertexArray = null;
    }

    protected _createSegment() {
        return getEmptySegment();
    };

    protected _initProgram() {
        this._renderer.createProgram(this._programType);
        this._program = this._renderer.getCachedProgram(this._programType);
        if (!this._program) {
            throw new Error('no ' + this._programType + ' program');
        }
    }
    public abstract update(): any;
    protected abstract _createGLBufferGroup(): BufferGroup;
}