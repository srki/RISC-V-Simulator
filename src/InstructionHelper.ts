import Val from "Val";

export default class InstructionHelper {
    static readonly INSTR_SIZE = 32;
    static readonly OP_CODE_SIZE = 7;

    /* @formatter:off */
    static readonly OP_CODE_ALU    = "0110011";
    static readonly OP_CODE_ALUI   = "0010011";
    static readonly OP_CODE_LW     = "0000011";
    static readonly OP_CODE_SW     = "0100011";
    static readonly OP_CODE_BRANCH = "1100011";
    static readonly OP_CODE_JAL    = "1101111";
    static readonly OP_CODE_JALR   = "1100111";

    /* ALU Functs */
    static readonly FUNCT_ADD  = "0000000000";
    static readonly FUNCT_SUB  = "0100000000";
    static readonly FUNCT_SLL  = "0000000001";
    static readonly FUNCT_SLT  = "0000000010";
    static readonly FUNCT_SLTU = "0000000011";
    static readonly FUNCT_XOR  = "0000000100";
    static readonly FUNCT_SRL  = "0000000101";
    static readonly FUNCT_SRA  = "0100000101";
    static readonly FUNCT_OR   = "0000000110";
    static readonly FUNCT_AND  = "0000000111";
    /* @formatter:on */

    private static padWithZeroes(str: String, len: number = 32) {
        while (str.length < len) {
            str = "0" + str;
        }
        return str;
    }

    static toBitString(instr: Val) {
        return this.padWithZeroes(instr.asUnsignedInt().toString(2));
    }

    static getOpCodeStr(inst: Val) {
        return this.toBitString(inst).substr(this.INSTR_SIZE - this.OP_CODE_SIZE);
    }

    static getRd(instr: Val): number {
        return parseInt(instr.asBinaryString().substr(20, 5), 2);
    }

    static getRs1(instr: Val): number {
        return parseInt(instr.asBinaryString().substr(12, 5), 2);
    }

    static getRs2(instr: Val): number {
        return parseInt(instr.asBinaryString().substr(7, 5), 2);
    }

    static createRType(opCode: string, funct: string, rd: number, rs1: number, rs2: number): Val {
        let funct7 = funct.substr(0, 7);
        let funct3 = funct.substr(7, 3);

        let instr = funct7 +
            this.padWithZeroes(rs2.toString(2), 5) +
            this.padWithZeroes(rs1.toString(2), 5) +
            funct3 +
            this.padWithZeroes(rd.toString(2), 5) +
            opCode;
        return new Val(parseInt(instr, 2), 32);
    }

    static compare(v: Val, s: string) {
        console.log(v.asBinaryString());
        console.log(s.replace(/ /g, ""));
    }

    static main(args: String[] = []): void {
        this.compare(this.createRType(this.OP_CODE_ALU, this.FUNCT_ADD, 2, 1, 1),
            "0000000 00001 00001 000 00010 0110011");
    }
}
