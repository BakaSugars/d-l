export function extend(dest: any, ...sources: any[]): any {
    for (const src of sources) {
        for (const k in src) {
            if (src.hasOwnProperty(k)) {
                dest[k] = src[k];
            }
        }
    }
    return dest;
}
let id = 0;
export function createId() {
    return id ++;
}

export function clearGlobalId() {
    id = 0;
}