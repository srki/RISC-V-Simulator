import {Graphics} from "./Graphics";

class Simulator {
    g: Graphics;

    constructor(canvas: HTMLCanvasElement) {
        this.g = new Graphics(canvas, 1000, 500);
    }

    run() {

    }
}

export {Simulator}