import Val from "./Val";

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

    /* ALU Functions */
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

    /* ALUi Functions */
    static readonly FUNCT_ADDI   = "000";
    static readonly FUNCT_SLTI   = "010";
    static readonly FUNCT_SLTIU  = "011";
    static readonly FUNCT_XORI   = "100";
    static readonly FUNCT_ORI    = "110";
    static readonly FUNCT_ANDI   = "111";

    static readonly FUNCT_SLLI = "0000000001";
    static readonly FUNCT_SRLI = "0000000101";
    static readonly FUNCT_SRAI = "0100000101";

    /* Load Functions */
    static readonly FUNCT_LB  = "000";
    static readonly FUNCT_LH  = "001";
    static readonly FUNCT_LW  = "010";
    static readonly FUNCT_LBU = "100";
    static readonly FUNCT_LHU = "10";

    /* Store Functions */
    static readonly FUNCT_SB = "000";
    static readonly FUNCT_SH = "001";
    static readonly FUNCT_SW = "010";

    /* Branch Functions */
    static readonly FUNCT_BEQ  = "000";
    static readonly FUNCT_BNE  = "001";
    static readonly FUNCT_BLT  = "100";
    static readonly FUNCT_BGE  = "101";
    static readonly FUNCT_BLTU = "110";
    static readonly FUNCT_BGEU = "111";

    /* @formatter:on */

    private static convertAndPad(num: Number, len: number = 32) {
        let str = num.toString(2);
        while (str.length < len) {
            str = "0" + str;
        }
        return str;
    }

    static toBitString(instr: Val) {
        return this.convertAndPad(instr.asUnsignedInt());
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

    static getImmIType(instr: Val): number {
        return parseInt(instr.asBinaryString().substr(0, 12), 2);
    }

    static getImmBType(instr: Val): number {
        let str = instr.asBinaryString();
        let imm12 = str.substr(0, 1);
        let imm10 = str.substr(1, 6);
        let imm4 = str.substr(20, 4);
        let imm11 = str.substr(24, 1);

        return parseInt(imm12 + imm11 + imm10 + imm4 + "0", 2);
    }

    static getImmSType(instr: Val): number {
        let str = instr.asBinaryString();
        let imm11 = str.substr(0, 7);
        let imm4 = str.substr(20, 5);

        return parseInt(imm11 + imm4, 2);
    }

    static createRType(opCode: string, funct: string, rd: number, rs1: number, rs2: number): Val {
        let funct7 = funct.substr(0, 7);
        let funct3 = funct.substr(7, 3);

        let instr = funct7 + this.convertAndPad(rs2, 5) + this.convertAndPad(rs1, 5) + funct3 +
            this.convertAndPad(rd, 5) + opCode;

        return new Val(parseInt(instr, 2), 32);
    }

    static createIType(opCode: string, funct: string, rd: number, rs1: number, imm: number): Val {
        let instr = this.convertAndPad(imm, 12) + this.convertAndPad(rs1, 5) + funct +
            this.convertAndPad(rd, 5) + opCode;

        return new Val(parseInt(instr, 2), 32);
    }

    static createITypeShift(opCode: string, funct: string, rd: number, rs1: number, shamt: number) {
        let funct7 = funct.substr(0, 7);
        let funct3 = funct.substr(7, 3);

        let instr = funct7 + this.convertAndPad(shamt, 5) + this.convertAndPad(rs1, 5) + funct3 +
            this.convertAndPad(rd, 5) + opCode;

        return new Val(parseInt(instr, 2), 32);
    }

    static createSType(opCode: string, funct: string, rs1: number, rs2: number, imm: number): Val {
        let immStr = this.convertAndPad(imm, 12);
        let imm11 = immStr.substr(0, 7);
        let imm4 = immStr.substr(7, 5);

        let instr = imm11 + this.convertAndPad(rs2, 5) + this.convertAndPad(rs1, 5) + funct + imm4 + opCode;

        return new Val(parseInt(instr, 2), 32);
    }

    static createBType(opCode: string, funct: string, rs1: number, rs2: number, imm: number) {
        let immStr = this.convertAndPad(imm, 12);
        let imm12 = immStr.substr(0, 1);
        let imm10 = immStr.substr(2, 6);
        let imm4 = immStr.substr(8, 4);
        let imm11 = immStr.substr(1, 1);

        let instr = imm12 + imm10 + this.convertAndPad(rs2, 5) + this.convertAndPad(rs1, 5) +
            funct + imm4 + imm11 + opCode;

        return new Val(parseInt(instr, 2), 32);
    }

    static decode(instr: Val): string {
        let opCode = this.getOpCodeStr(instr);

        switch (opCode) {
            case this.OP_CODE_ALU:
                return this.decodeALU(instr);

            case this.OP_CODE_ALUI:
                return this.decodeALUI(instr);

            case this.OP_CODE_LW:
                return this.decodeLW(instr);

            case this.OP_CODE_SW:
                return this.decodeSW(instr);

            case this.OP_CODE_BRANCH:
                return this.decodeBRANCH(instr);

            case this.OP_CODE_JAL:
                return this.decodeJAL(instr);

            case this.OP_CODE_JALR:
                return this.decodeJALR(instr);

            default:
                console.error("Unsupported OP Code: " + opCode);
                return instr.asHexString();
        }
    }

    static decodeALU(instr: Val): string {
        let func = instr.asBinaryString().substr(0, 7) + instr.asBinaryString().substr(17, 3);

        let name = "-";
        switch (func) {
            case this.FUNCT_ADD: {
                name = "ADD";
                break;
            }
            case this.FUNCT_SUB: {
                name = "SUB";
                break;
            }
            case this.FUNCT_SLL: {
                name = "SLT";
                break;
            }
            case this.FUNCT_SLT: {
                name = "SLT";
                break;
            }
            case this.FUNCT_SLTIU: {
                name = "SLTU";
                break;
            }
            case this.FUNCT_XOR: {
                name = "XOR";
                break;
            }
            case this.FUNCT_SRL: {
                name = "SRL";
                break;
            }
            case this.FUNCT_SRA: {
                name = "SRA";
                break;
            }
            case this.FUNCT_OR: {
                name = "OR";
                break;
            }
            case this.FUNCT_AND: {
                name = "";
                break;
            }
        }

        return name + " x" + this.getRd(instr) + ", x" + this.getRs1(instr) + ", x" + this.getRs2(instr);
    }

    static decodeALUI(instr: Val): string {
        let func7 = instr.asBinaryString().substr(0, 7);
        let func3 = instr.asBinaryString().substr(17, 3);

        let name = "-";
        switch (func3) {
            case this.FUNCT_ADDI: {
                name = "ADDI";
                break;
            }
            case this.FUNCT_SLTI: {
                name = "SLTI";
                break;
            }
            case this.FUNCT_SLTIU: {
                name = "SLTIU";
                break;
            }
            case this.FUNCT_XORI: {
                name = "XORI";
                break;
            }
            case this.FUNCT_ORI: {
                name = "ORI";
                break;
            }
            case this.FUNCT_ANDI: {
                name = "ANDI";
                break;
            }
        }

        switch (func7 + func3) {
            case this.FUNCT_SLLI: {
                name = "SSLI";
                break;
            }
            case this.FUNCT_SRLI: {
                name = "SRLI";
                break;
            }
            case this.FUNCT_SRAI: {
                name = "SRAI";
                break;
            }
        }

        return name + " x" + this.getRd(instr) + ", x" + this.getRs1(instr) + ", " +
            this.getImmIType(instr).toString(10);
    }

    static decodeLW(instr: Val): string {
        let func = instr.asBinaryString().substr(17, 3);

        let name = "-";
        switch (func) {
            case this.FUNCT_LB: {
                name = "LB";
                break;
            }
            case this.FUNCT_LH: {
                name = "LH";
                break;
            }
            case this.FUNCT_LW: {
                name = "LW";
                break;
            }
            case this.FUNCT_LBU: {
                name = "LBU";
                break;
            }
            case this.FUNCT_LHU: {
                name = "LHU";
                break;
            }
        }

        return name + " x" + this.getRd(instr) + ", 0x" + this.getImmIType(instr).toString(16).toUpperCase() +
            "(x" + this.getRs1(instr) + ")";
    }

    static decodeSW(instr: Val): string {
        let func = instr.asBinaryString().substr(17, 3);

        let name = "-";
        switch (func) {
            case this.FUNCT_SB: {
                name = "SW";
                break;
            }
            case this.FUNCT_SH: {
                name = "SW";
                break;
            }
            case this.FUNCT_SW: {
                name = "SW";
                break;
            }
        }

        return name + " x" + this.getRs1(instr) + ", 0x" + this.getImmIType(instr).toString(16).toUpperCase() +
            "(x" + this.getRs2(instr) + ")";
    }

    static decodeBRANCH(instr: Val): string {
        let func = instr.asBinaryString().substr(17, 3);

        let name = "-";
        switch (func) {
            case this.FUNCT_BEQ: {
                name = "BEQ";
                break;
            }
            case this.FUNCT_BNE: {
                name = "BNE";
                break;
            }
            case this.FUNCT_BLT: {
                name = "BLT";
                break;
            }
            case this.FUNCT_BGE: {
                name = "BGE";
                break;
            }
            case this.FUNCT_BLTU: {
                name = "BLTU";
                break;
            }
            case this.FUNCT_BGEU: {
                name = "BGEU";
                break;
            }
        }

        return name + " x" + this.getRs1(instr) + ", x" + this.getRs2(instr) +
            ", 0x" + this.getImmBType(instr).toString(16).toUpperCase();
    }

    static decodeJAL(instr: Val): string {
        return "JAL instruction";
    }

    static decodeJALR(instr: Val): string {
        return "JALR instruction";
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
