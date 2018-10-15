import {Graphics} from "./Graphics";

abstract class Component {
    public readonly x: number;
    public readonly y: number;

    protected constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    abstract draw(g: Graphics): void;

    forwardSignal(signaler: Component, value: number): void {

    }

    onRisingEdge(): void {
    }

    onFallingEdge(): void {
    }
}

export {Component}