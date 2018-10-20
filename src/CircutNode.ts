import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import Val, {ZERO_VAL_0, ZERO_VAL_32} from "./Val";

export default class CircuitNode extends Component{
    public static cnt = 0;
    private readonly id: number;

    private neighbours: Component[] = [];
    private neighbourNodes: CircuitNode[] = [];
    private _value: Val;

    constructor(x: number, y: number, value: Val = ZERO_VAL_0) {
        super(x, y);
        this._value = value;

        this.id = CircuitNode.cnt++;
    }

    draw(g: Graphics): void {
        g.fillCircle(this.x, this.y, 2, Config.signalColor);
        this.neighbourNodes.forEach(el => g.line(this.x, this.y, el.x, el.y, Config.lineColor));
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