import Graphics from "./util/Graphics";
import ArithmeticLogicUnit from "./components/ArithmeticLogicUnit";
import Register from "./components/Register";
import CircuitNode from "./components/CircutNode";
import Config from "./util/Config";
import Component from "./components/Component";
import InstructionMemory from "./components/InstructionMemory";
import Multiplexer, {MultiplexerOrientation} from "./components/Multiplexer";
import ControlUnit from "./components/ControlUnit";
import ConstValue from "./components/ConstValue";
import RegisterFile from "./components/RegisterFile";
import ImmSelect from "./components/ImmSelect";
import ALUControl from "./components/ALUControl";
import DataMemory from "./components/DataMemory";
import Value from "./util/Value";
import BranchLogic from "./components/BranchLogic";

export default class Simulator {
    protected elements: Component[] = [];
    private readonly g: Graphics;
    private initialInstruct: Value[];

    constructor(canvas: HTMLCanvasElement, parsed: Value[]) {
        this.g = new Graphics(canvas, 1200, 800);
        this.load(parsed);
    }

    create() {
        let controlUnit = new ControlUnit(0, 0);

        let PCRegister = new Register(50, 50);
        let instrMemory = new InstructionMemory(10, 100, this.initialInstruct);
        let PCStepVal = new ConstValue(350, 135, Value.fromUnsignedInt(4));
        let PCAdder = new ArithmeticLogicUnit(405, 135, ArithmeticLogicUnit.ADD);
        let PCSelMux = new Multiplexer(410, 25, 4, MultiplexerOrientation.LEFT);

        this.elements.push(PCRegister, instrMemory, PCStepVal, PCSelMux, PCAdder, controlUnit);

        let WASel1 = new ConstValue(325, 520, Value.fromUnsignedInt(1));
        let WASelMux = new Multiplexer(360, 520, 2);
        let registerFile = new RegisterFile(425, 260);
        let immSelect = new ImmSelect(625, 550);
        let ALUCtrl = new ALUControl(740, 630);

        this.elements.push(WASel1, registerFile, WASelMux, immSelect, ALUCtrl);

        let op2SelMux = new Multiplexer(850, 500, 2);
        let ALU = new ArithmeticLogicUnit(895, 400);

        this.elements.push(op2SelMux, ALU);

        let dataMemory = new DataMemory(985, 200);
        let WBSelMux = new Multiplexer(1135, 600, 3);

        this.elements.push(dataMemory, WBSelMux);

        let branchAdder = new ArithmeticLogicUnit(800, 210, ArithmeticLogicUnit.ADD);
        let branchLogic = new BranchLogic(670, 275);

        this.elements.push(branchAdder, branchLogic);

        /* PC enable write */
        let node = new CircuitNode(70, 50, Value.fromUnsignedInt(1));
        PCRegister.writeEnable = node;
        this.elements.push(node); // Not required

        let path: CircuitNode[];

        /* PCSelMux ->  PC */
        path = this.createPath([[410, 72.5], [375, 72.5], [375, 40], [30, 40], [30, 62.5], [50, 62.5]]);
        PCSelMux.outNode = path[0];
        PCRegister.inputNode = path[path.length - 1];

        /* PC Step -> PC Adder */
        path = this.createPath([[375, 147.5], [405, 147.5]]);
        PCStepVal.outNode = path[0];
        PCAdder.input1Node = path[path.length - 1];

        /* PC Register -> PC Adder */
        path = this.createPath([[200, 62.5], [220, 62.5], [275, 62.5], [325, 62.5], [325, 197.5], [405, 197.5]]);
        PCRegister.outNode = path[0];
        PCAdder.input2Node = path[path.length - 1];

        let PCRegisterNode1 = path[1];
        let PCRegisterNode2 = path[2];

        /* PC Adder -> PCSelMux */
        path = this.createPath([[445, 172.5], [455, 172.5], [455, 95], [435, 95]]);
        PCAdder.resultNode = path[0];
        PCSelMux.setInputNode(3, path[path.length - 1]);

        /* PC Register -> Instruction memory */
        path = this.createPath([[220, 85], [125, 85], [125, 100]]);
        PCRegisterNode1.addNeighbour(path[0]);
        instrMemory.addressNode = path[path.length - 1];

        /* Instruction memory -> instrNode */
        path = this.createPath([[240, 425], [305, 425]]);
        instrMemory.outputDataNode = path[0];
        let instrNode = path[path.length - 1];

        /* Instr node for Control unit */
        controlUnit.instrNode = instrNode;

        /* WASel1 -> WASelMux */
        path = this.createPath([[350, 532.5], [360, 532.5]]);
        WASel1.outNode = path[1];
        WASelMux.setInputNode(0, path[path.length - 1]);

        /* WASelMux -> Register File */
        path = this.createPath([[385, 552.5], [425, 552.5]]);
        WASelMux.outNode = path[0];
        registerFile.inputWriteSelNode = path[path.length - 1];

        /* instrNode -> RF Write select */
        path = this.createPath([[305, 570], [360, 570]]);
        instrNode.addNeighbour(path[0]);
        let instrNodeBottom = path[0];
        WASelMux.setInputNode(1, path[path.length - 1]);

        /* instrNode -> ImmSelect */
        path = this.createPath([[305, 620], [600, 620], [600, 575], [625, 575]]);
        instrNodeBottom.addNeighbour(path[0]);
        instrNodeBottom = path[0];
        immSelect.instrNode = path[path.length - 1];

        /* instrNode -> ALU Control */
        path = this.createPath([[305, 655], [740, 655]]);
        instrNodeBottom.addNeighbour(path[0]);
        instrNodeBottom = path[0];
        ALUCtrl.instrNode = path[path.length - 1];

        /* instrNode -> DataMemory */
        path = this.createPath([[305, 690], [985, 690]]);
        instrNodeBottom.addNeighbour(path[0]);
        dataMemory.instrNode = path[path.length - 1];

        /* instrNode -> ReadSel2 */
        path = this.createPath([[305, 390], [425, 390]]);
        instrNode.addNeighbour(path[0]);
        let instrNodeTop = path[0];
        registerFile.readSel2Node = path[path.length - 1];

        /* instrNode -> ReadSel1 */
        path = this.createPath([[305, 370], [425, 370]]);
        instrNodeTop.addNeighbour(path[0]);
        instrNodeTop = path[0];
        registerFile.readSel1Node = path[path.length - 1];

        /* ImmSelect -> op2SelMux */
        path = this.createPath([[725, 575], [790, 575], [790, 550], [850, 550]]);
        immSelect.outNode = path[0];
        op2SelMux.setInputNode(1, path[path.length - 1]);

        let immSelectNode = path[2];

        /* RF ReadData2 -> op2SelMux */
        path = this.createPath([[575, 390], [670, 390], [670, 525], [745, 525], [830, 525], [850, 525]]);
        registerFile.readData2Node = path[0];
        op2SelMux.setInputNode(0, path[path.length - 1]);
        let readData2Node = path[path.length - 2];
        let readData2BranchNode = path[3];

        /* RF ReadData1 -> ALU */
        path = this.createPath([[575, 370], [695, 370], [885, 370], [885, 415], [895, 415]]);
        registerFile.readData1Node = path[0];
        ALU.input1Node = path[path.length - 1];

        let readData1BranchNode = path[1];

        /* op2SelMux -> ALU */
        path = this.createPath([[875, 532.5], [885, 532.5], [885, 460], [895, 460]]);
        op2SelMux.outNode = path[0];
        ALU.input2Node = path[path.length - 1];

        /* ALU Control -> ALU */
        path = this.createPath([[840, 655], [915, 655], [915, 467.5]]);
        ALUCtrl.outNode = path[0];
        ALU.selOpNode = path[path.length - 1];

        /* ALU -> WBSel Mux */
        path = this.createPath([[935, 437.5], [960, 437.5], [960, 710], [1110, 710], [1110, 655], [1135, 655]]);
        ALU.resultNode = path[0];
        WBSelMux.setInputNode(2, path[path.length - 1]);
        let ALUoutNode = path[1];

        /* ALU -> DataMemory */
        path = this.createPath([[960, 300], [985, 300]]);
        ALUoutNode.addNeighbour(path[0]);
        dataMemory.addressNode = path[path.length - 1];

        /* DataMemory - > WBSel Mux */
        path = this.createPath([[1085, 640], [1135, 640]]);
        dataMemory.outputDataNode = path[0];
        WBSelMux.setInputNode(1, path[path.length - 1]);

        /* WBSel Mux -> RF WriteData */
        path = this.createPath([[1160, 640], [1180, 640], [1180, 730], [405, 730], [405, 590], [425, 590]]);
        WBSelMux.outNode = path[0];
        registerFile.inputWriteDataNode = path[path.length - 1];

        /* RF ReadData2 -> DataMemory */
        path = this.createPath([[830, 610], [985, 610]]);
        readData2Node.addNeighbour(path[0]);
        dataMemory.inputDataNode = path[path.length - 1];

        /* PC -> branchAdder */
        path = this.createPath([[275, 222.5], [800, 222.5]]);
        PCRegisterNode2.addNeighbour(path[0]);
        branchAdder.input1Node = path[path.length - 1];

        /* ImmSelect -> branchAdder */
        path = this.createPath([[790, 272.5], [800, 272.5]]);
        immSelectNode.addNeighbour(path[0]);
        branchAdder.input2Node = path[path.length - 1];

        /* branchAdder -> PCSel */
        path = this.createPath([[840, 247.5], [850, 247.5], [850, 50], [435, 50]]);
        branchAdder.resultNode = path[0];
        PCSelMux.setInputNode(0, path[path.length - 1]);

        /* readData1 -> Branch Logic */
        node = new CircuitNode(695, 325);
        readData1BranchNode.addNeighbour(node);
        branchLogic.data1Node = node;
        this.elements.push(node);

        /* readData2 -> Branch Logic */
        node = new CircuitNode(745, 325);
        readData2BranchNode.addNeighbour(node);
        branchLogic.data2Node = node;
        this.elements.push(node);

        /* instrNode -> Branch Select */
        branchLogic.instrNode = instrNodeTop;

        /* Branch Logic -> Control Unit */
        node = new CircuitNode(770, 300);
        branchLogic.outNode = node;
        controlUnit.branchNode = node;
        this.elements.push(node);

        /*
         *Control signals
         */

        /* PCSel */
        path = this.createPath([[422.5, 10], [422.5, 32.5]]);
        controlUnit.PCSelNode = path[0];
        PCSelMux.selInputNode = path[path.length - 1];

        /* RegEnWrite */
        path = this.createPath([[550, 10], [550, 260]]);
        controlUnit.RegWriteEn = path[0];
        registerFile.inputWriteEnNode = path[path.length - 1];

        /* MemWrite */
        path = this.createPath([[1010, 10], [1010, 200]]);
        controlUnit.MemWrite = path[0];
        dataMemory.writeEnNode = path[path.length - 1];

        /* WBSel */
        path = this.createPath([[1147.5, 10], [1147.5, 607.5]]);
        controlUnit.WBSel = path[0];
        WBSelMux.selInputNode = path[path.length - 1];

        /* WASel */
        path = this.createPath([[372.5, 790], [372.5, 577.5]]);
        controlUnit.WASel = path[0];
        WASelMux.selInputNode = path[path.length - 1];

        /* ImmSel */
        path = this.createPath([[675, 790], [675, 600]]);
        controlUnit.ImmSel = path[0];
        immSelect.controlNode = path[path.length - 1];

        /* FuncSel */
        path = this.createPath([[790, 790], [790, 680]]);
        controlUnit.FuncSel = path[0];
        ALUCtrl.controlNode = path[path.length - 1];

        /* Op2Sel */
        path = this.createPath([[862.5, 790], [862.5, 557.5]]);
        controlUnit.Op2Sel = path[0];
        op2SelMux.selInputNode = path[path.length - 1];
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

    draw() {
        this.g.rescale();
        this.g.clear(Config.backgroundColor);
        // this.g.fillRect(0, 0, 1200, 800, "#00000000", "red");

        this.elements.forEach(el => el.draw(this.g))
    }

    step() {
        console.log("Step");
        this.elements.forEach(el => el.refresh());
        this.elements.forEach(el => el.onFallingEdge());
        this.elements.forEach(el => el.onRisingEdge());
        this.draw();
    }

    load(parsed: Value[]) {
        this.initialInstruct = parsed;
        this.reset();
    }

    reset() {
        this.elements = [];
        this.create();
        this.step();
    }
}

