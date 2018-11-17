import Component from "./Component";
import Graphics from "../util/Graphics";
import CircuitNode from "./CircutNode";
import Config from "../util/Config";
import Value, {VAL_ZERO_1b, VAL_ZERO_32b, VAL_ZERO_5b} from "../util/Value";

export default class ArithmeticLogicUnit extends Component {
    /* @formatter:off */
    public static readonly ADD  = new Value("0", 4); /* Addition               */
    public static readonly SUB  = new Value("1", 4); /* Subtraction            */
    public static readonly AND  = new Value("2", 4); /* Bitwise AND            */
    public static readonly OR   = new Value("3", 4); /* Bitwise OR             */
    public static readonly XOR  = new Value("4", 4); /* Bitwise XOR            */
    public static readonly SLL  = new Value("5", 4); /* Shift Left Logical     */
    public static readonly SRL  = new Value("6", 4); /* Shift Right Logical    */
    public static readonly SRA  = new Value("7", 4); /* Shift Right Arithmetic */
    public static readonly SLT  = new Value("8", 4); /* Shift Right Arithmetic */
    public static readonly SLTU = new Value("9", 4); /* Shift Right Arithmetic */

    /* @formatter:on */

    private readonly defaultOp: Value;

    private _resultNode: CircuitNode = null;
    private _input1Node: CircuitNode = null;
    private _input2Node: CircuitNode = null;
    private _selOpNode: CircuitNode = null;

    private input1Value: Value = VAL_ZERO_32b;
    private input2Value: Value = VAL_ZERO_1b;
    private selOpValue: Value = VAL_ZERO_5b;

    constructor(x: number, y: number, defaultOp: Value = undefined) {
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

    forwardSignal(signaler: Component, value: Value): void {
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

        let result: Value;
        switch (this.selOpValue) {
            case ArithmeticLogicUnit.ADD: {
                result = Value.add(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.SUB: {
                result = Value.sub(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.AND: {
                result = Value.and(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.OR: {
                result = Value.or(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.XOR: {
                result = Value.xor(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.SLL: {
                result = Value.shiftLeftLogical(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.SRL: {
                result = Value.shiftRightLogical(this.input1Value, this.input2Value);
                break;
            }
            case ArithmeticLogicUnit.SRA: {
                result = Value.shiftRightArithmetic(this.input1Value, this.input2Value);
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
