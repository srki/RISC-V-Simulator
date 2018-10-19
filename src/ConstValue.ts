import {Component} from "./Component";
import {Graphics} from "./Graphics";
import {CircuitNode} from "./CircutNode";
import {Config} from "./Config";

class ConstValue extends Component {
    readonly value: number;
    private _outNode: CircuitNode;

    constructor(x: number, y: number, value: number) {
        super(x, y);
        this.value = value;
    }

    draw(g: Graphics): void {
        g.fillPolygon(Graphics.addOffset([[0, 0], [0, 25], [25, 25], [25, 0]], this.x, this.y),
            Config.elementFillColor, Config.elementStrokeColor);
        g.drawText(this.x + 5, this.y + 20, this.value.toString(), Config.fontColor, Config.fontSize);
    }

    onFallingEdge(): void {
        this._outNode.forwardSignal(this, this.value);

    }

    set outNode(value: CircuitNode) {
        this._outNode = value;
    }
}

export {ConstValue}