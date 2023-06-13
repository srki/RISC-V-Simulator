import Component from "./Component";
import Graphics from "../util/Graphics";
import Config from "../util/Config";
import CircuitNode from "./CircutNode";
import Value from "../util/Value";
import {InstructionDecoder} from "../instructions/InstructionDecoder";

export default class InstructionMemory extends Component {
    public static readonly SIZE: number = 32;
    private readonly values: Value[] = [];

    private selectedInstr;

    private _decoded = true;

    private _addressNode: CircuitNode;
    private _outputDataNode: CircuitNode;

    constructor(x: number, y: number, values: Value[]) {
        super(x, y);
        this.values = values;

        while (this.values.length < InstructionMemory.SIZE) {
            this.values.push(Value.fromSignedInt(0))
        }
    }

    refresh(): void {
        this.selectedInstr = undefined;
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 230, InstructionMemory.SIZE * 20 + 30,
            Config.elementFillColor, Config.elementStrokeColor);

        for (let i = 0; i < InstructionMemory.SIZE; i++) {
            let fillColor = this.selectedInstr == i ? Config.readFontColor : Config.memoryFillColor;

            g.fillRect(this.x + 15, this.y + 15 + i * 20, 200, 20, fillColor, Config.memoryStrokeColor, 1);

            let text = this._decoded ? InstructionDecoder.decode(this.values[i]) : this.values[i].asHexString();
            g.drawText(this.x + 15 + 10, this.y + 15 + 17 + i * 20, text, Config.fontColor, 18);
        }

        if (this.selectedInstr != undefined) {
            let instrY = this.y + 15 + this.selectedInstr * 20 + 11;
            g.drawPath([[this.x + 215, instrY], [this.x + 222.5, instrY],
                    [this.x + 222.5, this._outputDataNode.y], [this._outputDataNode.x, this._outputDataNode.y]],
                Config.signalColor);
        }
    }

    forwardSignal(signaler: Component, value: Value): void {
        this.selectedInstr = value.asUnsignedInt() / 4;
        this._outputDataNode.forwardSignal(this, this.values[this.selectedInstr]);
    }

    mark(caller: Component): void {
        this._addressNode.mark(this);
    }

    set addressNode(node: CircuitNode) {
        this._addressNode = node;
        node.addNeighbour(this);
    }

    set outputDataNode(node: CircuitNode) {
        this._outputDataNode = node;
    }
}