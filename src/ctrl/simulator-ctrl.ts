import Simulator from "../Simulator";
import Assembler from "../instructions/Assembler";
import Value from "../util/Value";

export default class SimulatorCtrl {
    private readonly canvas: HTMLCanvasElement
    private btnStep: HTMLButtonElement
    private btnRun: HTMLButtonElement
    private btnReset: HTMLButtonElement
    private simulatorPane: HTMLDivElement
    private simulatorMenuBar: HTMLDivElement

    private simulator: Simulator
    private editor: any

    private resizeFn: () => void

    private execute: boolean = false

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("sim-canvas")
        this.btnStep = <HTMLButtonElement>document.getElementById("btn-step")
        this.btnRun = <HTMLButtonElement>document.getElementById("btn-run")
        this.btnReset = <HTMLButtonElement>document.getElementById("btn-reset")

        this.simulatorPane = <HTMLDivElement> document.getElementById("simulator");
        this.simulatorMenuBar = <HTMLDivElement> document.getElementById("simulator-menu");

        this.simulator = new Simulator(this.canvas, [])
        this.addButtonListeners()
        this.initCanvasResizeHandler()

        setInterval(() => {
            if (this.execute) {
                this.simulator.step();
            }
        }, 100);
    }

    getLoadFn() {
        return (values: Value[]) => this.simulator.load(values)
    }

    getResizeFn() {
        return this.resizeFn
    }

    private initCanvasResizeHandler() {
        this.resizeFn = () => {
            this.canvas.style.width = this.simulatorPane.clientWidth + "px";
            this.canvas.style.height = (this.simulatorPane.clientHeight - this.simulatorMenuBar.clientHeight) + "px";
            this.simulator.draw();
        };

        window.addEventListener("resize", () => this.resizeFn());
    }

    private addButtonListeners() {
        this.btnStep.addEventListener("click", evt => {
            this.simulator.step()
            if (this.execute) {
                this.btnRun.click();
            }
        });

        this.btnRun.addEventListener("click", evt => {
            this.toggleExecution()
        });

        this.btnReset.addEventListener("click", evt => {
            this.simulator.reset()
            if (this.execute) {
                this.btnRun.click();
            }
        });
    }

    private toggleExecution() {
        this.execute = !this.execute;
    }
}