import Simulator from "Simulator";
import Val from "./Val";

let canvas = <HTMLCanvasElement> document.getElementById("sim-canvas");
let sim = new Simulator(canvas);
sim.draw();

let btnStep = <HTMLButtonElement> document.getElementById("btn-step");
btnStep.addEventListener("click", evt => sim.step());

let play = false;

let btnPlay = <HTMLButtonElement> document.getElementById("btn-play");
btnPlay.addEventListener("click", evt => play=!play);

let btnLoad = <HTMLButtonElement> document.getElementById("btn-load");
btnLoad.addEventListener("click", evt => sim.load());

let btnReset = <HTMLButtonElement> document.getElementById("btn-reset");
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

