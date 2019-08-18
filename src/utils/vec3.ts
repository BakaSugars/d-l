// tslint:disable:class-name
export default class vec3 implements ArrayLike<number> {
    public readonly length: number;
    [n: number]: number;
    constructor(length: number) {
        return new Float64Array(length);
    }

    public static create(): vec3 {
        const out = new vec3(3);
        return out;
    }

    public static fromValues(x: number = 0, y: number = 0, z: number = 0): vec3 {
        const out = new vec3(3);
        out[0] = x;
        out[1] = y;
        out[2] = z;
        return out;
    }

    public static normalize(out: vec3, a: vec3 | number[]): vec3 {
        const x = a[0];
        const y = a[1];
        const z = a[2];
        let len = x * x + y * y + z * z;
        if (len > 0) {
            //TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            out[0] = a[0] * len;
            out[1] = a[1] * len;
            out[2] = a[2] * len;
        }
        return out;
    }
}
