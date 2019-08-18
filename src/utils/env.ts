export default class Env {
    private static _dpr: number;
    static get dpr() {
        if (Env._dpr) {
            return Env._dpr;
        }
        Env._dpr = window.devicePixelRatio || 1;
        return Env._dpr;
    }
}