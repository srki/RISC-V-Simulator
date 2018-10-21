import Component from "Component";
import Graphics from "Graphics";
import CircuitNode from "CircutNode";
import Config from "Config";
import Val, {VAL_ZERO_0b, VAL_ZERO_32b, VAL_ZERO_5b} from "Val";

export default class ArithmeticLogicUnit extends Component {
    private _outputNode: CircuitNode = null;
    private _input1Node: CircuitNode = null;
    private _input2Node: CircuitNode = null;
    private _opInput: CircuitNode = null;

    private input1Value: Val = VAL_ZERO_32b;
    private input2Value: Val = VAL_ZERO_0b;
    private opValue: Val = VAL_ZERO_5b;

    constructor(x: number, y: number) {
        super(x, y);
    }

    draw(g: Graphics): void {
        g.fillPolygon(Graphics.addOffset([[0, 0], [40, 15], [40, 60], [0, 75], [0, 45], [10, 37.5], [0, 30]],
            this.x, this.y), Config.elementFillColor, Config.elementStrokeColor);
    }

    forwardSignal(signaler: Component, value: Val): void {
        switch (signaler) {
            case this._input1Node:
                this.input1Value = value;
                break;

            case this._input2Node:
                this.input2Value = value;
                break;

            case this._opInput:
                this.opValue = value;
                break;
        }

        // TODO: add op codes
        switch (this.opValue) {
            default:
                this._outputNode.forwardSignal(this, Val.UnsignedInt(this.input1Value.asUnsignedInt() + this.input2Value.asUnsignedInt()))
        }
    }

    set outputNode(node: CircuitNode) {
        this._outputNode = node;
    }

    set input1Node(node: CircuitNode) {
        this._input1Node = node;
        node.addNeighbour(this);
    }

    set input2Node(node: CircuitNode) {
        this._input2Node = node;
        node.addNeighbour(this);
    }

    set opInput(node: CircuitNode) {
        this._opInput = node;
    }
}
