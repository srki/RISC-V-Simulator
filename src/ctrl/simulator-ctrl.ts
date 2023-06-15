import Simulator from "../Simulator";
import Value from "../util/Value";

export default class SimulatorCtrl {
    private readonly canvas: HTMLCanvasElement
    private btnBuild: HTMLButtonElement
    private btnStep: HTMLButtonElement
    private btnRun: HTMLButtonElement
    private btnReset: HTMLButtonElement
    private simulatorPane: HTMLDivElement
    private simulatorMenuBar: HTMLDivElement
    private btnInc: HTMLButtonElement
    private btnDec: HTMLButtonElement
    private freqLabel: HTMLDivElement

    private simulator: Simulator

    private resizeFn: () => void
    private buildFn: () => Value[]

    private execute: boolean = false
    private freq: number = 16

    constructor(buildFn: () => Value[]) {
        this.buildFn = buildFn

        this.canvas = <HTMLCanvasElement>document.getElementById("sim-canvas")
        this.btnBuild = <HTMLButtonElement>document.getElementById("btn-build")
        this.btnStep = <HTMLButtonElement>document.getElementById("btn-step")
        this.btnRun = <HTMLButtonElement>document.getElementById("btn-run")
        this.btnReset = <HTMLButtonElement>document.getElementById("btn-reset")

        this.simulatorPane = <HTMLDivElement>document.getElementById("simulator");
        this.simulatorMenuBar = <HTMLDivElement>document.getElementById("simulator-menu");

        this.btnInc = <HTMLButtonElement>document.getElementById("btn-inc")
        this.btnDec = <HTMLButtonElement>document.getElementById("btn-dec")
        this.freqLabel = <HTMLDivElement>document.getElementById("freq-lbl")

        this.simulator = new Simulator(this.canvas, [])
        this.addButtonListeners()
        this.initCanvasResizeHandler()

        const run = () => {
            if (this.execute) {
                this.simulator.step();
            }

            setTimeout(run, 1000 / this.freq)
        }
        run()
        this.displayFreq()

        let values = this.buildFn()
        if (values) {
            this.simulator.load(values);
        }
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
        this.btnBuild.addEventListener("click", () => {
            let values = this.buildFn()
            if (values) {
                this.simulator.load(values);
            }
            if (this.execute) {
                this.btnRun.click();
            }
        });

        this.btnStep.addEventListener("click", () => {
            this.simulator.step()
            if (this.execute) {
                this.btnRun.click();
            }
        });

        this.btnRun.addEventListener("click", () => {
            this.toggleExecution()
        });

        this.btnReset.addEventListener("click", () => {
            this.simulator.reset()
            if (this.execute) {
                this.btnRun.click();
            }
        });

        this.btnInc.addEventListener("click", () => {
            this.freq *= 2
            if (this.freq > 1024) {
                this.freq = 1204
            }
            this.displayFreq()
        })

        this.btnDec.addEventListener("click", () => {
            this.freq /= 2
            if (this.freq < 1) {
                this.freq = 1
            }
            this.displayFreq()
        })
    }

    private toggleExecution() {
        this.execute = !this.execute;
    }

    private displayFreq() {
        this.freqLabel.innerHTML = this.freq + " Hz";
    }
}