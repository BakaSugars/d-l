import { BufferGroup, Segment, Segment2 } from './buffer';
import Buffer from './buffer';
import { Shader } from './shader';

// tslint:disable:cyclomatic-complexity
// tslint:disable:member-ordering
// tslint:disable:forin

interface IUniformActiveInfo extends WebGLActiveInfo {
    loc: WebGLUniformLocation;
}

interface IAttributeActiveInfo extends WebGLActiveInfo {
    loc: number;
}

/**
 *
 *
 * @export
 * @class Program
 */
export class Program {
    private _program: WebGLProgram;
    private _attributesLocation: { [x: string]: number };
    private _uniformActiveInfosMap: { [key: string]: IUniformActiveInfo } = null;
    private _shader: Shader;
    private _boundLayoutVertexBuffer: Buffer;
    private _boundPaintVertexArrayBuffer: Buffer;
    private _boundElementBuffer: Buffer;
    private _boundDynamicVertexArrayBuffer: Buffer;
    private _boundDynamicVertexArrayBuffer2: Buffer;
    private _boundVertexOffset: number;
    private _vertexArrayObject: WebGLVertexArrayObjectOES;
    //@ts-ignore
    private _ext: OESVertexArrayObject;
    private _type: string;
    private _lastUniformMap: any = {};
    private _warningMessagMap: { [key: string]: boolean } = null;
    private _lastLayerName: string;
    private _frames: number = 0;
    private _lastCoordZoom: number = -1;
    private _lastFrameId: number = -1;
    private _typeUniformFunMap: { [key: string]: any } = {};
    private _coordMatrixLocMap: { [key: string]: number } = {};
    private _matrixNameCoordMap: { [key: string]: string } = {};
    private _matrixArrayLength: number = 0;
    private _id: string = null;

    constructor(gl: WebGLRenderingContext, type: string, vs: string, fs: string, defines?: string) {
        this._type = type;
        this._id = `${type}_${defines}`;
        this._warningMessagMap = {};
        this._program = gl.createProgram();
        this._ext = gl.getExtension('OES_vertex_array_object');
        this._boundElementBuffer = null;
        this._boundPaintVertexArrayBuffer = null;
        this._boundLayoutVertexBuffer = null;
        this._attributesLocation = {};
        const shader = new Shader(gl, vs, fs, defines);
        this._attachLink(gl, shader);
        this._initAttributesLocation(gl);
        this._updateActiveUniformInfos(gl);
        if (this._uniformActiveInfosMap['u_matrix_array[0]']) {
            this._matrixArrayLength = this._uniformActiveInfosMap['u_matrix_array[0]'].size;
            this._updateMatrixUniformInfos(gl);
        }
        this._prepareTypeUniformFunMap(gl);
    }

    public get lastLayerName() {
        return this._lastLayerName;
    }

    public set lastLayerName(name: string) {
        this._lastLayerName = name;
    }

    public get lastFrameId() {
        return this._lastFrameId;
    }

    public set lastFrameId(id: number) {
        this._lastFrameId = id;
    }

    public get lastCoordZoom() {
        return this._lastCoordZoom;
    }

    public set lastCoordZoom(zoom: number) {
        this._lastCoordZoom = zoom;
    }

    public get frames() {
        return this._frames;
    }

    public set frames(num: number) {
        this._frames = num;
    }

    public get type(): string {
        return this._type;
    }

    public get id(): string {
        return this._id;
    }

    public updateFrame(frameId: number) {
        if (this._lastFrameId !== frameId) {
            this._lastFrameId = frameId;
            this.clearFrame();
        }
    }

    public use(gl: WebGLRenderingContext): void {
        gl.useProgram(this._program);
    }

    public bindVAO(gl: WebGLRenderingContext, buffers: BufferGroup, segment: Segment2) {
        const vaos = segment.vaos || (segment.vaos = {});
        const vao = vaos[this._id];
        if (this._ext && vao) {
            this._ext.bindVertexArrayOES(vao);
        } else {
            this.freshBindVAO(gl, buffers, segment);
        }
    }

    public bindUniformMatrix(gl: WebGLRenderingContext, key: string, value: Float32Array | number[],
        idAttr: string = 'u_coord_id') {
        if (this._coordMatrixLocMap[key] !== undefined) {
            this.bindUniform(gl, idAttr, this._coordMatrixLocMap[key]);
            return;
        } else {
            const i = this._getFreeMatrixUniformIndex();
            if (i === undefined) {
                this.bindNoCachedMatrix(gl, value, idAttr);
                return;
            }
            this.storeMatrixAt(gl, i, value, key, idAttr);
        }
    }

    private storeMatrixAt(gl: WebGLRenderingContext, index: number, value: Float32Array | number[],
        key: string, idAttr: string) {
        const info = this._uniformActiveInfosMap['u_matrix_array[' + index + ']'];
        this._coordMatrixLocMap[key] = index;
        this._matrixNameCoordMap[index] = key;
        this.bindUniform(gl, info.name, value);
        this.bindUniform(gl, idAttr, index);
    }

    public bindNoCachedMatrix(gl: WebGLRenderingContext, value: Float32Array | number[],
        idAttr: string = 'u_coord_id') {
        const index = this._matrixArrayLength - 1;
        this.bindUniform(gl, 'u_matrix_array[' + index + ']', value);
        this.bindUniform(gl, idAttr, index);
    }

    public getAttributesLoaction() {
        return this._attributesLocation;
    }

    public clearFrame() {
        this._coordMatrixLocMap = {};
        this._matrixNameCoordMap = {};
    }

    private _getFreeMatrixUniformIndex() {
        for (let i = 0; i < this._matrixArrayLength - 1; i++) {
            if (this._matrixNameCoordMap[i] === undefined) {
                return i;
            }
        }
    }

    private _prepareTypeUniformFunMap(gl: WebGLRenderingContext) {
        this._typeUniformFunMap[gl.FLOAT] = gl.uniform1f.bind(gl);
        this._typeUniformFunMap[`${gl.FLOAT}_ARRAY`] = gl.uniform1fv.bind(gl);
        this._typeUniformFunMap[gl.FLOAT_VEC2] = gl.uniform2fv.bind(gl);
        this._typeUniformFunMap[gl.FLOAT_VEC3] = gl.uniform3fv.bind(gl);
        this._typeUniformFunMap[gl.FLOAT_VEC4] = gl.uniform4fv.bind(gl);
        this._typeUniformFunMap[gl.FLOAT_MAT2] = (location: WebGLUniformLocation, value: Float32Array | number[]) => {
            return gl.uniformMatrix2fv(location, false, value);
        };
        this._typeUniformFunMap[gl.FLOAT_MAT3] = (location: WebGLUniformLocation, value: Float32Array | number[]) => {
            return gl.uniformMatrix3fv(location, false, value);
        };
        this._typeUniformFunMap[gl.FLOAT_MAT4] = (location: WebGLUniformLocation, value: Float32Array | number[]) => {
            return gl.uniformMatrix4fv(location, false, value);
        };

        this._typeUniformFunMap[gl.INT] = gl.uniform1i.bind(gl);
        this._typeUniformFunMap[`${gl.INT}_ARRAY`] = gl.uniform1iv.bind(gl);
        this._typeUniformFunMap[gl.INT_VEC2] = gl.uniform2iv.bind(gl);
        this._typeUniformFunMap[gl.INT_VEC3] = gl.uniform3iv.bind(gl);
        this._typeUniformFunMap[gl.INT_VEC4] = gl.uniform4iv.bind(gl);

        this._typeUniformFunMap[gl.BOOL] = gl.uniform1i.bind(gl);
        this._typeUniformFunMap[`${gl.BOOL}_ARRAY`] = gl.uniform1iv.bind(gl);
        this._typeUniformFunMap[gl.BOOL_VEC2] = gl.uniform2iv.bind(gl);
        this._typeUniformFunMap[gl.BOOL_VEC3] = gl.uniform3iv.bind(gl);
        this._typeUniformFunMap[gl.BOOL_VEC4] = gl.uniform4iv.bind(gl);

        this._typeUniformFunMap[gl.SAMPLER_2D] = gl.uniform1i.bind(gl);
        this._typeUniformFunMap[gl.SAMPLER_CUBE] = gl.uniform1i.bind(gl);
    }

    private _attachLink(gl: WebGLRenderingContext, shader: Shader) {
        shader.attach(gl, this._program);
        gl.linkProgram(this._program);
        if (gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            this._shader = shader;
        } else {
            throw new Error('program link error: ' + gl.getProgramInfoLog(this._program));
        }
    }

    private _updateActiveUniformInfos(gl: WebGLRenderingContext) {
        this._uniformActiveInfosMap = {};
        const count: number = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);

        for (let i = 0; i < count; i++) {
            const activeInfo: IUniformActiveInfo = gl.getActiveUniform(this._program, i) as IUniformActiveInfo;
            const loc: WebGLUniformLocation = gl.getUniformLocation(this._program, activeInfo.name);
            activeInfo.loc = loc;
            this._uniformActiveInfosMap[activeInfo.name] = activeInfo;
        }
    }

    private _updateMatrixUniformInfos(gl: WebGLRenderingContext) {
        const originInfo = this._uniformActiveInfosMap['u_matrix_array[0]'];
        for (let i = 0; i < this._matrixArrayLength; i++) {
            const name = `u_matrix_array[${i}]`;
            const activeInfo: IUniformActiveInfo = { name, type: originInfo.type, size: 1 } as IUniformActiveInfo;
            const loc = gl.getUniformLocation(this._program, activeInfo.name);
            activeInfo.loc = loc;
            this._uniformActiveInfosMap[activeInfo.name] = activeInfo;
        }
    }

    private _initAttributesLocation(gl: WebGLRenderingContext) {
        const attributeLength: number = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeLength; i++) {
            const attribute: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
            const location: number = gl.getAttribLocation(this._program, attribute.name);
            this._attributesLocation[attribute.name] = location;
        }
    }

    private _isBoundBuffersDiff(buffers: any, segment: any): boolean {
        return !this._vertexArrayObject ||
            this._boundElementBuffer !== buffers.elementArrayBuffer ||
            this._boundPaintVertexArrayBuffer !== buffers.paintVertexArrayBuffer ||
            this._boundLayoutVertexBuffer !== buffers.vertexLayoutArrayBuffer ||
            this._boundVertexOffset !== segment.vertexOffset;
    }

    private _destroyVAO(vao: WebGLVertexArrayObjectOES) {
        this._ext.deleteVertexArrayOES(vao);
        vao = null;
    }

    private _enableBufferAttributes(gl: WebGLRenderingContext, buffer: Buffer) {
        if (!buffer || !buffer.attributes) {
            return;
        }
        const attributes = buffer.attributes;
        for (const attribute of attributes) {
            const member = attribute.name;
            if (this._attributesLocation[member] !== undefined) {
                const location = this._attributesLocation[member];
                if (attribute.disabled) {
                    gl.disableVertexAttribArray(location);
                } else {
                    gl.enableVertexAttribArray(location);
                }
            }
        }
    }

    private _vertexAttribPointer(gl: WebGLRenderingContext, buffer: Buffer) {
        for (const attribute of buffer.attributes) {
            if (this._attributesLocation[attribute.name] !== undefined) {
                const location = this._attributesLocation[attribute.name];
                if (!attribute.disabled) {
                    gl.vertexAttribPointer(
                        location,
                        attribute.components,
                        gl[attribute.type],
                        false,
                        buffer.elementBytes,
                        attribute.offset + (buffer.elementBytes * this._boundVertexOffset || 0)
                    );
                }
            }
        }
    }

    private freshBindVAO(gl: WebGLRenderingContext, buffers: BufferGroup, segment: Segment2) {
        this._boundElementBuffer = buffers.elementArrayBuffer;
        this._boundPaintVertexArrayBuffer = buffers.paintVertexArrayBuffer;
        this._boundLayoutVertexBuffer = buffers.vertexLayoutArrayBuffer;

        this._boundVertexOffset = segment.vertexOffset;
        this._boundDynamicVertexArrayBuffer = buffers.dynamicVertexArrayBuffer;
        this._boundDynamicVertexArrayBuffer2 = buffers.dynamicVertexArrayBuffer2;

        if (this._ext) {
            const vaos = segment.vaos || (segment.vaos = {});
            let vao = vaos[this._id];
            if (vao) { this._destroyVAO(vao); }
            vao = vaos[this._id] = this._ext.createVertexArrayOES();
            this._ext.bindVertexArrayOES(vao);
            segment.ext = this._ext;
        } else {
            for (const key in this._attributesLocation) {
                gl.disableVertexAttribArray(this._attributesLocation[key]);
            }
        }
        this._enableBufferAttributes(gl, this._boundLayoutVertexBuffer);
        this._boundLayoutVertexBuffer.bind();
        this._vertexAttribPointer(gl, this._boundLayoutVertexBuffer);
        if (this._boundPaintVertexArrayBuffer) {
            this._enableBufferAttributes(gl, this._boundPaintVertexArrayBuffer);
            this._boundPaintVertexArrayBuffer.bind();
            this._vertexAttribPointer(gl, this._boundPaintVertexArrayBuffer);
        }
        if (this._boundDynamicVertexArrayBuffer && this._boundDynamicVertexArrayBuffer.arrayBuffer
            && this._boundDynamicVertexArrayBuffer.arrayBuffer.byteLength > 0) {
            this._enableBufferAttributes(gl, this._boundDynamicVertexArrayBuffer);
            this._boundDynamicVertexArrayBuffer.bind();
            this._vertexAttribPointer(gl, this._boundDynamicVertexArrayBuffer);
        }

        if (this._boundDynamicVertexArrayBuffer2 && this._boundDynamicVertexArrayBuffer2.arrayBuffer
            && this._boundDynamicVertexArrayBuffer2.arrayBuffer.byteLength > 0) {
            this._enableBufferAttributes(gl, this._boundDynamicVertexArrayBuffer2);
            this._boundDynamicVertexArrayBuffer2.bind();
            this._vertexAttribPointer(gl, this._boundDynamicVertexArrayBuffer2);
        }

        if (this._boundElementBuffer) {
            this._boundElementBuffer.bind();
        }

    }

    public bindUniform(gl: WebGLRenderingContext, name: string, value: number | number[] | Float32Array,
        forceUpdate: boolean = false) {
        const activeInfo = this._uniformActiveInfosMap[name];
        if (!activeInfo) {
            // @ts-ignore
            if (__DEV__) {
                const warningMessage = `uniform ${name} is not active for program ${this.type}`;
                if (!this._warningMessagMap[warningMessage]) {
                    this._warningMessagMap[warningMessage] = true;
                    console.warn(`uniform ${name} is not active for program ${this.type}`);
                }
            }
            return;
        }

        if (this._lastUniformMap[name] === value && !forceUpdate) {
            return;
        }

        const {
            type,
            loc,
        } = activeInfo;

        let transFunc: any;
        if (!transFunc) {
            transFunc = this._typeUniformFunMap[type];
        }
        if (transFunc) {
            transFunc(loc, value);
        } else {
            // @ts-ignore
            if (__DEV__) {
                throw new Error(`unknow type:${type} for uniform ${name}`);
            }
        }

        this._lastUniformMap[name] = value;
    }

    public draw(gl: WebGLRenderingContext, segment: Segment) {
        gl.drawElements(gl.TRIANGLES, segment.primitiveLength * 3, gl.UNSIGNED_SHORT, segment.primitiveOffset * 3 * 2);
    }

    public drawGLLine(gl: WebGLRenderingContext, segment: Segment) {
        gl.drawElements(gl.LINES, segment.primitiveLength * 2, gl.UNSIGNED_SHORT, segment.primitiveOffset * 2 * 2);
    }

    public drawPoint(gl: WebGLRenderingContext, segment: Segment) {
        gl.drawElements(gl.POINTS, segment.primitiveLength, gl.UNSIGNED_SHORT, segment.primitiveOffset * 1 * 2);
    }
}
