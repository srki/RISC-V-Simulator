import CircuitNode from "CircutNode";
import Graphics from "Graphics";
import Config from "Config";
import Component from "Component";
import Val from "Val";

export default class DataMemory extends Component {
    public static readonly WRITE_NO = Val.UnsignedInt(0, 1);
    public static readonly WRITE_YES = Val.UnsignedInt(1, 1);

    private readonly size: number = 32;
    private values: Val[] = [];

    private _writeEnNode: CircuitNode;
    private _addressNode: CircuitNode;
    private _inputDataNode: CircuitNode;
    private _outputDataNode: CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
        for (let i = 0; i < this.size; i++) {
            this.values.push(Val.SignedInt(i + 1));
        }
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, this.size * 15 + 20,
            Config.elementFillColor, Config.elementStrokeColor);

        for (let i = 0; i < this.size; i++) {
            g.fillRect(this.x + 10, this.y + 10 + i * 15, 80, 15,
                Config.memoryFillColor, Config.memoryStrokeColor);
            g.drawText(this.x + 10 + 5, this.y + 10 + 12 + i * 15, this.values[i].asHexString(),
                Config.fontColor, 12);
        }
    }

    forwardSignal(signaler: Component, value: Val): void {
        this._outputDataNode.forwardSignal(this, this.values[value.asUnsignedInt() / 4]);
    }

    set writeEnNode(value: CircuitNode) {
        this._writeEnNode = value;
    }

    set addressNode(node: CircuitNode) {
        this._addressNode = node;
        node.addNeighbour(this);
    }

    set inputDataNode(value: CircuitNode) {
        this._inputDataNode = value;
    }

    set outputDataNode(node: CircuitNode) {
        this._outputDataNode = node;
    }
}