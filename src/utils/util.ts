import { Link } from "_src/utils/link";
import { setInterval, clearTimeout } from "timers";

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

const intervalMap: {
    [index: number]: Link<() => any>
} = {
};

const timeoutMap = {};

let timeoutId  = 0;

export function mySetInterval(cb: () => any, timeout: number) {
    timeout = Math.floor(timeout);
    let result = new Link<() => any>(cb);
    if (!intervalMap[timeout]) {
        intervalMap[timeout] = result;
        timeoutMap[timeout] = setInterval(() => {
            let link = intervalMap[timeout];
            let count = 0;
            while(link) {
                link.value();
                count ++;
                link = link.beforeLink;
            }
        }, timeout);
        return result;
    }
    result.beforeLink = intervalMap[timeout];
    intervalMap[timeout] = result;
    return result;
}

export function myClearInterval(link: Link<() => any>) {
    Object.keys(intervalMap).forEach((key: string) => {
        if (link === intervalMap[key]) {
            intervalMap[key] = link.beforeLink || link.nextLink;
            if (!intervalMap[key]) {
                clearTimeout(timeoutMap[key]);
            }
        }
    });
    link.destroy();
}

export function loadImage(url: string) {
    return new Promise((res: any, rej: any) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            res(img);
        }
        img.onerror = (e: any) => {
            rej(e);
        }
    });
}

export const INFINITY = 10000000;