import {Graphics} from "./Graphics";
import {ArithmeticLogicUnit} from "./ArithmeticLogicUnit";
import {Register, RegisterOrientation} from "./Register";
import {CircuitNode} from "./CircutNode";
import {Config} from "./Config";
import {ConstValue} from "./ConstValue";
import {Component} from "./Component";

class Simulator {
    protected elements: Component[] = [];
    g: Graphics;

    constructor(canvas: HTMLCanvasElement) {
        this.g = new Graphics(canvas, 1000, 500);

        this.create();
    }

    create() {
        let path: CircuitNode[];
        let node: CircuitNode;

        let PCRegister = new Register(30, 200, RegisterOrientation.HORIZONTAL);
        let PCAdder = new ArithmeticLogicUnit(150, 100);
        let PCIncValue = new ConstValue(100, 100, 4);
        this.elements.push(PCAdder, PCRegister, PCIncValue);


        path = this.createPath([[125, 112.5], [150, 112.5]]);
        PCIncValue.outNode = path[0];
        PCAdder.input1Node = path[1];

        path = this.createPath([[180, 137.5], [200, 137.5], [200, 212.5], [180, 212.5]]);
        PCAdder.outputNode = path[0];
        PCRegister.inputNode = path[path.length - 1];

        node = new CircuitNode(105, 225, 1);
        PCRegister.writeEnable = node;

        path = this.createPath([[30, 212.5], [25, 212.5], [25, 162.5], [150, 162.5]]);
        PCRegister.outNode = path[0];
        PCAdder.input2Node = path[path.length - 1];
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