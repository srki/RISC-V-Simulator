export let fibAsm =
    "ADDI x1, x0, 31 ; calculate x1 Fibonacci numbers\n" +
    "ADDI x2, x0, 2 ; initialize the counter\n" +
    "ADDI x3, x0, 0 ; initialize the destination pointer\n" +
    "\n" +
    "; set the first two Fibonacci numbers\n" +
    "; and store them in memory\n" +
    "ADDI x5, x0, 0\n" +
    "ADDI x6, x0, 1\n" +
    "\n" +
    "; store the first two pointers \n" +
    "; and increment the destination pointer\n" +
    "SW x5, 0(x3)\n" +
    "ADDI x3, x3, 4\n" +
    "SW x6, 0(x3)\n" +
    "ADDI x3, x3, 4\n" +
    "\n" +
    "; calculate the next Fibonacci and store it\n" +
    "ADD x7, x6, x5\n" +
    "SW x7, 0x0(x3)\n" +
    "ADDI x3, x3, 4\n" +
    "\n" +
    "ADDI x5, x6, 0\n" +
    "ADDI x6, x7, 0\n" +
    "\n" +
    "; increment the counter\n" +
    "; and jump back if necessary\n" +
    "ADDI x2, x2, 1\n" +
    "BGE x1, x2, -0x18\n" +
    "BGE x0, x0, 0"