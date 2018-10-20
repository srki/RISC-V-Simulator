import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";

export default class InstructionMemory extends Component {
    private readonly size: number = 32;
    private values: number[] = [];

    private _inputAddrNode: CircuitNode;
    private _outputInstrNode: CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
        for (let i = 0; i < this.size; i++) {
            this.values.push(i+1);
        }
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, this.size * 15 + 20,
            Config.elementFillColor, Config.elementStrokeColor);

        for (let i = 0; i < this.size; i++) {
            g.fillRect(this.x + 10, this.y + 10 + i * 15, 80, 15,
                Config.memoryFillColor, Config.memoryStrokeColor);
            g.drawText(this.x + 10 + 5, this.y + 10 + 12 + i * 15, this.formatValue(i),
                Config.fontColor, 12);
        }
    }

    private formatValue(idx: number): string {
        let formatted = this.values[idx].toString(16);
        while (formatted.length < 8) {
            formatted = "0" + formatted;
        }

        return "0x" + formatted;
    }


    forwardSignal(signaler: Component, value: number): void {
        this._outputInstrNode.forwardSignal(this, this.values[value / 4]);
    }

    set inputAddrNode(node: CircuitNode) {
        this._inputAddrNode = node;
        node.addNeighbour(this);
    }

    set outputInstrNode(node: CircuitNode) {
        this._outputInstrNode = node;
    }
}