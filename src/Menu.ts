import Simulator from "./Simulator";
import Assembler from "./instructions/Assembler";
import {toggleFullScreen} from "./util/util";

export default class Menu {
    private editor: any;
    private simulator: Simulator;

    private execute: boolean = false;

    private btnStep: HTMLButtonElement;
    private btnRun: HTMLButtonElement;
    private btnReset: HTMLButtonElement;
    private btnLoad: HTMLButtonElement;


    constructor(editor: any, simulator: Simulator) {
        this.editor = editor;
        this.simulator = simulator;

        this.btnStep = <HTMLButtonElement>document.getElementById("btn-step")
        this.btnRun = <HTMLButtonElement>document.getElementById("btn-run")
        this.btnReset = <HTMLButtonElement>document.getElementById("btn-reset")
        this.btnLoad = <HTMLButtonElement>document.getElementById("btn-load")

        this.addButtonListeners()
        this.addKeyboardListeners()

        setInterval(() => {
            if (this.execute) {
                simulator.step();
            }
        }, 100);
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

        this.btnLoad.addEventListener("click", evt => {
            try {
                let parsed = Assembler.parse(this.editor.getValue());
                if (parsed) this.simulator.load(parsed)
            } catch (e) {
                alert(e);
            }
        });
    }

    private addKeyboardListeners() {
        window.addEventListener("keydown", evt => {
            return
            switch (evt.key) {
                case "s":
                case "S": {
                    this.simulator.step();
                    break;
                }

                case "r":
                case "R": {
                    this.simulator.reset();
                    break;
                }

                case "f":
                case "F": {
                    toggleFullScreen();
                    break;
                }
                case "ArrowRight":
                    console.log("->")
            }
        });
    }

    private toggleExecution() {
        this.execute = !this.execute;
    }
}