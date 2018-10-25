import Component from "./Component";
import Graphics from "./Graphics";
import Config from "./Config";
import CircuitNode from "./CircutNode";
import Val from "./Val";
import InstructionHelper from "./InstructionHelper";

export default class InstructionMemory extends Component {
    public static readonly SIZE: number = 32;
    private readonly values: Val[] = [];

    private _addressNode: CircuitNode;
    private _outputDataNode: CircuitNode;

    constructor(x: number, y: number, values: Val[]) {
        super(x, y);
        this.values = values;

        this.values[0] = InstructionHelper.createIType(InstructionHelper.OP_CODE_ALUI,
            InstructionHelper.FUNCT_ADDI, 1, 0, 5);

        this.values[1] = InstructionHelper.createIType(InstructionHelper.OP_CODE_ALUI,
            InstructionHelper.FUNCT_ADDI, 2, 0, 7);

        this.values[2] = InstructionHelper.createRType(InstructionHelper.OP_CODE_ALU,
            InstructionHelper.FUNCT_ADD, 3, 1, 2);

        this.values[3] = InstructionHelper.createIType(InstructionHelper.OP_CODE_ALUI,
            InstructionHelper.FUNCT_ADDI, 3, 3, 4);

        this.values[4] = InstructionHelper.createRType(InstructionHelper.OP_CODE_ALU,
            InstructionHelper.FUNCT_SUB, 4, 3, 1);

        this.values[5] = InstructionHelper.createRType(InstructionHelper.OP_CODE_ALU,
            InstructionHelper.FUNCT_ADD, 5, 4, 2);

        this.values[6] = InstructionHelper.createITypeShift(InstructionHelper.OP_CODE_ALUI,
            InstructionHelper.FUNCT_SRLI, 6, 5, 1);
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, InstructionMemory.SIZE * 15 + 20,
            Config.elementFillColor, Config.elementStrokeColor);

        for (let i = 0; i < InstructionMemory.SIZE; i++) {
            g.fillRect(this.x + 10, this.y + 10 + i * 15, 80, 15,
                Config.memoryFillColor, Config.memoryStrokeColor);
            g.drawText(this.x + 10 + 5, this.y + 10 + 12 + i * 15, this.values[i].asHexString(),
                Config.fontColor, 12);
        }
    }

    forwardSignal(signaler: Component, value: Val): void {
        this._outputDataNode.forwardSignal(this, this.values[value.asUnsignedInt() / 4]);
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