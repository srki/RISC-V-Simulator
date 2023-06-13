import Assembler from "../instructions/Assembler";
import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-javascript'
import Value from "../util/Value";

export default class CodeCtrl {
    private static readonly CODE_STORAGE_KEY = "code"
    private btnBuild: HTMLButtonElement
    private btnClear: HTMLButtonElement
    private output: HTMLDivElement
    private outputContent: HTMLDivElement

    private loadFn: (values: Value[]) => void

    private editor: any;

    constructor(loadFn: (values: Value[]) => void) {
        this.loadFn = loadFn;

        this.btnBuild = <HTMLButtonElement>document.getElementById("btn-build")
        this.btnClear = <HTMLButtonElement>document.getElementById("btn-clear")
        this.output = <HTMLDivElement>document.getElementById("output")
        this.outputContent = <HTMLDivElement>document.getElementById("output-content")

        this.initEditor()
        this.addButtonListeners()
    }

    private initEditor() {
        this.editor = ace.edit("editor", {
            useWorker: false,
            useWrapMode: true,
            theme: "ace/theme/monokai",
            // mode: "ace/mode/javascript"
        });

        // this.editor.setTheme("ace/theme/monokai")
        // this.editor.session.setMode("ace/mode/javascript")

        const code = window.localStorage.getItem(CodeCtrl.CODE_STORAGE_KEY)
        this.editor.setValue(code, -1)

        this.editor.on('change', () => {
            window.localStorage.setItem(CodeCtrl.CODE_STORAGE_KEY, this.editor.getValue())
        })
    }

    private addButtonListeners() {
        this.btnBuild.addEventListener("click", () => {
            try {
                let parsed = Assembler.parse(this.editor.getValue())
                if (parsed) {
                    this.loadFn(parsed)
                    this.outputContent.innerHTML += "<div style='color: white'>" +new Date().toLocaleString() + "</div>"
                    this.outputContent.innerHTML += "<div class='success'>" + "Built successfully!" + "</div>"
                    this.outputContent.innerHTML += "<br/>"

                }
            } catch (e) {
                this.outputContent.innerHTML += "<div class='error'>" + e + "</div>"
            }
        })

        this.btnClear.addEventListener('click', () => {
            this.outputContent.innerHTML = ""
        })
    }
}