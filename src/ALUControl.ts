import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";

export default class ALUControl extends Component{

    private _inputInstrNode: CircuitNode;
    private _outNode: CircuitNode;
    private _controlNode: CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, 50, Config.elementFillColor, Config.elementStrokeColor);
        g.drawText(this.x + 30, this.y + 23, "ALU", Config.fontColor, Config.fontSize);
        g.drawText(this.x + 10, this.y + 43, "Control", Config.fontColor, Config.fontSize);
    }

    set inputInstrNode(node: CircuitNode) {
        this._inputInstrNode = node;
    }

    set outNode(node: CircuitNode) {
        this._outNode = node;
    }

    set controlNode(value: CircuitNode) {
        this._controlNode = value;
    }
}