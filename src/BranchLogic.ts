import Component from "./Component";
import Graphics from "./Graphics";
import Config from "./Config";
import CircuitNode from "./CircutNode";
import Val from "./Val";
import InstructionHelper from "./InstructionHelper";

export default class BranchLogic extends Component {
    public static readonly BRANCH_TRUE = new Val(0, 1);
    public static readonly BRANCH_FALSE = new Val(1, 1);

    private _data1Node: CircuitNode;
    private _data2Node: CircuitNode;
    private _instrNode: CircuitNode;
    private _outNode: CircuitNode;

    private instrValue: Val;
    private data1Value: Val;
    private data2Value: Val;

    constructor(x: number, y: number) {
        super(x, y);
    }

    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 100, 50, Config.elementFillColor, Config.elementStrokeColor);
        g.drawTextCentered(this.x, this.y + 23, 100, "Branch", Config.fontColor, Config.fontSize);
        g.drawTextCentered(this.x, this.y + 43, 100, "Logic", Config.fontColor, Config.fontSize);
    }


    forwardSignal(signaler: Component, value: Val): void {
        switch (signaler) {
            case this._data1Node:
                this.data1Value = value;
                break;
            case this._data2Node:
                this.data2Value = value;
                break;
            case this._instrNode:
                this.instrValue = value;
                break;
        }

        if (this.data1Value == undefined || this.data2Value == undefined || this.instrValue == undefined) {
            return;
        }

        let func = InstructionHelper.getFuncBType(this.instrValue);
        let result: boolean;

        switch (func) {
            case InstructionHelper.FUNCT_BEQ: {
                result = Val.cmpEQ(this.data1Value, this.data2Value);
                break;
            }
            case InstructionHelper.FUNCT_BNE: {
                result = Val.cmpNE(this.data1Value, this.data2Value);
                break;
            }
            case InstructionHelper.FUNCT_BLT: {
                result = Val.cmpLT(this.data1Value, this.data2Value);
                break;
            }
            case InstructionHelper.FUNCT_BGE: {
                result = Val.cmpGE(this.data1Value, this.data2Value);
                break;
            }
            case InstructionHelper.FUNCT_BLTU: {
                result = Val.cmpLTU(this.data1Value, this.data2Value);
                break;
            }
            case InstructionHelper.FUNCT_BGEU: {
                result = Val.cmpGEU(this.data1Value, this.data2Value);
                break;
            }
        }

        this._outNode.forwardSignal(this, result ? BranchLogic.BRANCH_TRUE : BranchLogic.BRANCH_FALSE);
    }


    mark(caller: Component): void {
        this._data1Node.mark(this);
        this._data2Node.mark(this);
        this._instrNode.mark(this);
    }

    set data1Node(node: CircuitNode) {
        this._data1Node = node;
        node.addNeighbour(this);
    }

    set data2Node(node: CircuitNode) {
        this._data2Node = node;
        node.addNeighbour(this);
    }

    set instrNode(node: CircuitNode) {
        this._instrNode = node;
        node.addNeighbour(this);
    }

    set outNode(value: CircuitNode) {
        this._outNode = value;
    }
}