import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";
import Val from "./Val";

export default class InstructionMemory extends Component {
    private readonly size: number = 32;
    private values: Val[] = [];

    private _inputAddrNode: CircuitNode;
    private _outputInstrNode: CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
        for (let i = 0; i < this.size; i++) {
            this.values.push(Val.UnsignedInt(i+1));
        }
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, this.size * 15 + 20,
            Config.elementFillColor, Config.elementStrokeColor);

        for (let i = 0; i < this.size; i++) {
            g.fillRect(this.x + 10, this.y + 10 + i * 15, 80, 15,
                Config.memoryFillColor, Config.memoryStrokeColor);
            g.drawText(this.x + 10 + 5, this.y + 10 + 12 + i * 15,  this.values[i].asHexString(),
                Config.fontColor, 12);
        }
    }

    forwardSignal(signaler: Component, value: Val): void {
        this._outputInstrNode.forwardSignal(this, this.values[value.asUnsignedInt() / 4]);
    }

    set inputAddrNode(node: CircuitNode) {
        this._inputAddrNode = node;
        node.addNeighbour(this);
    }

    set outputInstrNode(node: CircuitNode) {
        this._outputInstrNode = node;
    }
}