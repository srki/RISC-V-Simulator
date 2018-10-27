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

        this.values[0] = InstructionHelper.createIType(InstructionHelper.OP_CODE_LW, InstructionHelper.FUNCT_LW,
            1, 0, 31 * 4);

        this.values[1] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SB,
            0, 1, 0);

        this.values[2] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SB,
            0, 1, 1);

        this.values[3] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SB,
            0, 1, 2);

        this.values[4] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SB,
            0, 1, 3);

        this.values[5] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SB,
            0, 1, 4);

        this.values[6] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SH,
            0, 1, 8);

        this.values[7] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SH,
            0, 1, 9);

        this.values[8] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SH,
            0, 1, 10);

        this.values[9] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SH,
            0, 1, 11);

        this.values[10] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SW,
            0, 1, 16);

        this.values[11] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SW,
            0, 1, 17);

        this.values[12] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SW,
            0, 1, 18);

        this.values[13] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SW,
            0, 1, 19);

        this.values[14] = InstructionHelper.createSType(InstructionHelper.OP_CODE_SW, InstructionHelper.FUNCT_SW,
            0, 1, 20);
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