import Value from "../util/Value";

export default class InstructionHelper {
    static readonly INSTR_SIZE = 32;
    static readonly OP_CODE_SIZE = 7;


    static convertAndPad(num: number, len: number = 32) {
        if (num < 0) {
            num += 2 ** len;
        }

        let str = num.toString(2);
        while (str.length < len) {
            str = "0" + str;
        }
        return str;
    }

    static toBitString(instr: Value) {
        return this.convertAndPad(instr.asUnsignedInt());
    }

    static getOpCodeStr(inst: Value) {
        return this.toBitString(inst).substr(this.INSTR_SIZE - this.OP_CODE_SIZE);
    }

    static getRd(instr: Value): number {
        return parseInt(instr.asBinaryString().substr(20, 5), 2);
    }

    static getRs1(instr: Value): number {
        return parseInt(instr.asBinaryString().substr(12, 5), 2);
    }

    static getRs2(instr: Value): number {
        return parseInt(instr.asBinaryString().substr(7, 5), 2);
    }

    static getImmIType(instr: Value): number {
        return parseInt(instr.asBinaryString().substr(0, 12), 2);
    }

    static getImmBType(instr: Value): number {
        let str = instr.asBinaryString();
        let imm12 = str.substr(0, 1);
        let imm10 = str.substr(1, 6);
        let imm4 = str.substr(20, 4);
        let imm11 = str.substr(24, 1);

        return parseInt(imm12 + imm11 + imm10 + imm4 + "0", 2);
    }

    static getImmSType(instr: Value): number {
        let str = instr.asBinaryString();
        let imm11 = str.substr(0, 7);
        let imm4 = str.substr(20, 5);

        return parseInt(imm11 + imm4, 2);
    }

    static getFuncLType(instr: Value): string {
        return instr.asBinaryString().substr(17, 3);
    }

    static getFuncSType(instr: Value): string {
        return instr.asBinaryString().substr(17, 3);
    }

    static getFuncBType(instr: Value): string {
        return instr.asBinaryString().substr(17, 3);
    }


}
