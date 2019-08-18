export interface Segment {
    primitiveLength: number;
    primitiveOffset: number;
    vertexLength: number;
    vertexOffset: number;
}

export interface Segment2 extends Segment {
    vaos?: { [key: string]: WebGLVertexArrayObjectOES };
    // @ts-ignore
    ext?: OESVertexArrayObject;
}

export interface Attribute {
    name: string;
    type: string;
    components: number;
    offset: number;
    disabled?: boolean;
}


export function getEmptySegment(): Segment {
    return {
        primitiveLength: 0,
        primitiveOffset: 0,
        vertexLength: 0,
        vertexOffset: 0
    };
}

/**
 * add a new segment into segments, and return the newly added segment
 * @param segments
 */
export function addNewSegment(segments: Segment[]): Segment {
    const result = getEmptySegment();

    for (const segment of segments) {
        result.vertexOffset += segment.vertexLength;
        result.primitiveOffset += segment.primitiveLength;
    }

    segments.push(result);

    return result;
}

// ArrayBuffer
export interface BufferSuite {
    vertexLayoutArrayBuffer: ArrayBuffer;
    elementArrayBuffer: ArrayBuffer;
    paintVertexArrayBuffer: ArrayBuffer;
    dynamicLayoutVertexBuffer?: ArrayBuffer;
    segments: Segment[];
    isSdf?: boolean;
    shared?: boolean;
}

// WebGLBuffer
export interface BufferGroup {
    vertexLayoutArrayBuffer: Buffer;
    elementArrayBuffer: Buffer;
    paintVertexArrayBuffer: Buffer;

    dynamicVertexArrayBuffer?: Buffer;
    dynamicVertexArrayBuffer2?: Buffer;
    segments: Segment2[];

    lastSceneOfDynamicVertexArrayBuffer2?: {
        zoom: number;
        pitch: number;
        angle: number;
    };
}

/**
 *
 *
 * @export
 * @class Buffer
 */
export default class Buffer {
    private gl: WebGLRenderingContext;
    private _buffer: WebGLBuffer;
    private _arrayBuffer: ArrayBuffer;
    private _type: string;
    private _elementBytes: number;
    private _attributes: Attribute[];

    private isStatic: boolean = true;

    constructor(
        gl: WebGLRenderingContext,
        arrayBuffer: ArrayBuffer,
        type: string,
        elementBytes: number,
        attributes: Attribute[],
        isStatic: boolean = true
    ) {
        this._type = type;
        this._arrayBuffer = arrayBuffer;
        this._elementBytes = elementBytes;
        this._attributes = attributes;
        this.gl = gl;
        this.isStatic = isStatic;
    }

    public get elementBytes(): number {
        return this._elementBytes;
    }

    public set elementBytes(num: number) {
        this._elementBytes = num;
    }

    public get attributes() {
        return this._attributes;
    }

    public set attributes(attributes: Attribute[]) {
        this._attributes = attributes;
    }

    public get arrayBuffer() {
        return this._arrayBuffer;
    }

    public set arrayBuffer(buffer: ArrayBuffer) {
        this._arrayBuffer = buffer;
    }

    public get size(): number {
        let length = 0;
        if (this._arrayBuffer) {
            length += this._arrayBuffer.byteLength / 1024 / 1024;
        }
        return length;
    }

    public bind() {
        if (!this._buffer) {
            this._buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl[this._type], this._buffer);
            this.gl.bufferData(this.gl[this._type], this._arrayBuffer,
                this.isStatic ? this.gl.STATIC_DRAW : this.gl.DYNAMIC_DRAW);
        } else {
            this.gl.bindBuffer(this.gl[this._type], this._buffer);
        }
    }

    public updateData(data: ArrayBuffer) {
        this._arrayBuffer = data;
        if (!this._buffer) {
            this._buffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl[this._type], this._buffer);
            this.gl.bufferData(this.gl[this._type], data, this.isStatic ? this.gl.STATIC_DRAW : this.gl.DYNAMIC_DRAW);
        } else {
            this.gl.bindBuffer(this.gl[this._type], this._buffer);
            if (this._arrayBuffer && this._arrayBuffer.byteLength >= data.byteLength) {
                this.gl.bufferSubData(this.gl[this._type], 0, data);
            } else {
                this.gl.bufferData(
                    this.gl[this._type],
                    data,
                    this.isStatic ? this.gl.STATIC_DRAW : this.gl.DYNAMIC_DRAW
                );
            }
        }
    }

    public destroy() {
        if (this._buffer) {
            this.gl.deleteBuffer(this._buffer);
            this._buffer = null;
        }
    }

}
