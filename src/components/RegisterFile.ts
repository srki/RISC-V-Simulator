import Component from "./Component";
import Graphics from "../util/Graphics";
import Config from "../util/Config";
import CircuitNode from "./CircutNode";
import Value, {VAL_ZERO_32b} from "../util/Value";
import InstructionHelper from "../instructions/InstructionHelper";

export default class RegisterFile extends Component {
    public static readonly WRITE_NO = Value.fromUnsignedInt(0, 1);
    public static readonly WRITE_YES = Value.fromUnsignedInt(1, 1);

    private readonly maxSize: number = 32;
    private readonly size: number = 16;
    private values: Value[] = [];

    private selectedReadReg1: number;
    private readReg1Marked: boolean;
    private selectedReadReg2: number;
    private readReg2Marked: boolean;
    private selectedWriteReg: number;

    private nextValue: Value;
    private nextSel: number;

    private _readSel1Node: CircuitNode;
    private _readSel2Node: CircuitNode;
    private _inputWriteSelNode: CircuitNode;

    private _inputWriteEnNode: CircuitNode;
    private _inputWriteDataNode: CircuitNode;

    private _readData1Node: CircuitNode;
    private _readData2Node: CircuitNode;

    constructor(x: number, y: number) {
        super(x, y);
        for (let i = 0; i < this.maxSize; i++) {
            this.values.push(VAL_ZERO_32b);
        }

        this.nextValue = undefined;
        this.nextSel = undefined;
    }

    refresh(): void {
        // register x0 is hardwired to 0
        if (this.nextSel && this.nextValue) {
            this.values[this.nextSel] = this.nextValue;
        }

        this.nextValue = undefined;
        this.nextSel = undefined;

        this.selectedReadReg1 = undefined;
        this.readReg1Marked = false;
        this.selectedReadReg2 = undefined;
        this.readReg2Marked = false;
        this.selectedWriteReg = undefined;
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 150, this.size * 20 + 30,
            Config.elementFillColor, Config.elementStrokeColor);

        for (let i = 0; i < this.size; i++) {
            g.fillRect(this.x + 15, this.y + 15 + i * 20, 120, 20,
                Config.memoryFillColor, Config.memoryStrokeColor, 1);
            g.drawText(this.x + 15 + 5, this.y + 15 + 17 + i * 20, this.values[i].asHexString(),
                Config.fontColor, 18);
        }

        if (this.selectedWriteReg != undefined) {
            let regY = this.y + 15 + this.selectedWriteReg * 20 + 10;
            g.drawPath([[this.x, this._inputWriteDataNode.y], [this.x + 7.5, this._inputWriteDataNode.y],
                [this.x + 7.5, regY], [this.x + 15, regY]], Config.signalColor);
        }

        if (this.selectedReadReg1 != undefined && this.readReg1Marked) {
            let regY = this.y + 15 + this.selectedReadReg1 * 20 + 10;
            g.drawPath([[this.x + 135, regY], [this.x + 140, regY],
                [this.x + 140, this._readSel1Node.y], [this.x+150, this._readSel1Node.y]], Config.signalColor);
        }

        if (this.selectedReadReg2 != undefined && this.readReg2Marked) {
            let regY = this.y + 15 + this.selectedReadReg2 * 20 + 10;
            g.drawPath([[this.x + 135, regY], [this.x + 145, regY],
                [this.x + 145, this._readSel2Node.y], [this.x+150, this._readSel2Node.y]], Config.signalColor);
        }

    }

    forwardSignal(signaler: Component, value: Value): void {
        if (signaler == this._readSel1Node) {
            this.selectedReadReg1 = InstructionHelper.getRs1(value);
            this._readData1Node.forwardSignal(this, this.values[this.selectedReadReg1]);
        } else if (signaler == this._readSel2Node) {
            this.selectedReadReg2 = InstructionHelper.getRs2(value);
            this._readData2Node.forwardSignal(this, this.values[this.selectedReadReg2]);
        } else {
            console.error("Error");
        }
    }

    onRisingEdge(): void {
        if (this._inputWriteEnNode.value == RegisterFile.WRITE_YES) {
            this.nextSel = InstructionHelper.getRd(this._inputWriteSelNode.value);
            this.selectedWriteReg = this.nextSel;

            if (this._inputWriteDataNode.value == null) {
                console.log("Error");
                return;
            }

            this.nextValue = this._inputWriteDataNode.value;
            this._inputWriteEnNode.mark(this);
            this._inputWriteSelNode.mark(this);
            this._inputWriteDataNode.mark(this);
        }
    }

    mark(caller: Component): void {
        switch (caller) {
            case this._readData1Node: {
                this.readReg1Marked = true;
                this._readSel1Node.mark(this);
                break;
            }
            case this._readData2Node: {
                this.readReg2Marked = true;
                this._readSel2Node.mark(this);
                break;
            }
            default: {
                console.error("Error");
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