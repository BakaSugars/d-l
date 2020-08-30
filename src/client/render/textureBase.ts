import { ImageType } from "_src/client/render/texture";

export type TextureFormat = 'ALPHA' | 'RGBA';

export abstract class TextureBase {
    public gl: WebGLRenderingContext = null;
    public texture: WebGLTexture = null;
    public wrap: any = null;
    public filter: any = null;
    public format: TextureFormat = null;
    protected _premultiply: boolean;
    constructor(format: TextureFormat, premultiply: boolean) {
        this.format = format;
        this._premultiply = premultiply;
    }

    public abstract update(data: any): any;

    public abstract upload(gl: WebGLRenderingContext): any;

    public abstract bind(gl: WebGLRenderingContext, filter: any, wrap: any): any;

    public destroy(gl?: WebGLRenderingContext) {
        gl = gl || this.gl;
        if (this.texture && gl) {
            this.filter = null;
            this.wrap = null;
            gl.deleteTexture(this.texture);
            this.texture = null;
        }
    }

    protected _preparePixelStore(gl: WebGLRenderingContext) {
        if (this.format === 'ALPHA') {
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        } else {
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
        }

        if (this._premultiply) {
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        } else {
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        }
    }

    protected _textureImage2D(
        gl: WebGLRenderingContext,
        target: number,
        level: number,
        internalFormat: TextureFormat,
        width: number,
        height: number,
        border: number,
        format: TextureFormat,
        type: number,
        image: ImageType,
    ) {
        if (
            image instanceof HTMLImageElement ||
            image instanceof HTMLCanvasElement ||
            image instanceof HTMLVideoElement ||
            image instanceof ImageData
        ) {
            gl.texImage2D(target, level, gl[internalFormat], gl[format], type, image);
        } else {
            gl.texImage2D(
                target,
                level,
                gl[internalFormat],
                width,
                height,
                border,
                gl[format],
                type,
                image.data
            );
        }
    }
}