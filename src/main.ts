import Simulator from "./Simulator";
import Parser from "./util/Parser";
import {toggleFullScreen} from "./util/util";
import Value from "./util/Value";

let canvas = <HTMLCanvasElement> document.getElementById("sim-canvas");
let menuBar = <HTMLDivElement> document.getElementById("menu");
let btnStep = <HTMLButtonElement> document.getElementById("btn-step");
let btnPlay = <HTMLButtonElement> document.getElementById("btn-play");
let btnPause = <HTMLButtonElement> document.getElementById("btn-pause");
let txtCode = <HTMLTextAreaElement> document.getElementById("txt-code");
let btnLoad = <HTMLButtonElement> document.getElementById("btn-load");
let btnReset = <HTMLButtonElement> document.getElementById("btn-reset");
let sim = new Simulator(canvas, Parser.parse(""));
let play = false;

let resize = () => {
    canvas.style.width = document.body.clientWidth + "px";
    canvas.style.height = (document.body.clientHeight - menuBar.clientHeight) + "px";
    sim.draw();
};

resize();

window.addEventListener("resize", () => resize());

Value.main();

window.addEventListener("keydown", evt => {
    switch (evt.key) {
        case "s":
        case "S": {
            sim.step();
            break;
        }

        case "r":
        case "R": {
            sim.reset();
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

btnStep.addEventListener("click", evt => {
    sim.step();
    btnPause.click()
});

btnPlay.addEventListener("click", evt => {
    play = true;
    btnPlay.disabled = true;
    btnPause.disabled = false
});

btnPause.addEventListener("click", evt => {
    play = false;
    btnPlay.disabled = false;
    btnPause.disabled = true
});

btnLoad.addEventListener("click", evt => {
    let parsed = Parser.parse(txtCode.textContent);
    if (parsed) sim.load(parsed)
});

btnReset.addEventListener("click", evt => sim.reset());

setInterval(() => {
    if (play) {
        sim.step();
    }

}, 100);
