import Component from "Component";
import Graphics from "Graphics";
import Val from "Val";


export default class Container extends Component {
    protected elements: Component[] = [];

    draw(g: Graphics): void {
    }

    forwardSignal(signaler: Component, value: Val): void {
        this.elements.forEach(el => el.forwardSignal(signaler, value));
    }

    onRisingEdge(): void {
        this.elements.forEach(el => el.onRisingEdge());
    }
}
