import mat4 from './mat4';

// tslint:disable:class-name
export default class vec4 implements ArrayLike<number> {
    public readonly length: number;
    [n: number]: number;
    constructor(length: number) {
        return new Float64Array(length);
    }

    public static create(): vec4 {
        const out = new vec4(4);
        return out;
    }

    public static fromValues(x: number = 0, y: number = 0, z: number = 0, w: number = 1): vec4 {
        const out = new vec4(4);
        out[0] = x;
        out[1] = y;
        out[2] = z;
        out[3] = w;
        return out;
    }

    public static transformMat4(out: vec4, a: vec4 | number[], m: mat4): vec4 {
        const x = a[0];
        const y = a[1];
        const z = a[2];
        const w = a[3];
        out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
        out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
        return out;
    }
}
