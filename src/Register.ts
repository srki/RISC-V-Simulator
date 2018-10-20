import Component from "Component";
import Graphics from "Graphics";
import CircuitNode from "CircutNode";
import Config from "Config";
import Val, {ZERO_VAL_0, ZERO_VAL_32} from "./Val";

export enum RegisterOrientation {
    HORIZONTAL,
    VERTICAL
}

export default class Register extends Component {
    private readonly orientation: RegisterOrientation;

    private _inputNode: CircuitNode = null;
    private _outNode: CircuitNode = null;
    private _writeEnable: CircuitNode = null;

    private value: Val = ZERO_VAL_32;

    constructor(x: number, y: number, orientation: RegisterOrientation = RegisterOrientation.HORIZONTAL) {
        super(x, y);

        this.orientation = orientation;
    }

    draw(g: Graphics): void {
        if (this.orientation == RegisterOrientation.HORIZONTAL) {
            g.fillRect(this.x, this.y, 150, 25, Config.elementFillColor, Config.elementStrokeColor);
            g.drawText(this.x + 10, this.y + 21, this.value.asHexString(), Config.fontColor, Config.fontSize);
        } else if (this.orientation == RegisterOrientation.VERTICAL) {
            // TODO: implement
        }
    }

    onRisingEdge(): void {
        if (this._writeEnable && this._writeEnable.value.asUnsignedInt() != 0) {
            this.value = this._inputNode.value;
        }
    }

    onFallingEdge(): void {
        this._outNode.forwardSignal(this, this.value);
    }

    set inputNode(node: CircuitNode) {
        this._inputNode = node;
    }

    set outNode(node: CircuitNode) {
        this._outNode = node;
    }

    set writeEnable(node: CircuitNode) {
        this._writeEnable = node;
    }
}