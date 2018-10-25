import Component from "./Component";
import Graphics from "./Graphics";
import Config from "./Config";
import CircuitNode from "./CircutNode";
import Val from "./Val";
import InstructionHelper from "./InstructionHelper";

export default class ImmSelect extends Component {
    public static readonly ITYPE = Val.UnsignedInt(0, 2);
    public static readonly BRTYPE = Val.UnsignedInt(1, 2);
    public static readonly BSTYPE = Val.UnsignedInt(2, 2);

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
        g.drawText(this.x + 30, this.y + 23, "Imm", Config.fontColor, Config.fontSize);
        g.drawText(this.x + 15, this.y + 43, "Select", Config.fontColor, Config.fontSize);
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

        let result: number;

        switch (this.ctrlValue) {
            case ImmSelect.ITYPE: {
                result = InstructionHelper.getImmIType(this.instrValue);
                break;
            }
            case ImmSelect.BRTYPE: {
                result = InstructionHelper.getImmBType(this.instrValue);
                break;
            }
            case ImmSelect.BSTYPE: {
                result = InstructionHelper.getImmSType(this.instrValue);
                break;
            }
            default: {
                result = 0;
                console.log("Unsupported control signal");
            }
        }

        this._outNode.forwardSignal(this, new Val(result, 32));
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