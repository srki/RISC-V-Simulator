import Graphics from "../util/Graphics";
import Value from "../util/Value";

export default abstract class Component {
    private static cnt = 0;
    public readonly id: number;

    public readonly x: number;
    public readonly y: number;

    protected constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.id = Component.cnt++;
    }

    abstract draw(g: Graphics): void;

    refresh(): void {
    }

    forwardSignal(signaler: Component, value: Value): void {
    }

    mark(caller: Component): void {
    }

    onFallingEdge(): void {
    }

    onRisingEdge(): void {
    }
}