import Graphics from "Graphics";
import Val from "Val";

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

    reset(): void {
    }

    forwardSignal(signaler: Component, value: Val): void {
    }

    onRisingEdge(): void {
    }

    onFallingEdge(): void {
    }
}