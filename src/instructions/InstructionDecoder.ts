import Value from "../util/Value";
import InstructionConstants from "./InstructionConstants";
import InstructionHelper from "./InstructionHelper";

export class InstructionDecoder {
    static decode(instr: Value): string {
        let opCode = InstructionHelper.getOpCodeStr(instr);

        switch (opCode) {
            case InstructionConstants.OP_CODE_ALU:
                return this.decodeALU(instr);

            case InstructionConstants.OP_CODE_ALUI:
                return this.decodeALUI(instr);

            case InstructionConstants.OP_CODE_LW:
                return this.decodeLW(instr);

            case InstructionConstants.OP_CODE_SW:
                return this.decodeSW(instr);

            case InstructionConstants.OP_CODE_BRANCH:
                return this.decodeBRANCH(instr);

            case InstructionConstants.OP_CODE_JAL:
                return this.decodeJAL(instr);

            case InstructionConstants.OP_CODE_JALR:
                return this.decodeJALR(instr);

            default:
                // console.error("Unsupported OP Code: " + opCode);
                return instr.asHexString();
        }
    }

    static decodeALU(instr: Value): string {
        let func = instr.asBinaryString().substr(0, 7) + instr.asBinaryString().substr(17, 3);

        let name = "-";
        switch (func) {
            case InstructionConstants.FUNCT_ADD: {
                name = "ADD";
                break;
            }
            case InstructionConstants.FUNCT_SUB: {
                name = "SUB";
                break;
            }
            case InstructionConstants.FUNCT_SLL: {
                name = "SLL";
                break;
            }
            case InstructionConstants.FUNCT_SLT: {
                name = "SLT";
                break;
            }
            case InstructionConstants.FUNCT_SLTIU: {
                name = "SLTU";
                break;
            }
            case InstructionConstants.FUNCT_XOR: {
                name = "XOR";
                break;
            }
            case InstructionConstants.FUNCT_SRL: {
                name = "SRL";
                break;
            }
            case InstructionConstants.FUNCT_SRA: {
                name = "SRA";
                break;
            }
            case InstructionConstants.FUNCT_OR: {
                name = "OR";
                break;
            }
            case InstructionConstants.FUNCT_AND: {
                name = "";
                break;
            }
        }

        return name + " x" + InstructionHelper.getRd(instr) + ", x" +
            InstructionHelper.getRs1(instr) + ", x" + InstructionHelper.getRs2(instr);
    }

    static decodeALUI(instr: Value): string {
        let func7 = instr.asBinaryString().substr(0, 7);
        let func3 = instr.asBinaryString().substr(17, 3);

        let name = "-";
        switch (func3) {
            case InstructionConstants.FUNCT_ADDI: {
                name = "ADDI";
                break;
            }
            case InstructionConstants.FUNCT_SLTI: {
                name = "SLTI";
                break;
            }
            case InstructionConstants.FUNCT_SLTIU: {
                name = "SLTIU";
                break;
            }
            case InstructionConstants.FUNCT_XORI: {
                name = "XORI";
                break;
            }
            case InstructionConstants.FUNCT_ORI: {
                name = "ORI";
                break;
            }
            case InstructionConstants.FUNCT_ANDI: {
                name = "ANDI";
                break;
            }
        }

        switch (func7 + func3) {
            case InstructionConstants.FUNCT_SLLI: {
                name = "SSLI";
                break;
            }
            case InstructionConstants.FUNCT_SRLI: {
                name = "SRLI";
                break;
            }
            case InstructionConstants.FUNCT_SRAI: {
                name = "SRAI";
                break;
            }
        }

        let imm = InstructionHelper.getImmIType(instr);
        if (imm >= 1<< 11) {
            imm -= (1 << 12);
        }

        return name + " x" + InstructionHelper.getRd(instr) + ", x" + InstructionHelper.getRs1(instr) + ", " +
            imm.toString(10);
    }

    static decodeLW(instr: Value): string {
        let func = instr.asBinaryString().substr(17, 3);

        let name = "-";
        switch (func) {
            case InstructionConstants.FUNCT_LB: {
                name = "LB";
                break;
            }
            case InstructionConstants.FUNCT_LH: {
                name = "LH";
                break;
            }
            case InstructionConstants.FUNCT_LW: {
                name = "LW";
                break;
            }
            case InstructionConstants.FUNCT_LBU: {
                name = "LBU";
                break;
            }
            case InstructionConstants.FUNCT_LHU: {
                name = "LHU";
                break;
            }
        }

        return name + " x" + InstructionHelper.getRd(instr) + ", 0x" +
            InstructionHelper.getImmIType(instr).toString(16).toUpperCase() +
            "(x" + InstructionHelper.getRs1(instr) + ")";
    }

    static decodeSW(instr: Value): string {
        let func = instr.asBinaryString().substr(17, 3);

        let name = "-";
        switch (func) {
            case InstructionConstants.FUNCT_SB: {
                name = "SB";
                break;
            }
            case InstructionConstants.FUNCT_SH: {
                name = "SH";
                break;
            }
            case InstructionConstants.FUNCT_SW: {
                name = "SW";
                break;
            }
        }

        return name + " x" + InstructionHelper.getRs1(instr) + ", 0x" +
            InstructionHelper.getImmSType(instr).toString(16).toUpperCase() +
            "(x" + InstructionHelper.getRs2(instr) + ")";
    }

    static decodeBRANCH(instr: Value): string {
        let func = instr.asBinaryString().substr(17, 3);

        let name = "-";
        switch (func) {
            case InstructionConstants.FUNCT_BEQ: {
                name = "BEQ";
                break;
            }
            case InstructionConstants.FUNCT_BNE: {
                name = "BNE";
                break;
            }
            case InstructionConstants.FUNCT_BLT: {
                name = "BLT";
                break;
            }
            case InstructionConstants.FUNCT_BGE: {
                name = "BGE";
                break;
            }
            case InstructionConstants.FUNCT_BLTU: {
                name = "BLTU";
                break;
            }
            case InstructionConstants.FUNCT_BGEU: {
                name = "BGEU";
                break;
            }
        }

        let imm = InstructionHelper.getImmBType(instr);
        if (imm >= 1<< 12) {
            imm -= (1 << 13);
        }

        return name + " x" + InstructionHelper.getRs1(instr) + ", x" + InstructionHelper.getRs2(instr) +
            ", " + imm.toString(10);
    }

    static decodeJAL(instr: Value): string {
        return "JAL instruction";
    }

    static decodeJALR(instr: Value): string {
        return "JALR instruction";
    }
}