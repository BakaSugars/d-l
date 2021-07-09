import { TextureBase, TextureFormat } from "_src/client/render/textureBase";

interface ImageFace {
    width: number;
    height: number;
    data: Uint8Array | Uint8ClampedArray;
}

export type ImageType = ImageFace | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageData;

/* tslint:disable:cyzclomatic-complexity */

export class Texture extends TextureBase {
    public size: number[] = null;
    public image: ImageType = null;

    constructor(image: ImageType, format: TextureFormat, premultiply: boolean) {
        super(format, premultiply);
        this.update(image);
    }

    public update(image: ImageType) {
        this.image = image;
        this.size = [this.image.width, this.image.height];
        this.filter = null;
        this.wrap = null;
    }

    public upload(gl: WebGLRenderingContext) {
        if (!this.texture) {
            this.texture = gl.createTexture();
        }
        this.gl = gl;
        const format = this.format;
        const image = this.image;

        // TO DO : cache gl commands

        if (!image) {
            return;
        }

        const [width, height] = this.size;
        try {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            this._preparePixelStore(gl);
            this._textureImage2D(
                gl,
                gl.TEXTURE_2D,
                0,
                format,
                width,
                height,
                0,
                format,
                gl.UNSIGNED_BYTE,
                image
            );

            this.image = null;
        } catch (e) {
            console.error('image upload error', e);
        }
    }

    public bind(gl: WebGLRenderingContext, filter: any, wrap: any) {
        if (!this.texture) {
            console.error('texure is null');
        }
        const { texture } = this;
        gl.bindTexture(gl.TEXTURE_2D, texture);

        this.prepareTexParam(gl, filter, wrap);
    }

    public destroy(gl?: WebGLRenderingContext) {
        this.image = null;
        super.destroy();
    }
}
