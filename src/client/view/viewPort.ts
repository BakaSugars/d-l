import Env from "_src/utils/env";

export class ViewPort {
    private _canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._resizeCanvas(canvas.offsetWidth, canvas.offsetHeight);
    }

    public get canvas() {
        return this._canvas;
    }
    
    private _resizeCanvas(cssWidth: number, cssHeight: number) {
        this.canvas.width = Env.dpr * cssWidth;
        this.canvas.height = Env.dpr * cssHeight;
        this.canvas.style.width = `${cssWidth}px`;
        this.canvas.style.height = `${cssHeight}px`;
    }

}