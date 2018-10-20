import Graphics from "Graphics";
import Val from "./Val";

export default abstract class Component {
    public readonly x: number;
    public readonly y: number;

    protected constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    abstract draw(g: Graphics): void;

    forwardSignal(signaler: Component, value: Val): void {

    }

    onRisingEdge(): void {
    }

    onFallingEdge(): void {
    }
}