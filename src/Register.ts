import {Component} from "./Component";
import {Graphics} from "./Graphics";
import {CircuitNode} from "./CircutNode";
import {Config} from "./Config";

enum RegisterOrientation {
    HORIZONTAL,
    VERTICAL
}

class Register extends Component {
    private readonly orientation: RegisterOrientation;

    private _inputNode: CircuitNode = null;
    private _outNode: CircuitNode = null;
    private _writeEnable: CircuitNode = null;

    private value: number = 0;

    constructor(x: number, y: number, orientation: RegisterOrientation = RegisterOrientation.HORIZONTAL) {
        super(x, y);

        this.orientation = orientation;
    }

    draw(g: Graphics): void {
        if (this.orientation == RegisterOrientation.HORIZONTAL) {
            g.fillRect(this.x, this.y, 150, 25, Config.elementFillColor, Config.elementStrokeColor);
            g.drawText(this.x + 10, this.y + 21, this.formatValue(), Config.fontColor, Config.fontSize);
        } else if (this.orientation == RegisterOrientation.VERTICAL) {
            // TODO: implement
        }
    }

    onRisingEdge(): void {
        if (this._writeEnable && this._writeEnable.value != 0) {
            this.value = this._inputNode.value;
        }
    }

    onFallingEdge(): void {
        this._outNode.forwardSignal(this, this.value);

    }

    set inputNode(value: CircuitNode) {
        this._inputNode = value;
    }

    set outNode(value: CircuitNode) {
        this._outNode = value;
    }


    set writeEnable(value: CircuitNode) {
        this._writeEnable = value;
    }

    private formatValue(): string {
        let formatted = this.value.toString(16);
        while (formatted.length < 8) {
            formatted = "0" + formatted;
        }

        return "0x" + formatted;
    }
}

export {Register, RegisterOrientation}