import { TextureBase, TextureFormat } from "_src/client/render/textureBase";
import { ImageType } from "_src/client/render/texture";
import { loadImage } from "_src/utils/util";
export interface ImageBox {
    positive_x: ImageType;
    positive_y: ImageType;
    positive_z: ImageType;
    negative_x: ImageType;
    negative_y: ImageType;
    negative_z: ImageType;
}

const skyboxUrls = {
    positive_x: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-x.jpg',
    negative_x:
    'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-x.jpg',
    positive_y: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-y.jpg',
    negative_y:
    'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-y.jpg',
    positive_z: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-z.jpg',
    negative_z:
    'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-z.jpg'
}


let skyboxTexture: TextureCube = null;
export async function createSkyBoxTexture() {
    if (skyboxTexture) {
        return skyboxTexture;
    }
    const keys = Object.keys(skyboxUrls);
    const imgBox: ImageBox = {
        positive_x: null,
        positive_y: null,
        positive_z: null,
        negative_x: null,
        negative_y: null,
        negative_z: null,
    };
    const promises = [];
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const url = skyboxUrls[i];
        const imgPromise = loadImage(url);
        imgPromise.then((img: any) => {
            imgBox[key] = img;
        });
        promises.push(imgPromise);
    }
    await Promise.all(promises);

    skyboxTexture = new TextureCube(imgBox, 'RGBA', false);

    return skyboxTexture;
}

export class TextureCube extends TextureBase  {
    public imageBox: ImageBox;

    constructor(imageBox: ImageBox, format: TextureFormat, premultiply: boolean) {
        super(format, premultiply);
        this.update(imageBox);
    }

    public update(imageBox: ImageBox) {
        this.imageBox = imageBox;
        this.filter = null;
        this.wrap = null;
        this.imageBox = null;
    }

    public upload(gl: WebGLRenderingContext) {
        if (!this.texture) {
            this.texture = gl.createTexture();
        }
        this.gl = gl;
        const format = this.format;
        const imgBox = this.imageBox;

        if (!imgBox) {
            return;
        }

        const keyTargetMap = {
            positive_x: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            positive_y: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            positive_z: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            negative_x: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            negative_y: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            negative_z: gl.TEXTURE_CUBE_MAP_NEGATIVE_X
        };

        try {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
            Object.keys(imgBox).forEach((key: string) => {
                const img = imgBox[key];
                const target = keyTargetMap[key];
                const width = img.width;
                const height = img.height;
                const type = gl.UNSIGNED_BYTE;
                const format = gl[this.format];
                const level = 0;

                
            });
        } catch (e) {
            console.error('image upload error', e);
        }
    }

    public bind(gl: WebGLRenderingContext, filter: any, wrap: any) {

    }

    public destroy() {
        super.destroy();
    }
}