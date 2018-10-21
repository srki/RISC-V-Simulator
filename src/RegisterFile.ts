import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";
import Val, {VAL_ONE_32b, VAL_ZERO_32b} from "Val";
import InstructionHelper from "./InstructionHelper";

export default class RegisterFile extends Component {
    public static readonly WRITE_NO = Val.UnsignedInt(0, 1);
    public static readonly WRITE_YES = Val.UnsignedInt(1, 1);

    private readonly size: number = 16;
    private values: Val[] = [];

    private _readSel1Node: CircuitNode;
    private _readSel2Node: CircuitNode;
    private _inputWriteSelNode: CircuitNode;

    private _inputWriteEnNode: CircuitNode;
    private _inputWriteDataNode: CircuitNode;

    private _readData1Node: CircuitNode;
    private _readData2Node: CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
        for (let i = 0; i < this.size; i++) {
            this.values.push(VAL_ZERO_32b);
        }

        this.values[0] = VAL_ZERO_32b;
        this.values[1] = VAL_ONE_32b;
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
        if (signaler == this._readSel1Node) {
            this._readData1Node.forwardSignal(this, this.values[InstructionHelper.getRs1(value)]);
        } else if (signaler == this._readSel2Node) {
            this._readData2Node.forwardSignal(this, this.values[InstructionHelper.getRs2(value)]);
        } else {
            console.error("Error");
        }
    }


    onRisingEdge(): void {
        if (this._inputWriteEnNode.value == RegisterFile.WRITE_YES) {
            let sel = InstructionHelper.getRd(this._inputWriteSelNode.value);
            if (sel == 0) {
                console.log("Ignoring write to register 0");
            } else  {
                this.values[sel] = this._inputWriteDataNode.value;
            }
        }
    }

    set readSel1Node(node: CircuitNode) {
        this._readSel1Node = node;
        node.addNeighbour(this);
    }

    set readSel2Node(node: CircuitNode) {
        this._readSel2Node = node;
        node.addNeighbour(this);
    }

    set inputWriteSelNode(node: CircuitNode) {
        this._inputWriteSelNode = node;
    }

    set inputWriteEnNode(node: CircuitNode) {
        this._inputWriteEnNode = node;
    }

    set inputWriteDataNode(node: CircuitNode) {
        this._inputWriteDataNode = node;
    }

    set readData1Node(node: CircuitNode) {
        this._readData1Node = node;
    }

    set readData2Node(node: CircuitNode) {
        this._readData2Node = node;
    }
}