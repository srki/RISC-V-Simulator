import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";
import Val from "Val";
import ArithmeticLogicUnit from "./ArithmeticLogicUnit";
import InstructionHelper from "./InstructionHelper";

export default class ALUControl extends Component {
    public static readonly FUNC = Val.UnsignedInt(0, 2);
    public static readonly OP = Val.UnsignedInt(1, 2);
    public static readonly ADD = Val.UnsignedInt(2, 2);

    private _instrNode: CircuitNode;
    private _outNode: CircuitNode;
    private _controlNode: CircuitNode;

    private instructionValue: Val;
    private controlValue: Val;

    constructor(x: number, y: number) {
        super(x, y);
        this.reset();
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, 50, Config.elementFillColor, Config.elementStrokeColor);
        g.drawText(this.x + 30, this.y + 23, "ALU", Config.fontColor, Config.fontSize);
        g.drawText(this.x + 10, this.y + 43, "Control", Config.fontColor, Config.fontSize);
    }

    reset(): void {
        this.instructionValue = undefined;
        this.controlValue = undefined;
    }

    forwardSignal(signaler: Component, value: Val): void {
        switch (signaler) {
            case this._instrNode: {
                this.instructionValue = value;
                break;
            }
            case this._controlNode: {
                this.controlValue = value;
                break;
            }
            default: {
                console.log("Error");
            }
        }

        if (this.instructionValue == undefined || this.controlValue == undefined) {
            return;
        }

        switch (this.controlValue) {
            case ALUControl.FUNC: {
                this.handleFunc();
                break;
            }
            case ALUControl.OP: {
                this.handleOp();
                break;
            }
            case ALUControl.ADD: {
                this.handleAdd();
                break;
            }
            default: {
                console.log("Error");
            }
        }

    }

    private handleFunc() {
        let func7 = this.instructionValue.asBinaryString().substr(0, 7);
        let func3 = this.instructionValue.asBinaryString().substr(17, 3);
        let func = func7 + func3;

        let result: Val;

        switch (func) {
            case InstructionHelper.FUNCT_ADD: {
                result = ArithmeticLogicUnit.ADD;
                break;
            }
            case InstructionHelper.FUNCT_SUB: {
                result = ArithmeticLogicUnit.SUB;
                break;
            }
            case InstructionHelper.FUNCT_SLL: {
                result = ArithmeticLogicUnit.SLL;
                break;
            }
            case InstructionHelper.FUNCT_SLT: {
                result = ArithmeticLogicUnit.SLT;
                break;
            }
            case InstructionHelper.FUNCT_SLTU: {
                result = ArithmeticLogicUnit.SLTU;
                break;
            }
            case InstructionHelper.FUNCT_XOR: {
                result = ArithmeticLogicUnit.XOR;
                break;
            }
            case InstructionHelper.FUNCT_SRL: {
                result = ArithmeticLogicUnit.XOR;
                break;
            }
            case InstructionHelper.FUNCT_SRA: {
                result = ArithmeticLogicUnit.SRA;
                break;
            }
            case InstructionHelper.FUNCT_OR: {
                result = ArithmeticLogicUnit.OR;
                break;
            }
            case InstructionHelper.FUNCT_AND: {
                result = ArithmeticLogicUnit.AND;
                break;
            }
        }
        this._outNode.forwardSignal(this, result);
    }

    private handleOp() {
        let func7 = this.instructionValue.asBinaryString().substr(0, 7);
        let func3 = this.instructionValue.asBinaryString().substr(17, 3);

        let result: Val;

        switch (func3) {
            case InstructionHelper.FUNCT_ADDI: {
                result = ArithmeticLogicUnit.ADD;
                break;
            }
            case InstructionHelper.FUNCT_SLTI: {
                result = ArithmeticLogicUnit.SLT;
                break;
            }
            case InstructionHelper.FUNCT_SLTIU: {
                result = ArithmeticLogicUnit.SLTU;
                break;
            }
            case InstructionHelper.FUNCT_XORI: {
                result = ArithmeticLogicUnit.XOR;
                break;
            }
            case InstructionHelper.FUNCT_ORI: {
                result = ArithmeticLogicUnit.OR;
                break;
            }
            case InstructionHelper.FUNCT_ANDI: {
                result = ArithmeticLogicUnit.AND;
                break;
            }
        }

        if (result != undefined) {
            this._outNode.forwardSignal(this, result);
            return;
        }

        switch (func7 + func3) {
            case InstructionHelper.FUNCT_SLLI: {
                result = ArithmeticLogicUnit.SLL;
                break;
            }
            case InstructionHelper.FUNCT_SRLI: {
                result = ArithmeticLogicUnit.SRL;
                break;
            }
            case InstructionHelper.FUNCT_SRAI: {
                result = ArithmeticLogicUnit.SRA;
                break;
            }
            default: {
                console.log("Error");
            }
        }

        this._outNode.forwardSignal(this, result);
    }

    private handleAdd() {
        this._outNode.forwardSignal(this, ArithmeticLogicUnit.ADD);
    }

    set instrNode(node: CircuitNode) {
        this._instrNode = node;
        node.addNeighbour(this);
    }

    set controlNode(node: CircuitNode) {
        this._controlNode = node;
        node.addNeighbour(this);
    }

    set outNode(node: CircuitNode) {
        this._outNode = node;
    }
}