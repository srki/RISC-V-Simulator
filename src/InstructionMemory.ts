import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";
import Val, {VAL_ZERO_32b} from "Val";
import InstructionHelper from "./InstructionHelper";

export default class InstructionMemory extends Component {
    private readonly size: number = 32;
    private values: Val[] = [];

    private _addressNode: CircuitNode;
    private _outputDataNode: CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
        for (let i = 0; i < this.size; i++) {
            this.values.push(VAL_ZERO_32b);
        }

        for (let i = 0; i < 5; i++) {
            this.values[i] = InstructionHelper.createRType(InstructionHelper.OP_CODE_ALU,
                InstructionHelper.FUNCT_ADD, i + 2, i + 1, i + 1);
        }
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, this.size * 15 + 20,
            Config.elementFillColor, Config.elementStrokeColor);

        for (let i = 0; i < this.size; i++) {
            g.fillRect(this.x + 10, this.y + 10 + i * 15, 80, 15,
                Config.memoryFillColor, Config.memoryStrokeColor);
            g.drawText(this.x + 10 + 5, this.y + 10 + 12 + i * 15, this.values[i].asHexString(),
                Config.fontColor, 12);
        }
    }

    forwardSignal(signaler: Component, value: Val): void {
        this._outputDataNode.forwardSignal(this, this.values[value.asUnsignedInt() / 4]);
    }

    set addressNode(node: CircuitNode) {
        this._addressNode = node;
        node.addNeighbour(this);
    }

    set outputDataNode(node: CircuitNode) {
        this._outputDataNode = node;
    }
}