import Component from "./Component";
import Graphics from "./Graphics";
import Config from "./Config";
import CircuitNode from "./CircutNode";
import Val from "./Val";
import ArithmeticLogicUnit from "./ArithmeticLogicUnit";
import InstructionHelper from "./InstructionHelper";

export default class ALUControl extends Component {
    public static readonly FUNC = Val.UnsignedInt(0, 2);
    public static readonly OP = Val.UnsignedInt(1, 2);
    public static readonly ADD = Val.UnsignedInt(2, 2);

    private _instrNode: CircuitNode;
    private _controlNode: CircuitNode;
    private _outNode: CircuitNode;

    private instrValue: Val;
    private ctrlValue: Val;

    constructor(x: number, y: number) {
        super(x, y);
        this.refresh();
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, 50, Config.elementFillColor, Config.elementStrokeColor);
        g.drawText(this.x + 30, this.y + 23, "ALU", Config.fontColor, Config.fontSize);
        g.drawText(this.x + 10, this.y + 43, "Control", Config.fontColor, Config.fontSize);
    }

    refresh(): void {
        this.instrValue = undefined;
        this.ctrlValue = undefined;
    }

    forwardSignal(signaler: Component, value: Val): void {
        switch (signaler) {
            case this._instrNode: {
                this.instrValue = value;
                break;
            }
            case this._controlNode: {
                this.ctrlValue = value;
                break;
            }
            default: {
                console.log("Error");
            }
        }

        if (this.instrValue == undefined || this.ctrlValue == undefined) {
            return;
        }

        let result: Val;

        switch (this.ctrlValue) {
            case ALUControl.FUNC: {
                result = this.handleFunc();
                break;
            }
            case ALUControl.OP: {
                result = this.handleOp();
                break;
            }
            case ALUControl.ADD: {
                result = ALUControl.ADD;
                break;
            }
            default: {
                console.log("Unsupported control signal");
            }
        }

        if (result == undefined) {
            console.log("Unsupported operation")
        } else {
            this._outNode.forwardSignal(this, result);
        }

    }

    private handleFunc(): Val {
        let func7 = this.instrValue.asBinaryString().substr(0, 7);
        let func3 = this.instrValue.asBinaryString().substr(17, 3);
        let func = func7 + func3;

        switch (func) {
            case InstructionHelper.FUNCT_ADD:
                return ArithmeticLogicUnit.ADD;

            case InstructionHelper.FUNCT_SUB:
                return ArithmeticLogicUnit.SUB;

            case InstructionHelper.FUNCT_SLL:
                return ArithmeticLogicUnit.SLL;

            case InstructionHelper.FUNCT_SLT:
                return ArithmeticLogicUnit.SLT;

            case InstructionHelper.FUNCT_SLTU:
                return ArithmeticLogicUnit.SLTU;

            case InstructionHelper.FUNCT_XOR:
                return ArithmeticLogicUnit.XOR;

            case InstructionHelper.FUNCT_SRL:
                return ArithmeticLogicUnit.XOR;

            case InstructionHelper.FUNCT_SRA:
                return ArithmeticLogicUnit.SRA;

            case InstructionHelper.FUNCT_OR:
                return ArithmeticLogicUnit.OR;

            case InstructionHelper.FUNCT_AND:
                return ArithmeticLogicUnit.AND;

            default:
                return null;
        }
    }

    private handleOp(): Val {
        let func7 = this.instrValue.asBinaryString().substr(0, 7);
        let func3 = this.instrValue.asBinaryString().substr(17, 3);

        switch (func3) {
            case InstructionHelper.FUNCT_ADDI:
                return ArithmeticLogicUnit.ADD;

            case InstructionHelper.FUNCT_SLTI:
                return ArithmeticLogicUnit.SLT;

            case InstructionHelper.FUNCT_SLTIU:
                return ArithmeticLogicUnit.SLTU;

            case InstructionHelper.FUNCT_XORI:
                return ArithmeticLogicUnit.XOR;

            case InstructionHelper.FUNCT_ORI:
                return ArithmeticLogicUnit.OR;

            case InstructionHelper.FUNCT_ANDI:
                return ArithmeticLogicUnit.AND;
        }

        switch (func7 + func3) {
            case InstructionHelper.FUNCT_SLLI:
                return ArithmeticLogicUnit.SLL;

            case InstructionHelper.FUNCT_SRLI:
                return ArithmeticLogicUnit.SRL;

            case InstructionHelper.FUNCT_SRAI:
                return ArithmeticLogicUnit.SRA;

            default:
                return undefined;
        }
    }

    mark(caller: Component): void {
        this._instrNode.mark(this);
        this._controlNode.mark(this);
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