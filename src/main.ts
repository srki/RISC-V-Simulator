import Split from "split.js";
import * as ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-javascript'
import Simulator from "./Simulator";
import Parser from "./util/Parser";
import {toggleFullScreen} from "./util/util";
import Assembler from "./instructions/Assembler";
import Menu from "./Menu";

let canvas = <HTMLCanvasElement> document.getElementById("sim-canvas");
let codePane;
let simulatorPane = <HTMLDivElement> document.getElementById("simulator");

let menuBar = <HTMLDivElement> document.getElementById("menu");
let simulatorMenuBar = <HTMLDivElement> document.getElementById("simulator-menu");
let sim = new Simulator(canvas, Parser.parse(""));

let resize = () => {
    canvas.style.width = simulatorPane.clientWidth + "px";
    canvas.style.height = (simulatorPane.clientHeight - simulatorMenuBar.clientHeight) + "px";
    sim.draw();
};

window.addEventListener("resize", () => resize());

Split(["#code", "#simulator"], {
    sizes: [25, 75],
    minSize: [200, 300],
    onDrag: () => resize()
});
resize();

Split(["#editor", "#output"], {
    sizes: [75, 25],
    direction: "vertical"
});

let editor = ace.edit("editor", {
    useWorker: false
});
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

let menu = new Menu(editor, sim)



