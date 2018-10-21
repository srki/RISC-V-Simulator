import Val from "Val";

export default class InstructionHelper {
    static readonly INSTR_SIZE = 32;
    static readonly OP_CODE_SIZE = 7;

    static readonly OP_CODE_ALU = "0110011";
    static readonly OP_CODE_ALUI = "0010011";
    static readonly OP_CODE_LW = "0000011";
    static readonly OP_CODE_SW = "0100011";
    static readonly OP_CODE_BRANCH = "1100011";
    static readonly OP_CODE_JAL = "1101111";
    static readonly OP_CODE_JALR = "1100111";


    static toBitString(instr: Val) {
        let str = instr.asUnsignedInt().toString(2);
        while (str.length < 32) {
            str = "0" + str;
        }
        return str;
    }

    static getOpCodeStr(inst: Val) {
        return this.toBitString(inst).substr(this.INSTR_SIZE - this.OP_CODE_SIZE);
    }
}