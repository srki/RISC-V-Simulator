import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";

export default class ControlUnit extends Component{
    private _inputNode : CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 170, 125, Config.elementFillColor, Config.elementStrokeColor);
        g.drawText(this.x + 43, this.y + 45, "Control", Config.fontColor, Config.fontSize);
        g.drawText(this.x + 60, this.y + 70, "Unit", Config.fontColor, Config.fontSize);

        g.fillRect(this.x + 10, this.y + 90, 150, 25,
            Config.memoryFillColor, Config.memoryStrokeColor);
        g.drawText(this.x + 20, this.y + 90 + 21, ControlUnit.formatValue(this._inputNode.value),
            Config.fontColor, Config.fontSize);
    }


    set inputNode(value: CircuitNode) {
        this._inputNode = value;
    }

    private static formatValue(value: number): string {
        let formatted = value.toString(16);
        while (formatted.length < 8) {
            formatted = "0" + formatted;
        }

        return "0x" + formatted;
    }
}