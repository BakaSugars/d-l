import { TextureBase, TextureFormat } from "_src/client/render/textureBase";
import { ImageType } from "_src/client/render/texture";
import { loadImage } from "_src/utils/util";

import negX from '../../assets/skybox_nx.jpg';
import posX from '../../assets/skybox_px.jpg';
import negY from '../../assets/skybox_ny.jpg';
import posY from '../../assets/skybox_py.jpg';
import negZ from '../../assets/skybox_nz.jpg';
import posZ from '../../assets/skybox_pz.jpg';

export interface ImageBox {
    positive_x: ImageType;
    positive_y: ImageType;
    positive_z: ImageType;
    negative_x: ImageType;
    negative_y: ImageType;
    negative_z: ImageType;
}

const skyboxUrls = {
    positive_x: posX,
    negative_x: negX,
    positive_y: posY,
    negative_y: negY,
    positive_z: posZ,
    negative_z: negZ
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
        const url = skyboxUrls[key];
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
        this.filter = null;
        this.wrap = null;
        this.imageBox = imageBox;
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
            negative_x: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            positive_y: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            negative_y: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            positive_z: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            negative_z: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        };

        try {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
            Object.keys(imgBox).forEach((key: string) => {
                const img = imgBox[key];
                const target = keyTargetMap[key];
                const width = img.width;
                const height = img.height;
                const type = gl.UNSIGNED_BYTE;
                const format = this.format;
                const level = 0;
                const border = 0;
                console.log(img, width, height);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                this._textureImage2D(
                    gl,
                    target,
                    level,
                    format,
                    width,
                    height,
                    border,
                    format,
                    type,
                    img
                );
                // gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);


            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            this.imageBox = null;
        } catch (e) {
            console.error('image upload error', e);
        }
    }

    public bind(gl: WebGLRenderingContext, filter: any, wrap: any) {
        if(!this.texture) {
            return;
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    }

    public destroy() {
        super.destroy();
    }
}