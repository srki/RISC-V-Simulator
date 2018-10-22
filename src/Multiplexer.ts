import Component from "Component";
import Graphics from "Graphics";
import Config from "Config";
import CircuitNode from "CircutNode";
import Val from "Val";

export enum MultiplexerOrientation {
    LEFT,
    RIGHT
}

export default class Multiplexer extends Component {
    private readonly ninputs: number;
    private readonly orientation: MultiplexerOrientation;
    private readonly inputDistance: number;

    private readonly _inputNodes: CircuitNode[];
    private _selInputNode: CircuitNode;
    private _outNode: CircuitNode;

    private selValue: number = undefined;
    private inputValues: Val[] = [];

    constructor(x: number, y: number, ninputs: number,
                orientation: MultiplexerOrientation = MultiplexerOrientation.RIGHT, inputDistance: number = 15) {
        super(x, y);
        this.ninputs = ninputs;
        this.orientation = orientation;
        this.inputDistance = inputDistance;
        this._inputNodes = [];
    }

    draw(g: Graphics): void {
        let height = 50 + (this.ninputs - 1) * this.inputDistance;

        if (this.orientation == MultiplexerOrientation.RIGHT) {
            g.fillPolygon(Graphics.addOffset([[0, 0], [25, 15], [25, height - 15], [0, height]], this.x, this.y),
                Config.elementFillColor, Config.elementStrokeColor);
        } else {
            g.fillPolygon(Graphics.addOffset([[0, 15], [25, 0], [25, height], [0, height - 15]], this.x, this.y),
                Config.elementFillColor, Config.elementStrokeColor);
        }

        // if (this.orientation == MultiplexerOrientation.RIGHT) {
        //     for (let i = 0; i < this.ninputs; i++) {
        //         g.fillCircle(this.x, this.y + 25 + i * this.inputDistance, 2, "red");
        //     }
        //     g.fillCircle(this.x + 25, this.y + height / 2, 2, "red");
        // } else {
        //     for (let i = 0; i < this.ninputs; i++) {
        //         g.fillCircle(this.x + 25, this.y + 25 + i * this.inputDistance, 2, "red");
        //     }
        //     g.fillCircle(this.x, this.y + height / 2, 2, "red");
        // }
    }

    forwardSignal(signaler: Component, value: Val): void {
        if (signaler == this._selInputNode) {
            this.selValue = value.asUnsignedInt();
        } else {
            for (let i in this._inputNodes) {
                if (signaler == this._inputNodes[i]) {
                    this.inputValues[i] = value;
                    break;
                }
            }
        }

        if (this.selValue != undefined && this.inputValues[this.selValue]) {
            this._outNode.forwardSignal(this, this.inputValues[this.selValue]);
        }
    }

    reset(): void {
        this.selValue = undefined;
        this.inputValues = [];
    }

    setInputNodes(idx: number, node: CircuitNode) {
        this._inputNodes[idx] = node;
        node.addNeighbour(this);
    }

    set selInputNode(node: CircuitNode) {
        this._selInputNode = node;
        node.addNeighbour(this);
    }


    set outNode(node: CircuitNode) {
        this._outNode = node;
    }
}