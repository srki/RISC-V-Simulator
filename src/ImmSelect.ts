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

    private instructionValue: Val;
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
        this.instructionValue = undefined;
        this.controlValue = undefined;
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