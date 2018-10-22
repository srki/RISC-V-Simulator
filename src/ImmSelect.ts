import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";
import Val from "Val";

export default class ImmSelect extends Component {
    public static readonly ITYPE = Val.UnsignedInt(0, 2);
    public static readonly BRTYPE = Val.UnsignedInt(1, 2);
    public static readonly BSTYPE = Val.UnsignedInt(2, 2);

    private _instrNode: CircuitNode;
    private _outNode: CircuitNode;
    private _controlNode: CircuitNode;

    private instrValue: Val;
    private controlValue: Val;

    constructor(x: number, y: number) {
        super(x, y);
        this.reset();
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, 50, Config.elementFillColor, Config.elementStrokeColor);
        g.drawText(this.x + 30, this.y + 23, "Imm", Config.fontColor, Config.fontSize);
        g.drawText(this.x + 15, this.y + 43, "Select", Config.fontColor, Config.fontSize);
    }

    reset(): void {
        this.instrValue = undefined;
        this.controlValue = undefined;
    }


    forwardSignal(signaler: Component, value: Val): void {
        switch (signaler) {
            case this._instrNode: {
                this.instrValue = value;
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

        if (this.instrValue == undefined || this.controlValue == undefined) {
            return;
        }

        let result: Val;

        switch (this.controlValue) {
            case ImmSelect.ITYPE: {
                result = this.handleIType();
                break;
            }
            case ImmSelect.BRTYPE: {
                result = this.handleBType();
                break;
            }
            case ImmSelect.BSTYPE: {
                result = this.handleSType();
                break;
            }
            default: {
                console.log("Unsupported control signal");
            }
        }

        this._outNode.forwardSignal(this, result);
    }

    handleIType(): Val {
        let imm = this.instrValue.asBinaryString().substr(0, 12);
        return new Val(parseInt(imm, 2), 32);
    }

    handleBType(): Val {
        let instr = this.instrValue.asBinaryString();
        let imm12 = instr.substr(0, 1);
        let imm10 = instr.substr(1, 6);
        let imm4 = instr.substr(20, 4);
        let imm11 = instr.substr(24, 1);

        return new Val(parseInt(imm12 + imm11 + imm10 + imm4  + "0", 2), 32);
    }

    handleSType(): Val {
        let instr = this.instrValue.asBinaryString();
        let imm11 = instr.substr(0, 7);
        let imm4 = instr.substr(20, 5);

        return new Val(parseInt(imm11 + imm4, 2), 32);
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