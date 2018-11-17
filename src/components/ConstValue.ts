import Component from "./Component";
import Graphics from "../util/Graphics";
import CircuitNode from "./CircutNode";
import Config from "../util/Config";
import Value from "../util/Value";

export default class ConstValue extends Component {
    readonly value: Value;
    private _outNode: CircuitNode;

    constructor(x: number, y: number, value: Value) {
        super(x, y);
        this.value = value;
    }

    draw(g: Graphics): void {
        g.fillPolygon(Graphics.addOffset([[0, 0], [0, 25], [25, 25], [25, 0]], this.x, this.y),
            Config.elementFillColor, Config.elementStrokeColor);
        g.drawText(this.x + 5, this.y + 20, this.value.asShortHexString(), Config.fontColor, Config.fontSize);
    }

    onFallingEdge(): void {
        this._outNode.forwardSignal(this, this.value);
    }

    mark(caller: Component): void {
        // TODO: change color
    }

    set outNode(value: CircuitNode) {
        this._outNode = value;
    }
}