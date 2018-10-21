import Graphics from "Graphics";
import ArithmeticLogicUnit from "ArithmeticLogicUnit";
import Register from "Register";
import CircuitNode from "CircutNode";
import Config from "Config";
import Component from "Component";
import InstructionMemory from "InstructionMemory";
import Multiplexer, {MultiplexerOrientation} from "Multiplexer";
import ControlUnit from "ControlUnit";
import ConstValue from "ConstValue";
import RegisterFile from "RegisterFile";
import ImmSelect from "ImmSelect";
import ALUControl from "ALUControl";
import DataMemory from "./DataMemory";
import Val from "./Val";

export default class Simulator {
    protected elements: Component[] = [];
    g: Graphics;

    constructor(canvas: HTMLCanvasElement) {
        this.g = new Graphics(canvas, 1200, 800);

        this.create();

        this.elements.forEach(el => el.onFallingEdge());
    }

    create() {
        let PCRegister = new Register(35, 230);
        let instrMemory = new InstructionMemory(60, 285);
        let PCStep = new ConstValue(150, 135, Val.UnsignedInt(4));
        let PCAdder = new ArithmeticLogicUnit(205, 135);
        let PCSelMux = new Multiplexer(210, 25, 4, MultiplexerOrientation.LEFT);
        let controlUnit = new ControlUnit(250, 450);

        this.elements.push(PCRegister, instrMemory, PCStep, PCSelMux, PCAdder, controlUnit);

        let WASel1 = new ConstValue(450, 520, Val.UnsignedInt(1));
        let WASelMux = new Multiplexer(485, 520, 2);
        let registerFile = new RegisterFile(520, 350);
        let immSel = new ImmSelect(640, 550);
        let ALUCtrl = new ALUControl(710, 630);

        this.elements.push(WASel1, registerFile, WASelMux, immSel, ALUCtrl);

        let op2SelMux = new Multiplexer(820, 500, 2);
        let ALU = new ArithmeticLogicUnit(865, 400);

        this.elements.push(op2SelMux, ALU);

        let dataMemory = new DataMemory(955,200);
        let WBSelMux = new Multiplexer(1105, 600, 3);

        this.elements.push(dataMemory, WBSelMux);

        /* PC enable write */
        let node = new CircuitNode(65, 230, Val.UnsignedInt(1));
        PCRegister.writeEnable = node;
        this.elements.push(node); // Not required

        let path: CircuitNode[];

        /* PCSelMux ->  PC */
        path = this.createPath([[210, 72.5], [25, 72.5], [25, 242.5], [35, 242.5]]);
        PCSelMux.outNode = path[0];
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

        /* PC Adder -> PCSelMux */
        path = this.createPath([[245, 172.5], [255, 172.5], [255, 95], [235, 95]]);
        PCAdder.outputNode = path[0];
        PCSelMux.setInputNodes(3, path[path.length - 1]);

        /* PC Register -> Instruction memory */
        path = this.createPath([[195, 242.5], [195, 275], [110, 275], [110, 285]]);
        PCRegisterNode.addNeighbour(path[0]);
        instrMemory.addressNode = path[path.length - 1];

        /* Instruction memory -> instrNode */
        path = this.createPath([[160, 412.5], [335, 412.5]]);
        instrMemory.outputDataNode = path[0];

        let instrNode = path[path.length - 1];

        /* instrNode -> Control unit */
        path = this.createPath([[335, 412.5], [335, 450]]);
        instrNode.addNeighbour(path[0]);
        controlUnit.inputNode = path[path.length - 1];

        /* Extend instruction wire */
        node = new CircuitNode(430, 412.5);
        this.elements.push(node);
        instrNode.addNeighbour(node);
        instrNode = node;

        /* WASel1 -> WASelMux */
        path = this.createPath([[475, 532.5], [485, 532.5]]);
        WASel1.outNode = path[1];
        WASelMux.setInputNodes(0, path[path.length - 1]);

        /* WASelMux -> Register File */
        path = this.createPath([[510, 552.5], [520, 552.5]]);
        WASelMux.outNode = path[0];
        registerFile.inputWriteSelNode = path[path.length - 1];

        /* instrNode -> RF Write select */
        path = this.createPath([[430, 570], [485, 570]]);
        instrNode.addNeighbour(path[0]);
        let instrNodeBottom = path[0];
        WASelMux.setInputNodes(1, path[path.length - 1]);

        /* instrNode -> ImmSelect */
        path = this.createPath([[430, 620], [630, 620], [630, 575], [640, 575]]);
        instrNodeBottom.addNeighbour(path[0]);
        instrNodeBottom = path[0];
        immSel.inputInstrNode = path[path.length - 1];

        /* instrNode -> ALU Control */
        path = this.createPath([[430, 655], [710, 655]]);
        instrNodeBottom.addNeighbour(path[0]);
        instrNodeBottom = path[0];
        immSel.inputInstrNode = path[path.length - 1];

        /* instrNode -> ReadSel2 */
        path = this.createPath([[430, 390], [520, 390]]);
        instrNode.addNeighbour(path[0]);
        let instrNodeTop = path[0];
        registerFile.inputReadSel2Node = path[path.length - 1];

        /* instrNode -> ReadSel1 */
        path = this.createPath([[430, 370], [520, 370]]);
        instrNodeTop.addNeighbour(path[0]);
        instrNodeTop = path[0];
        registerFile.inputReadSel1Node = path[path.length - 1];

        /* ImmSelect -> op2SelMux */
        path = this.createPath([[740, 575], [760, 575], [760, 550], [820, 550]]);
        immSel.outNode = path[0];
        op2SelMux.setInputNodes(1, path[path.length - 1]);

        /* RF ReadData2 -> op2SelMux */
        path = this.createPath([[620, 390], [640, 390], [640, 525], [800, 525], [820, 525]]);
        registerFile.outputReadData2Node = path[0];
        op2SelMux.setInputNodes(0, path[path.length - 1]);
        let readData2Node = path[path.length - 2];

        /* RF ReadData1 -> ALU */
        path = this.createPath([[620, 370], [855, 370], [855, 415], [865, 415]]);
        registerFile.outputReadData1Node = path[0];
        ALU.input1Node = path[path.length - 1];

        /* op2SelMux -> ALU */
        path = this.createPath([[845, 532.5], [855, 532.5], [855, 460], [865, 460]]);
        op2SelMux.outNode = path[0];
        ALU.input2Node = path[path.length - 1];

        /* ALU Control -> ALU */
        path = this.createPath([[810, 655], [885, 655], [885, 467.5]]);
        ALUCtrl.outNode = path[0];
        ALU.opInput = path[path.length - 1];

        /* ALU -> WBSel Mux */
        path = this.createPath([[905, 437.5], [930, 437.5], [930, 710], [1080, 710], [1080, 655], [1105, 655]]);
        ALU.outputNode = path[0];
        WBSelMux.setInputNodes(2, path[path.length - 1]);

        /* WBSel Mux -> RF WriteData */
        path = this.createPath([[1130, 640], [1150, 640], [1150, 750], [500, 750], [500, 590], [520, 590]]);
        WBSelMux.outNode = path[0];
        registerFile.inputWriteNode = path[path.length - 1];

        /* RF ReadData2 -> DataMemory */
        path = this.createPath([[800, 610], [955, 610]]);
        readData2Node.addNeighbour(path[0]);

        /* Control signals */
        //path = this.createPath([[222.5, 10], [222.5, 32.5]]);
        /* PCSel */
        node = new CircuitNode(222.5, 32.5, Val.UnsignedInt(3));
        PCSelMux.selInputNode = node;

        /* WASel */
        node = new CircuitNode(497.5, 300, Val.UnsignedInt(1));
        WASelMux.selInputNode = node;


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