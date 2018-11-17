import CircuitNode from "./CircutNode";
import Graphics from "../util/Graphics";
import Config from "../util/Config";
import Component from "./Component";
import Val, {VAL_ZERO_32b} from "../util/Val";
import InstructionHelper from "../instructions/InstructionHelper";
import InstructionConstants from "../instructions/InstructionConstants";

export default class DataMemory extends Component {
    public static readonly WRITE_NO = Val.UnsignedInt(0, 1);
    public static readonly WRITE_YES = Val.UnsignedInt(1, 1);

    private readonly size: number = 32;
    private values: Val[] = [];

    private _instrNode: CircuitNode;
    private _writeEnNode: CircuitNode;
    private _addressNode: CircuitNode;
    private _inputDataNode: CircuitNode;
    private _outputDataNode: CircuitNode;

    private instrValue: Val;
    private writeEnValue: Val;
    private addressValue: Val;

    private nextValue: Val[] = [];

    constructor(x: number, y: number) {
        super(x, y);
        for (let i = 0; i < this.size + 1; i++) {
            this.values.push(VAL_ZERO_32b);
        }

        this.values[31] = (new Val(0x76543210, 32));
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


    refresh(): void {
        this.instrValue = undefined;
        this.writeEnValue = undefined;
        this.addressValue = undefined;

        for (let i in this.nextValue) {
            this.values[i] = this.nextValue[i];
        }

        this.nextValue = [];
    }

    forwardSignal(signaler: Component, value: Val): void {
        switch (signaler) {
            case this._instrNode: {
                this.instrValue = value;
                break;
            }
            case this._writeEnNode: {
                this.writeEnValue = value;
                break;
            }
            case this._addressNode: {
                this.addressValue = value;
                break;
            }
            default: {
                console.log("Error");
            }
        }

        if (this.instrValue == undefined || this.writeEnValue == undefined || this.addressValue == undefined) {
            return;
        }

        if (InstructionHelper.getOpCodeStr(this.instrValue) != InstructionConstants.OP_CODE_LW) {
            return;
        }

        let funct = InstructionHelper.getFuncLType(this.instrValue);
        let nbytes: number;

        switch (funct) {
            case InstructionConstants.FUNCT_LB:
            case InstructionConstants.FUNCT_LBU: {
                nbytes = 1;
                break;
            }
            case InstructionConstants.FUNCT_LH:
            case InstructionConstants.FUNCT_LHU: {
                nbytes = 2;
                break;
            }
            case InstructionConstants.FUNCT_LW: {
                nbytes = 4;
                break;
            }
            default: {
                console.log("Error");
            }
        }

        let address = this.addressValue.asUnsignedInt();
        let wordIdx = Math.floor(address / 4);
        let byteIdx = address % 4;

        let result = "";

        for (let i = 0; i < nbytes; i++) {
            result = this.values[wordIdx].getByteBinary(byteIdx) + result;
            if (++byteIdx == 4) {
                byteIdx = 0;
                wordIdx++;
            }
        }

        /* Sign extend */
        if (funct == InstructionConstants.FUNCT_LBU || funct == InstructionConstants.FUNCT_LHU || true) {
            let signBit = result[0];
            while (result.length < 32) {
                result = signBit + result;
            }
        }

        this._outputDataNode.forwardSignal(this, new Val(parseInt(result, 2), 32));
    }

    mark(caller: Component): void {
        this._instrNode.mark(this);
        this._writeEnNode.mark(this);
        this._addressNode.mark(this);
    }

    onRisingEdge(): void {
        if (this._writeEnNode.value == DataMemory.WRITE_YES) {
            if (this._addressNode.value == null || this._inputDataNode.value == null) {
                console.log("Error");
            }

            let funct = InstructionHelper.getFuncSType(this.instrValue);
            let nbytes;

            switch (funct) {
                case InstructionConstants.FUNCT_SB: {
                    nbytes = 1;
                    break;
                }
                case InstructionConstants.FUNCT_SH: {
                    nbytes = 2;
                    break;
                }
                case InstructionConstants.FUNCT_SW: {
                    nbytes = 4;
                    break;
                }
                default: {
                    console.log("Error");
                }
            }

            let address = this._addressNode.value.asUnsignedInt();
            let wordIdx = Math.floor(address / 4);
            let byteIdx = address % 4;
            let writeValue = this._inputDataNode.value;

            this.nextValue[wordIdx] = this.values[wordIdx];
            this.nextValue[wordIdx + 1] = this.values[wordIdx + 1];

            for (let i = 0; i < nbytes; i++) {
                this.nextValue[wordIdx] = this.nextValue[wordIdx].writeByte(byteIdx, writeValue.getByteBinary(i));
                if (++byteIdx == 4) {
                    byteIdx = 0;
                    wordIdx++;
                }
            }

            this._writeEnNode.mark(this);
            this._addressNode.mark(this);
            this._inputDataNode.mark(this);
        }
    }

    set instrNode(node: CircuitNode) {
        this._instrNode = node;
        node.addNeighbour(this);
    }

    set writeEnNode(node: CircuitNode) {
        this._writeEnNode = node;
        node.addNeighbour(this);
    }

    set addressNode(node: CircuitNode) {
        this._addressNode = node;
        node.addNeighbour(this);
    }

    set inputDataNode(node: CircuitNode) {
        this._inputDataNode = node;
    }

    set outputDataNode(node: CircuitNode) {
        this._outputDataNode = node;
    }
}