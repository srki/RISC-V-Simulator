import {Simulator} from "./Simulator";

let canvas = <HTMLCanvasElement> document.getElementById("sim-canvas");
let sim = new Simulator(canvas);
sim.draw();

let btnStep = <HTMLButtonElement> document.getElementById("btn-step");
btnStep.addEventListener("click", evt => sim.step());

// setInterval(() => {
//     /*if (canvas.width < 1000) {
//         canvas.width += 10;
//     } else if (canvas.height < 500) {
//         canvas.height += 5;
//     } else  {
//         canvas.width = 500;
//         canvas.height = 250;
//     }*/
//
//     sim.step();
// }, 1000);