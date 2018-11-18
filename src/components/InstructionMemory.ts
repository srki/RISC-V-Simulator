import Component from "./Component";
import Graphics from "../util/Graphics";
import Config from "../util/Config";
import CircuitNode from "./CircutNode";
import Value from "../util/Value";
import InstructionHelper from "../instructions/InstructionHelper";
import InstructionConstants from "../instructions/InstructionConstants";
import {InstructionDecoder} from "../instructions/InstructionDecoder";
import InstructionFactory from "../instructions/InstructionFactory";

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

        this.values[0] = InstructionFactory.createIType(InstructionConstants.OP_CODE_LW, InstructionConstants.FUNCT_LW, 1, 0, 124);
        this.values[1] = InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, InstructionConstants.FUNCT_ADDI, 2, 0, 0);
        this.values[2] = InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, InstructionConstants.FUNCT_ADDI, 3, 0, 0);

        this.values[3] = InstructionFactory.createBType(InstructionConstants.OP_CODE_BRANCH, InstructionConstants.FUNCT_BGE, 2, 1, 112);
        this.values[4] = InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, InstructionConstants.FUNCT_ADDI, 4, 0, 0);
        this.values[5] = InstructionFactory.createSType(InstructionConstants.OP_CODE_SW, InstructionConstants.FUNCT_SW, 3, 4, 0);
        this.values[6] = InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, InstructionConstants.FUNCT_ADDI, 2, 2, 1);
        this.values[7] = InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, InstructionConstants.FUNCT_ADDI, 3, 3, 4);

        this.values[8] = InstructionFactory.createBType(InstructionConstants.OP_CODE_BRANCH, InstructionConstants.FUNCT_BGE, 2, 1, 92);
        this.values[9] = InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, InstructionConstants.FUNCT_ADDI, 5, 0, 1);
        this.values[10] = InstructionFactory.createSType(InstructionConstants.OP_CODE_SW, InstructionConstants.FUNCT_SW, 3, 5, 0);
        this.values[11] = InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, InstructionConstants.FUNCT_ADDI, 2, 2, 1);
        this.values[12] = InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, InstructionConstants.FUNCT_ADDI, 3, 3, 4);

        this.values[13] = InstructionFactory.createBType(InstructionConstants.OP_CODE_BRANCH, InstructionConstants.FUNCT_BGE, 2, 1, 72);
        this.values[14] = InstructionFactory.createRType(InstructionConstants.OP_CODE_ALU, InstructionConstants.FUNCT_ADD, 6, 5 ,0);
        this.values[15] = InstructionFactory.createRType(InstructionConstants.OP_CODE_ALU, InstructionConstants.FUNCT_ADD, 5, 5 ,4);
        this.values[16] = InstructionFactory.createRType(InstructionConstants.OP_CODE_ALU, InstructionConstants.FUNCT_ADD, 4, 6 ,0);
        this.values[17] = InstructionFactory.createSType(InstructionConstants.OP_CODE_SW, InstructionConstants.FUNCT_SW, 3, 5, 0);
        this.values[18] = InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, InstructionConstants.FUNCT_ADDI, 2, 2, 1);
        this.values[19] = InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, InstructionConstants.FUNCT_ADDI, 3, 3, 4);
        this.values[20] = InstructionFactory.createBType(InstructionConstants.OP_CODE_BRANCH, InstructionConstants.FUNCT_BGE, 0, 0, -28);

        this.values[31] = InstructionFactory.createBType(InstructionConstants.OP_CODE_BRANCH, InstructionConstants.FUNCT_BGE, 0, 0, 0);
    }

    refresh(): void {
        this.selectedInstr = undefined;
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 230, InstructionMemory.SIZE * 20 + 30,
            Config.elementFillColor, Config.elementStrokeColor);

        for (let i = 0; i < InstructionMemory.SIZE; i++) {
            g.fillRect(this.x + 15, this.y + 15 + i * 20, 200, 20,
                Config.memoryFillColor, Config.memoryStrokeColor, 1);

            let text = this._decoded ? InstructionDecoder.decode(this.values[i]) : this.values[i].asHexString();
            let color = this.selectedInstr == i ? Config.readFontColor : Config.fontColor;
            g.drawText(this.x + 15 + 10, this.y + 15 + 17 + i * 20, text, color, 18);
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