import Component from "./Component";
import Graphics from "./Graphics";
import Config from "./Config";
import CircuitNode from "./CircutNode";
import Val from "./Val";
import InstructionHelper from "./InstructionHelper";

export default class InstructionMemory extends Component {
    public static readonly SIZE: number = 32;
    private readonly values: Val[] = [];

    private selectedInstr;

    private _decoded = true;

    private _addressNode: CircuitNode;
    private _outputDataNode: CircuitNode;

    constructor(x: number, y: number, values: Val[]) {
        super(x, y);
        this.values = values;

        this.values[0] = InstructionHelper.createIType(InstructionHelper.OP_CODE_ALUI, InstructionHelper.FUNCT_ADDI, 1, 0, 10);
        this.values[1] = InstructionHelper.createIType(InstructionHelper.OP_CODE_ALUI, InstructionHelper.FUNCT_ADDI, 2, 0, 20);
        this.values[2] = InstructionHelper.createIType(InstructionHelper.OP_CODE_ALUI, InstructionHelper.FUNCT_ADDI, 3, 0, 20);

        this.values[3] = InstructionHelper.createBType(InstructionHelper.OP_CODE_BRANCH, InstructionHelper.FUNCT_BEQ, 1, 2, 4);
        this.values[4] = InstructionHelper.createBType(InstructionHelper.OP_CODE_BRANCH, InstructionHelper.FUNCT_BEQ, 1, 1, 8);
        this.values[5] = InstructionHelper.createBType(InstructionHelper.OP_CODE_BRANCH, InstructionHelper.FUNCT_BEQ, 1, 2, 4);
        this.values[6] = InstructionHelper.createBType(InstructionHelper.OP_CODE_BRANCH, InstructionHelper.FUNCT_BEQ, 1, 2, 4);
        this.values[6] = InstructionHelper.createBType(InstructionHelper.OP_CODE_BRANCH, InstructionHelper.FUNCT_BEQ, 1, 2, 4);
    }


    refresh(): void {
        this.selectedInstr = undefined;
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 230, InstructionMemory.SIZE * 20 + 20,
            Config.elementFillColor, Config.elementStrokeColor);

        for (let i = 0; i < InstructionMemory.SIZE; i++) {
            g.fillRect(this.x + 10, this.y + 10 + i * 20, 200, 20,
                Config.memoryFillColor, Config.memoryStrokeColor);

            let text = this._decoded ? InstructionHelper.decode(this.values[i]) : this.values[i].asHexString();
            let color = this.selectedInstr == i ? Config.readFontColor : Config.fontColor;
            g.drawText(this.x + 10 + 10, this.y + 10 + 17 + i * 20, text, color, 18);
        }

        if (this.selectedInstr != undefined) {
            let instrY = this.y + 10 + this.selectedInstr * 20 + 11;
            g.drawPath([[this.x + 210, instrY], [this.x + 220, instrY],
                    [this.x + 220, this._outputDataNode.y], [this._outputDataNode.x, this._outputDataNode.y]],
                Config.signalColor);
        }
    }

    forwardSignal(signaler: Component, value: Val): void {
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