import {Component} from "./Component";
import {Graphics} from "./Graphics";


class Container extends Component {
    protected elements: Component[] = [];

    draw(g: Graphics): void {
    }

    forwardSignal(signaler: Component, value: number): void {
        this.elements.forEach(el => el.forwardSignal(signaler, value));
    }

    onRisingEdge(): void {
        this.elements.forEach(el => el.onRisingEdge());
    }
}

export {Container}