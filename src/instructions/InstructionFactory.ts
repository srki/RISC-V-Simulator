import Value from "../util/Value";
import InstructionConstants from "./InstructionConstants";
import InstructionHelper from "./InstructionHelper";

export default class InstructionFactory {
    static createRType(opCode: string, funct: string, rd: number, rs1: number, rs2: number): Value {
        let funct7 = funct.substr(0, 7);
        let funct3 = funct.substr(7, 3);

        let instr = funct7 +
            InstructionHelper.convertAndPad(rs2, 5) +
            InstructionHelper.convertAndPad(rs1, 5) + funct3 +
            InstructionHelper.convertAndPad(rd, 5) + opCode;

        return new Value(instr, 32);
    }

    static createIType(opCode: string, funct: string, rd: number, rs1: number, imm: number): Value {
        let instr =
            InstructionHelper.convertAndPad(imm, 12) +
            InstructionHelper.convertAndPad(rs1, 5) + funct +
            InstructionHelper.convertAndPad(rd, 5) + opCode;

        return new Value(instr, 32);
    }

    static createITypeShift(opCode: string, funct: string, rd: number, rs1: number, shamt: number) {
        let funct7 = funct.substr(0, 7);
        let funct3 = funct.substr(7, 3);

        let instr = funct7 +
            InstructionHelper.convertAndPad(shamt, 5) +
            InstructionHelper.convertAndPad(rs1, 5) + funct3 +
            InstructionHelper.convertAndPad(rd, 5) + opCode;

        return new Value(instr, 32);
    }

    static createSType(opCode: string, funct: string, rs1: number, rs2: number, imm: number): Value {
        let immStr = InstructionHelper.convertAndPad(imm, 12);
        let imm11 = immStr.substr(0, 7);
        let imm4 = immStr.substr(7, 5);

        let instr = imm11 +
            InstructionHelper.convertAndPad(rs2, 5) +
            InstructionHelper.convertAndPad(rs1, 5) +
            funct + imm4 + opCode;

        return new Value(instr, 32);
    }

    static createBType(opCode: string, funct: string, rs1: number, rs2: number, imm: number) {
        if (imm % 4 != 0) {
            console.error("Imm should be divisible by 4!");
            imm -= imm / 4;
        }

        imm /= 2;

        let immStr = InstructionHelper.convertAndPad(imm, 12);
        let imm12 = immStr.substr(0, 1);
        let imm10 = immStr.substr(2, 6);
        let imm4 = immStr.substr(8, 4);
        let imm11 = immStr.substr(1, 1);

        let instr = imm12 + imm10 +
            InstructionHelper.convertAndPad(rs2, 5) +
            InstructionHelper.convertAndPad(rs1, 5) +
            funct + imm4 + imm11 + opCode;

        return new Value(instr, 32);
    }

    static compare(v: Value, s: string) {
        console.log(v.asBinaryString());
        console.log(s.replace(/ /g, ""));
    }

    static main(args: String[] = []): void {
        this.compare(this.createRType(InstructionConstants.OP_CODE_ALU, InstructionConstants.FUNCT_ADD,
            2, 1, 1),
            "0000000 00001 00001 000 00010 0110011");
    }
}