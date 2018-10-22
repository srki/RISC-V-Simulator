import Component from "Component";
import Graphics from "Graphics";
import CircuitNode from "CircutNode";
import Config from "Config";
import Val, {VAL_ZERO_0b, VAL_ZERO_32b, VAL_ZERO_5b} from "Val";

export default class ArithmeticLogicUnit extends Component {
    /* @formatter:off */
    public static readonly ADD  = new Val(0, 4); /* Addition               */
    public static readonly SUB  = new Val(1, 4); /* Subtraction            */
    public static readonly AND  = new Val(2, 4); /* Bitwise AND            */
    public static readonly OR   = new Val(3, 4); /* Bitwise OR             */
    public static readonly XOR  = new Val(4, 4); /* Bitwise XOR            */
    public static readonly SLL  = new Val(5, 4); /* Shift Left Logical     */
    public static readonly SRL  = new Val(6, 4); /* Shift Right Logical    */
    public static readonly SRA  = new Val(7, 4); /* Shift Right Arithmetic */
    public static readonly SLT  = new Val(8, 4); /* Shift Right Arithmetic */
    public static readonly SLTU = new Val(9, 4); /* Shift Right Arithmetic */

    /* @formatter:on */

    private readonly defaultOp: Val;

    private _resultNode: CircuitNode = null;
    private _input1Node: CircuitNode = null;
    private _input2Node: CircuitNode = null;
    private _selOpNode: CircuitNode = null;

    private input1Value: Val = VAL_ZERO_32b;
    private input2Value: Val = VAL_ZERO_0b;
    private selOpValue: Val = VAL_ZERO_5b;

    constructor(x: number, y: number, defaultOp: Val = undefined) {
        super(x, y);
        this.defaultOp = defaultOp;
        this.refresh();
    }

    draw(g: Graphics): void {
        g.fillPolygon(Graphics.addOffset([[0, 0], [40, 15], [40, 60], [0, 75], [0, 45], [10, 37.5], [0, 30]],
            this.x, this.y), Config.elementFillColor, Config.elementStrokeColor);
    }

    refresh(): void {
        this.input1Value = undefined;
        this.input2Value = undefined;
        this.selOpValue = this.defaultOp;
    }

    forwardSignal(signaler: Component, value: Val): void {
        switch (signaler) {
            case this._input1Node:
                this.input1Value = value;
                break;

            case this._input2Node:
                this.input2Value = value;
                break;

            case this._selOpNode:
                this.selOpValue = value;
                break;
        }

        if (this.input1Value == undefined || this.input2Value == undefined || this.selOpValue == undefined) {
            return;
        }

        let result: Val;
        switch (this.selOpValue) {
            case ArithmeticLogicUnit.ADD: {
                result = Val.add(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.SUB: {
                result = Val.sub(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.AND: {
                result = Val.and(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.OR: {
                result = Val.or(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.XOR: {
                result = Val.xor(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.SLL: {
                result = Val.shiftLeftLogical(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.SRL: {
                result = Val.shiftRightLogical(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.SRA: {
                result = Val.shiftRightArithmetic(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.SLT: {
                // TODO: implement
                break;
            }
            case ArithmeticLogicUnit.SLTU: {
                // TODO: implement
                break;
            }
            default: {
                console.error("Unknown operation");
                result = VAL_ZERO_32b;
            }
        }

        this._resultNode.forwardSignal(this, result);
    }

    mark(caller: Component): void {
        this._input1Node.mark(this);
        this._input2Node.mark(this);

        if (this.defaultOp == null) {
            this._selOpNode.mark(this);
        }
    }

    set resultNode(node: CircuitNode) {
        this._resultNode = node;
    }

    set input1Node(node: CircuitNode) {
        this._input1Node = node;
        node.addNeighbour(this);
    }

    set input2Node(node: CircuitNode) {
        this._input2Node = node;
        node.addNeighbour(this);
    }

    set selOpNode(node: CircuitNode) {
        this._selOpNode = node;
        node.addNeighbour(this);
    }
}
