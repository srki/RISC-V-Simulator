import {Simulator} from "./Simulator";

let canvas = <HTMLCanvasElement> document.getElementById("sim-canvas");
let sim = new Simulator(canvas);
sim.run();