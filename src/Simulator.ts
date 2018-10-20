import {Graphics} from "./Graphics";
import {ArithmeticLogicUnit} from "./ArithmeticLogicUnit";
import {Register} from "./Register";
import {CircuitNode} from "./CircutNode";
import {Config} from "./Config";
import {Component} from "./Component";
import {InstructionMemory} from "./InstructionMemory";
import {Multiplexer, MultiplexerOrientation} from "./Multiplexer";
import {ControlUnit} from "./ControlUnit";
import {ConstValue} from "./ConstValue";

class Simulator {
    protected elements: Component[] = [];
    g: Graphics;

    constructor(canvas: HTMLCanvasElement) {
        this.g = new Graphics(canvas, 1000, 800);

        this.create();

        this.elements.forEach(el => el.onFallingEdge());
    }

    create() {
        let PCRegister = new Register(35, 230);
        let instrMemory = new InstructionMemory(60, 285);
        let PCStep = new ConstValue(150, 135, 4);
        let PCAdder = new ArithmeticLogicUnit(205, 135);
        let branchMux = new Multiplexer(210, 25 ,4, MultiplexerOrientation.LEFT);
        let controlUnit = new ControlUnit(255, 450);

        this.elements.push(PCRegister, instrMemory, PCStep, branchMux, PCAdder, controlUnit);

        /* PC enable write */
        let node = new CircuitNode(65, 230, 1);
        PCRegister.writeEnable = node;
        this.elements.push(node); // Not required

        let path: CircuitNode[];

        /* Branch Mux ->  PC */
        path = this.createPath([[210, 72.5], [25, 72.5], [25, 242.5], [35, 242.5]]);
        branchMux.outNode = path[0];
        PCRegister.inputNode = path[path.length - 1];

        /* PC Step -> PC Adder */
        path = this.createPath([[175, 147.5], [205, 147.5]]);
        PCStep.outNode = path[0];
        PCAdder.input1Node = path[path.length - 1];

        /* PC Register -> PC Adder */
        path = this.createPath([[185, 242.5], [195, 242.5], [195, 197.5], [205, 197.5]]);
        PCRegister.outNode = path[0];
        PCAdder.input2Node = path[path.length - 1];

        let PCRegisterNode = path[1];

        /* PC Adder -> Branch Mux */
        path = this.createPath([[245, 172.5], [255, 172.5], [255, 95], [235, 95]]);
        PCAdder.outputNode = path[0];
        branchMux.setInputNodes(3, path[path.length - 1]);

        /* PC Register -> Instruction memory */
        path = this.createPath([[195, 242.5], [195, 275], [110, 275], [110, 285]]);
        PCRegisterNode.addNeighbour(path[0]);
        instrMemory.inputAddrNode = path[path.length - 1];

        /* Instruction memory -> instrNode */
        path = this.createPath([[160, 412.5], [340, 412.5]]);
        instrMemory.outputInstrNode = path[0];

        let instrNode = path[path.length - 1];

        /* instrNode -> Control unit */
        path = this.createPath([[340, 412.5], [340, 450]]);
        instrNode.addNeighbour(path[0]);
        controlUnit.inputNode = path[path.length - 1];




        /* Control signals */
        //path = this.createPath([[222.5, 10], [222.5, 32.5]]);
        node = new CircuitNode(222.5, 32.5, 3);
        branchMux.selInputNode = node;

    }

    draw() {
        this.g.rescale();
        this.g.clear(Config.backgroundColor);

        this.elements.forEach(el => el.draw(this.g))
    }

    step() {
        this.elements.forEach(el => el.onRisingEdge());
        this.elements.forEach(el => el.onFallingEdge());
        this.draw();
    }

    private createPath(path: number[][]): CircuitNode[] {
        let pathNodes: CircuitNode[] = [];

        pathNodes.push(new CircuitNode(path[0][0], path[0][1]));
        let last = pathNodes[0];

        for (let i = 1; i < path.length; i++) {
            let node = new CircuitNode(path[i][0], path[i][1]);
            last.addNeighbour(node);
            pathNodes.push(node);
            last = node;
        }

        pathNodes.forEach(el => this.elements.push(el));

        return pathNodes;
    }
}


export {Simulator}