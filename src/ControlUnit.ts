import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";
import Val, {VAL_ONE_32b, VAL_THREE_32b, VAL_TWO_32b, VAL_ZERO_32b} from "Val";
import ALUControl from "ALUControl";
import DataMemory from "DataMemory";
import RegisterFile from "RegisterFile";
import InstructionHelper from "InstructionHelper";
import ImmSelect from "ImmSelect";

export default class ControlUnit extends Component {
    private _instrNode: CircuitNode;

    private _PCSelNode: CircuitNode;
    private _RegWriteEn: CircuitNode;
    private _MemWrite: CircuitNode;
    private _WBSel: CircuitNode;
    private _WASel: CircuitNode;
    private _ImmSel: CircuitNode;
    private _FuncSel: CircuitNode;
    private _Op2Sel: CircuitNode;

    private instrValue: Val;

    constructor(x: number, y: number) {
        super(x, y);
        this.reset();
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 170, 125, Config.elementFillColor, Config.elementStrokeColor);
        g.drawText(this.x + 43, this.y + 45, "Control", Config.fontColor, Config.fontSize);
        g.drawText(this.x + 60, this.y + 70, "Unit", Config.fontColor, Config.fontSize);

        g.fillRect(this.x + 10, this.y + 90, 150, 25,
            Config.memoryFillColor, Config.memoryStrokeColor);
        g.drawText(this.x + 20, this.y + 90 + 21, this._instrNode.value.asHexString(),
            Config.fontColor, Config.fontSize);
    }

    reset(): void {
        this.instrValue = undefined;
    }

    forwardSignal(signaler: Component, value: Val): void {
        switch (signaler) {
            case this._instrNode: {
                this.instrValue = value;
                break;
            }
            default: {
                console.error("Error");
            }
        }

        let opcode = InstructionHelper.getOpCodeStr(this.instrValue);
        let ImmSel, Op2Sel, FuncSel, MemWr, RFWen, WBSel, WASel, PCSel: Val;

        switch (opcode) {
            case InstructionHelper.OP_CODE_ALU : {
                ImmSel = undefined;
                Op2Sel = VAL_ZERO_32b;
                FuncSel = ALUControl.FUNC;
                MemWr = DataMemory.WRITE_NO;
                RFWen = RegisterFile.WRITE_YES;
                WBSel = VAL_TWO_32b;
                WASel = VAL_ONE_32b;
                PCSel = VAL_THREE_32b;
                break
            }
            case InstructionHelper.OP_CODE_ALUI : {
                ImmSel = ImmSelect.ITYPE;
                Op2Sel = VAL_ONE_32b;
                FuncSel = ALUControl.OP;
                MemWr = DataMemory.WRITE_NO;
                RFWen = RegisterFile.WRITE_YES;
                WBSel = VAL_TWO_32b;
                WASel = VAL_ONE_32b;
                PCSel = VAL_THREE_32b;
                break
            }
            case InstructionHelper.OP_CODE_LW : {
                ImmSel = ImmSelect.ITYPE;
                Op2Sel = VAL_ONE_32b;
                FuncSel = ALUControl.ADD;
                MemWr = DataMemory.WRITE_NO;
                RFWen = RegisterFile.WRITE_YES;
                WBSel = VAL_ONE_32b;
                WASel = VAL_ONE_32b;
                PCSel = VAL_THREE_32b;
                break
            }
            case InstructionHelper.OP_CODE_SW : {
                ImmSel = ImmSelect.BSTYPE;
                Op2Sel = VAL_ONE_32b;
                FuncSel = ALUControl.ADD;
                MemWr = DataMemory.WRITE_YES;
                RFWen = RegisterFile.WRITE_NO;
                WBSel = undefined;
                WASel = undefined;
                PCSel = VAL_THREE_32b;
                break
            }
            case InstructionHelper.OP_CODE_BRANCH : {
                ImmSel = ImmSelect.BRTYPE;
                Op2Sel = undefined;
                FuncSel = undefined;
                MemWr = DataMemory.WRITE_NO;
                RFWen = RegisterFile.WRITE_NO;
                WBSel = undefined;
                WASel = undefined;
                PCSel = true ? VAL_ZERO_32b : VAL_THREE_32b; // TODO
                break
            }
            case InstructionHelper.OP_CODE_JAL : {
                ImmSel = undefined;
                Op2Sel = undefined;
                FuncSel = undefined;
                MemWr = DataMemory.WRITE_NO;
                RFWen = RegisterFile.WRITE_YES;
                WBSel = VAL_ZERO_32b;
                WASel = VAL_ZERO_32b;
                PCSel = VAL_TWO_32b;
                break
            }
            case InstructionHelper.OP_CODE_JALR : {
                ImmSel = undefined;
                Op2Sel = undefined;
                FuncSel = undefined;
                MemWr = DataMemory.WRITE_NO;
                RFWen = RegisterFile.WRITE_YES;
                WBSel = VAL_ZERO_32b;
                WASel = VAL_ONE_32b;
                PCSel = VAL_ONE_32b;
                break
            }

            default: {
                console.error("Unknown OP Code: " + opcode);
                PCSel = VAL_THREE_32b;
            }
        }

        if (ImmSel) this._ImmSel.forwardSignal(this, ImmSel);
        if (Op2Sel) this._Op2Sel.forwardSignal(this, Op2Sel);
        if (FuncSel) this._FuncSel.forwardSignal(this, FuncSel);
        if (MemWr) this._MemWrite.forwardSignal(this, MemWr);
        if (RFWen) this._RegWriteEn.forwardSignal(this, RFWen);
        if (WBSel) this._WBSel.forwardSignal(this, WBSel);
        if (WASel) this._WASel.forwardSignal(this, WASel);
        if (PCSel) this._PCSelNode.forwardSignal(this, PCSel);
    }

    set instrNode(node: CircuitNode) {
        this._instrNode = node;
        node.addNeighbour(this);
    }

    set PCSelNode(node: CircuitNode) {
        this._PCSelNode = node;
    }

    set RegWriteEn(node: CircuitNode) {
        this._RegWriteEn = node;
    }

    set MemWrite(node: CircuitNode) {
        this._MemWrite = node;
    }

    set WBSel(node: CircuitNode) {
        this._WBSel = node;
    }

    set WASel(node: CircuitNode) {
        this._WASel = node;
    }

    set ImmSel(node: CircuitNode) {
        this._ImmSel = node;
    }

    set FuncSel(node: CircuitNode) {
        this._FuncSel = node;
    }

    set Op2Sel(node: CircuitNode) {
        this._Op2Sel = node;
    }
}