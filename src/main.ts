import Simulator from "Simulator";
import Val from "./Val";
import Parser from "./Parser";

let canvas = <HTMLCanvasElement> document.getElementById("sim-canvas");
let btnStep = <HTMLButtonElement> document.getElementById("btn-step");
let btnPlay = <HTMLButtonElement> document.getElementById("btn-play");
let btnPause = <HTMLButtonElement> document.getElementById("btn-pause");
let txtCode = <HTMLTextAreaElement> document.getElementById("txt-code");
let btnLoad = <HTMLButtonElement> document.getElementById("btn-load");
let btnReset = <HTMLButtonElement> document.getElementById("btn-reset");
let sim = new Simulator(canvas, Parser.parse(txtCode.textContent));
let play = false;

sim.draw();

btnStep.addEventListener("click", evt => {sim.step(); btnPause.click() });
btnPlay.addEventListener("click", evt => {play=true; btnPlay.disabled = true; btnPause.disabled = false});
btnPause.addEventListener("click", evt => {play=false; btnPlay.disabled = false; btnPause.disabled = true});
btnLoad.addEventListener("click", evt => {let parsed = Parser.parse(txtCode.textContent); if(parsed) sim.load(parsed)});
btnReset.addEventListener("click", evt => sim.reset());

setInterval(() => {
    if(play) {
        sim.step();
    }

}, 1000);
    // if (canvas.width < 2000) {
    //     canvas.width += 10;
    // } else if (canvas.height < 1000) {
    //     canvas.height += 5;
    // } else  {
    //     canvas.width = 500;
    //     canvas.height = 250;
    // }
    //
    // sim.draw();
// }, 100);

