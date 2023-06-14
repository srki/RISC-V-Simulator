import Assembler from "../instructions/Assembler";
import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-assembly_x86'
import {fibAsm} from "../assets/fib-asm";
import {multAsm} from "../assets/mult-asm";
import {pyramidAsm} from "../assets/pyramid-asm";


export default class CodeCtrl {
    private static readonly CODE_STORAGE_KEY = "code"
    private btnFib: HTMLButtonElement
    private btnMult: HTMLButtonElement
    private btnPyramid: HTMLButtonElement
    private btnNew: HTMLButtonElement
    private btnClear: HTMLButtonElement
    private output: HTMLDivElement
    private outputContent: HTMLDivElement

    private editor: any;

    constructor() {
        this.btnFib = <HTMLButtonElement>document.getElementById("btn-load-fib")
        this.btnMult = <HTMLButtonElement>document.getElementById("btn-load-mult")
        this.btnPyramid = <HTMLButtonElement>document.getElementById("btn-load-pyramid")
        this.btnNew =  <HTMLButtonElement>document.getElementById("btn-load-new")
        this.btnClear = <HTMLButtonElement>document.getElementById("btn-clear")
        this.output = <HTMLDivElement>document.getElementById("output")
        this.outputContent = <HTMLDivElement>document.getElementById("output-content")

        this.initEditor()
        this.addButtonListeners()
    }

    getBuildFn() {
        return () => {
            try {
                let parsed = Assembler.parse(this.editor.getValue())
                if (parsed) {
                    this.outputContent.innerHTML += "<div style='color: white'>" + new Date().toLocaleString() + "</div>"
                    this.outputContent.innerHTML += "<div class='success'>" + "Built successfully!" + "</div>"
                    this.outputContent.innerHTML += "<br/>"
                    return parsed
                }
            } catch (e) {
                this.outputContent.innerHTML += "<div class='error'>" + e + "</div>"
            }
        }
    }

    private initEditor() {
        this.editor = ace.edit("editor", {
            useWorker: false,
            theme: "ace/theme/monokai",
            mode: "ace/mode/assembly_x86"
        });
        this.editor.session.setUseWrapMode(true);

        const code = window.localStorage.getItem(CodeCtrl.CODE_STORAGE_KEY)
        if (code) {
            this.editor.setValue(code, -1)
        } else {
            this.editor.setValue(fibAsm, -1)
        }

        this.editor.on('change', () => {
            window.localStorage.setItem(CodeCtrl.CODE_STORAGE_KEY, this.editor.getValue())
        })
    }

    private addButtonListeners() {
        this.btnFib.addEventListener('click', () => this.editor.setValue(fibAsm, -1))
        this.btnMult.addEventListener('click', () => this.editor.setValue(multAsm, -1))
        this.btnPyramid.addEventListener('click', () => this.editor.setValue(pyramidAsm, -1))
        this.btnNew.addEventListener('click', () => this.editor.setValue("", -1))

        this.btnClear.addEventListener('click', () => {
            this.outputContent.innerHTML = ""
        })
    }
}