import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";

export default class ALUControl extends Component{

    private _inputInstrNode: CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, 50, Config.elementFillColor, Config.elementStrokeColor);
        g.drawText(this.x + 30, this.y + 23, "ALU", Config.fontColor, Config.fontSize);
        g.drawText(this.x + 10, this.y + 43, "Control", Config.fontColor, Config.fontSize);
    }

    set inputInstrNode(value: CircuitNode) {
        this._inputInstrNode = value;
    }

}