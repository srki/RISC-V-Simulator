export const pyramidAsm =
    "ADDI x1, x0, 5     ; size\n" +
    "\n" +
    "; outer loop init\n" +
    "ADDI x2, x0, 0      ; lower bound\n" +
    "ADD x3, x0, x1      ; upper bound\n" +
    "ADDI x4, x0, 0      ; direction\n" +
    "\n" +
    "; outer lopp condition\n" +
    "loop1:\n" +
    "BGE x2, x3, loop1exit\n" +
    "\n" +
    "; inner loop init\n" +
    "ADDI x5, x2, 0      ; int control var\n" +
    "ADD x6, x5, x5      ; init offset offset (x5 * 2) * 2\n" +
    "ADD x6, x6, x6\n" +
    "\n" +
    "; inner loop condition\n" +
    "loop2:\n" +
    "BGE x5, x3, loop2exit      \n" +
    "\n" +
    "; inner loop bodyw\n" +
    "LW x7, 0x0(x6)      ; RMW  \n" +
    "ADDI x7, x7, 1\n" +
    "SW x7, 0x0(x6)\n" +
    "\n" +
    "; inner loop increment\n" +
    "ADDI x5, x5, 1\n" +
    "ADDI x6, x6, 4\n" +
    "BGE x0, x0, loop2\n" +
    "loop2exit:\n" +
    "\n" +
    "; outer lopp increment\n" +
    "ADDI x2, x2, 1\n" +
    "ADDI x3, x3, -1\n" +
    "BGE x0, x0, loop1\n" +
    "loop1exit:\n" +
    "\n" +
    "BGE x0, x0, 0"