import Component from "./Component";
import Graphics from "./Graphics";
import Config from "./Config";
import Val from "./Val";

export default class CircuitNode extends Component {
    private readonly defaultValue: Val;

    private neighbours: Component[] = [];
    private neighbourNodes: CircuitNode[] = [];

    private _value: Val;
    private signaler: Component;
    private marked: boolean;

    constructor(x: number, y: number, defaultValue: Val = undefined) {
        super(x, y);
        this.defaultValue = defaultValue;
        this.refresh();
    }

    draw(g: Graphics): void {
        // g.fillCircle(this.x, this.y, 2, Config.signalColor);
        this.neighbourNodes.forEach(el =>
            g.drawLine(this.x, this.y, el.x, el.y, el.marked ? Config.signalColor : Config.lineColor)
        );
    }

    refresh(): void {
        this._value = this.defaultValue;
        this.signaler = undefined;
        this.marked = false;
    }

    forwardSignal(signaler: Component, value: Val): void {
        this._value = value;
        this.signaler = signaler;

        this.neighbours.forEach(nb => {
            if (nb != signaler) {
                nb.forwardSignal(this, value);
            }
        })
    }

    mark(caller: Component): void {
        this.marked = true;
        if (this.signaler) {
            this.signaler.mark(this);
        } else {
            console.log("Error");
        }
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