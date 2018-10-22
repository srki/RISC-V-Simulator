import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import Val from "Val";

export default class CircuitNode extends Component{
    private readonly defaultValue: Val;

    private neighbours: Component[] = [];
    private neighbourNodes: CircuitNode[] = [];
    private _value: Val;

    constructor(x: number, y: number, defaultValue: Val = undefined) {
        super(x, y);
        this.defaultValue = defaultValue;
        this.reset();
    }

    draw(g: Graphics): void {
        g.fillCircle(this.x, this.y, 2, Config.signalColor);
        this.neighbourNodes.forEach(el => g.line(this.x, this.y, el.x, el.y, Config.lineColor));
    }

    reset(): void {
        this._value = this.defaultValue;
    }

    forwardSignal(signaler: Component, value: Val): void {
        this._value = value;
        this.neighbours.forEach(nb => {
            if (nb != signaler) {
                nb.forwardSignal(this, value);
            }
        })
    }

    addNeighbour(neighbour: Component) {
        this.neighbours.push(neighbour);

        if (neighbour instanceof CircuitNode) {
            this.neighbourNodes.push(neighbour);
        }
    }


    get value(): Val {
        return this._value;
    }
}