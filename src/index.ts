import Split from "split.js";

import SimulatorCtrl from "./ctrl/simulator-ctrl";
import CodeCtrl from "./ctrl/code-ctrl";

let simCtrl = new SimulatorCtrl()
let codeCtrl = new CodeCtrl(simCtrl.getLoadFn())

let mainSplitPane = Split(["#code", "#simulator"], {
    sizes: [25, 75],
    minSize: [300, 300],
    onDrag: simCtrl.getResizeFn()
});

Split(["#editor", "#output"], {
    sizes: [60, 40],
    direction: "vertical"
});

simCtrl.getResizeFn()()



