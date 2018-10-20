import {Component} from "./Component";
import {Graphics} from "./Graphics";
import {Config} from "./Config";
import {CircuitNode} from "./CircutNode";

class RegisterFile extends Component {
    private readonly size: number = 16;
    private values: number[] = [];

    private _inputReadSel1Node: CircuitNode;
    private _inputReadSel2Node: CircuitNode;
    private _inputWriteSelNode: CircuitNode;

    private _inputWriteEnNode: CircuitNode;
    private _inputWriteNode: CircuitNode;

    private _outputRead1Node: CircuitNode;
    private _outputRead2Node: CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
        for (let i = 0; i < this.size; i++) {
            this.values.push(i);
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
        //this._outputInstrNode.forwardSignal(this, this.values[value / 4]);
    }


    set inputReadSel1Node(node: CircuitNode) {
        this._inputReadSel1Node = node;
    }

    set inputReadSel2Node(node: CircuitNode) {
        this._inputReadSel2Node = node;
    }

    set inputWriteSelNode(node: CircuitNode) {
        this._inputWriteSelNode = node;
    }

    set inputWriteEnNode(node: CircuitNode) {
        this._inputWriteEnNode = node;
    }

    set inputWriteNode(node: CircuitNode) {
        this._inputWriteNode = node;
    }

    set outputRead1Node(node: CircuitNode) {
        this._outputRead1Node = node;
    }

    set outputRead2Node(node: CircuitNode) {
        this._outputRead2Node = node;
    }
}

export {RegisterFile}