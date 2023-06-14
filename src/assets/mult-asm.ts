export let multAsm =
    "; calculate x3 = x1 * x1\n" +
    "ADDI x1, x0, 128\n" +
    "ADDI x2, x0, 99\n" +
    "ADDI x3, x0, 0\n" +
    "\n" +
    "loop:\n" +
    "ANDI x4, x1, 1 ; should add flag\n" +
    "SRAI x1, x1, 1\n" +
    "BEQ x4, x0, skip\n" +
    "ADD x3, x3, x2\n" +
    "skip:\n" +
    "\n" +
    "SLLI x2, x2, 1\n" +
    "BNE x1, x0, loop\n" +
    "\n" +
    "; infinite loop\n" +
    "BEQ x0, x0, 0"