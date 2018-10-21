import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";

export default class ControlUnit extends Component{
    private _inputNode : CircuitNode;

    private _PCSelNode: CircuitNode;
    private _RegWriteEn: CircuitNode;
    private _MemWrite: CircuitNode;
    private _WBSel: CircuitNode;
    private _WASel: CircuitNode;
    private _ImmSel: CircuitNode;
    private _FuncSel: CircuitNode;
    private _Op2Sel: CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 170, 125, Config.elementFillColor, Config.elementStrokeColor);
        g.drawText(this.x + 43, this.y + 45, "Control", Config.fontColor, Config.fontSize);
        g.drawText(this.x + 60, this.y + 70, "Unit", Config.fontColor, Config.fontSize);

        g.fillRect(this.x + 10, this.y + 90, 150, 25,
            Config.memoryFillColor, Config.memoryStrokeColor);
        g.drawText(this.x + 20, this.y + 90 + 21, this._inputNode.value.asHexString(),
            Config.fontColor, Config.fontSize);
    }


    set inputNode(node: CircuitNode) {
        this._inputNode = node;
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