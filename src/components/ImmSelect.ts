import Component from "./Component";
import Graphics from "../util/Graphics";
import Config from "../util/Config";
import CircuitNode from "./CircutNode";
import Value from "../util/Value";
import InstructionHelper from "../instructions/InstructionHelper";

export default class ImmSelect extends Component {
    public static readonly ITYPE = Value.fromUnsignedInt(0, 2);
    public static readonly BRTYPE = Value.fromUnsignedInt(1, 2);
    public static readonly BSTYPE = Value.fromUnsignedInt(2, 2);

    private _instrNode: CircuitNode;
    private _controlNode: CircuitNode;
    private _outNode: CircuitNode;

    private instrValue: Value;
    private ctrlValue: Value;

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

    forwardSignal(signaler: Component, value: Value): void {
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

        let result: Value;

        switch (this.ctrlValue) {
            case ImmSelect.ITYPE: {
                result = Value.fromUnsignedInt(InstructionHelper.getImmIType(this.instrValue), 12);
                break;
            }
            case ImmSelect.BRTYPE: {
                result = Value.fromUnsignedInt(InstructionHelper.getImmBType(this.instrValue), 13);
                break;
            }
            case ImmSelect.BSTYPE: {
                result = Value.fromUnsignedInt(InstructionHelper.getImmSType(this.instrValue), 12);
                break;
            }
            default: {
                result = new Value("0", 12);
                console.log("Unsupported control signal");
            }
        }

        this._outNode.forwardSignal(this, result.signExtend(32));
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