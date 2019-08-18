import { Program } from "_src/client/render/program";
import { shaderLib } from "_src/client/render/shaderLib";
import { DataBucket } from "_src/client/render/dataBucket";

export default class Renderer {
    private _programCache = {};
    private _currentProgram: Program;
    private _gl: WebGLRenderingContext;
    private _dataBucket: DataBucket;
    constructor(canvas: HTMLCanvasElement, dataBucket?: DataBucket) {
        this._initGL(canvas);
        this._dataBucket = dataBucket;
    }

    public get gl() {
        return this._gl;
    }

    public useProgram(program: Program) {
        if (program && this._currentProgram !== program) {
            this._currentProgram = program;
            program.use(this._gl);
        }
    }

    public getCachedProgram(programType: string): Program {
        return this._programCache[programType];
    }

    public createProgram(programType: string, defines?: string): Program {
        const key = defines ? programType + defines : programType;
        if (!this._programCache[key]) {
            const vs = shaderLib[`${programType}_vertexSource`];
            const fs = shaderLib[`${programType}_fragmentSource`];
            if (vs && fs) {
                this._programCache[key] = new Program(this._gl, programType, vs, fs, defines);
            }
        }
        return this._programCache[key];
    }

    public clearColor(rgba: number[]) {
        this._gl.clearColor(rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, rgba[3] / 255);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }

    private _initGL(canvas: HTMLCanvasElement) {
        const options: any = {
            alpha: true,
            antialias: false,
            depth: true,
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: false,
            stencil: true
        };

        this._gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
        if (!this._gl.getExtension('OES_standard_derivatives')) {
            console.warn('OES_standard_derivatives not supported');
        }
    }
}