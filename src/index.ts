import Split from "split.js";

import SimulatorCtrl from "./ctrl/simulator-ctrl";
import CodeCtrl from "./ctrl/code-ctrl";

let codeCtrl = new CodeCtrl()
let simCtrl = new SimulatorCtrl(codeCtrl.getBuildFn())

Split(["#code", "#simulator"], {
    sizes: [25, 75],
    minSize: [300, 300],
    onDrag: simCtrl.getResizeFn()
});

Split(["#editor-container", "#output"], {
    sizes: [60, 40],
    direction: "vertical"
});

simCtrl.getResizeFn()()



