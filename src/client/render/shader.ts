import { includeStore } from './shaderLib';

const precision = 'mediump';
/**
 *
 *
 * @export
 * @class Shader
 */
export class Shader {
    private _fragmentSource: string;
    private _vertexSource: string;
    private _fragmentShader: WebGLShader;
    private _vertexShader: WebGLShader;
    private _defines: string;

    constructor(gl: WebGLRenderingContext, vs: string, fs: string, defines?: string) {
        vs = this._processIncludes(vs);
        fs = this._processIncludes(fs);
        this._defines = defines;
        vs = (defines ? defines + '\n' : '') + vs;
        fs = (defines ? defines + '\n' : '') + fs;
        this._vertexSource = vs.replace(/{precision}/, precision);
        this._fragmentSource = fs.replace(/{precision}/, precision);
        const fragmentShader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
        const vertexShader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
        this.initVertexShader(gl, vertexShader);
        this.initFragmentShader(gl, fragmentShader);
    }

    public attach(gl: WebGLRenderingContext, program: WebGLProgram) {
        gl.attachShader(program, this._vertexShader);
        gl.attachShader(program, this._fragmentShader);
    }

    private _processIncludes(sourceCode: string): string {
        const regex = /#include<(.+)>(\((.*)\))*(\[(.*)\])*/g;
        let match = regex.exec(sourceCode);
        let returnValue = sourceCode;
        while (match !== null) {
            const includeFile = match[1];
            if (includeStore[includeFile]) {
                const includeContent = includeStore[includeFile];
                returnValue = returnValue.replace(match[0], includeContent);
            } else {
                returnValue = returnValue.replace(match[0], '');
                console.warn(`#inclue<${includeFile}> not found in include store !`);
            }
            match = regex.exec(sourceCode);
        }
        return returnValue;
    }

    private initVertexShader(gl: WebGLRenderingContext, shader: WebGLShader) {
        gl.shaderSource(shader, this._vertexSource);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            this._vertexShader = shader;
        } else {
            throw new Error(gl.getShaderInfoLog(shader));
        }
    }

    private initFragmentShader(gl: WebGLRenderingContext, shader: WebGLShader) {
        gl.shaderSource(shader, this._fragmentSource);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            this._fragmentShader = shader;
        } else {
            throw new Error('shader compile error: ' + gl.getShaderInfoLog(shader));
        }
    }

    public get vs() {
        return this._vertexSource;
    }

    public get fs() {
        return this._fragmentSource;
    }
}
