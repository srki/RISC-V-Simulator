import Value from "../util/Value";
import InstructionConstants from "./InstructionConstants";
import InstructionFactory from "./InstructionFactory";

export default class Assembler {

    private static readonly LABEL_DEF_REGEX = /^[a-zA-z0-9]+:/
    private static readonly LABEL_REGEX = /^[a-zA-z0-9]+/
    private static readonly REG_REGEX = /^x\d+$/;
    private static readonly NUMBER_REGEX = /^-?((0x[0-9A-Fa-f]+)|\d+)$/;
    private static readonly INDEXING_REGEX = /^-?((0x[0-9A-Fa-f]+)|\d+)\(x\d+\)$/; // TODO: change name

    private address: number = 0
    private labels: { string: number } = <{ string, number }>{}

    static parse(text: string): Value[] {
        return new Assembler().parse(text);
    }

    private parse(text: string): Value[] {
        const lines = Assembler.preprocessCode(text)
        this.labels = Assembler.extractLabels(lines)
        return this.parseLines(lines);
    }

    private static extractLabels(text: string[]) {
        let labels: { string: number } = <{ string, number }>{}
        let address = 0;
        for (const line of text) {
            if (line.length == 0) {
                continue;
            }

            if (line.match(Assembler.LABEL_DEF_REGEX)) {
                const label = line.substring(0, line.length - 1)
                labels[label] = address
            } else {
                address += 4
            }
        }
        return labels
    }

    private static preprocessCode(text: string) {
        return text.split('\n')
            .map(value => value.replace(/#.*/, ''))
            .map(value => value.replace(/;.*/, ''))
            .map(value => value.trim())
    }

    private parseLines(lines: string[]) {
        this.address = 0
        let values: Value[] = []
        for (const idx in lines) {
            const line = lines[idx]
            try {
                const parsed = this.parseLine(line);
                if (parsed) {
                    values.push(parsed)
                    this.address += 4
                }
            } catch (e) {
                throw "Line " + (idx + 1) + ": " + e;
            }
        }

        return values;
    }

    private parseConstant(value: string, base: number = 0) {
        if (value.match(Assembler.NUMBER_REGEX)) {
            return parseInt(value)
        }

        if (value.match(Assembler.LABEL_REGEX)) {
            if (!this.labels[value]) {
                throw "Label '" + value +"' does not exist";
            }
            return this.labels[value] - base
        }

        throw "Internal error."
    }

    private parseLine(line: string): Value {
        if (line.length == 0 || line.match(Assembler.LABEL_DEF_REGEX)) {
            return null;
        }

        let instrName = line.replace(/[^A-Za-z].*/, '');
        let args = line.replace(/^[A-Za-z]*/, '');

        switch (instrName) {
            case "JAL": {
                return;
            }
            case "JALR": {
                return;
            }

            /* Branches */
            case "BEQ": {
                return this.parseBranch(InstructionConstants.FUNCT_BEQ, args);
            }
            case "BNE": {
                return this.parseBranch(InstructionConstants.FUNCT_BNE, args);
            }
            case "BLT": {
                return this.parseBranch(InstructionConstants.FUNCT_BLT, args);
            }
            case "BGE": {
                return this.parseBranch(InstructionConstants.FUNCT_BGE, args);
            }
            case "BLTU": {
                return this.parseBranch(InstructionConstants.FUNCT_BLTU, args);
            }
            case "BGEU": {
                return this.parseBranch(InstructionConstants.FUNCT_BGEU, args);
            }

            /* Loads */
            case "LB": {
                return this.parseLoad(InstructionConstants.FUNCT_LB, args);
            }
            case "LH": {
                return this.parseLoad(InstructionConstants.FUNCT_LH, args);
            }
            case "LW": {
                return this.parseLoad(InstructionConstants.FUNCT_LW, args);
            }
            case "LBU": {
                return this.parseLoad(InstructionConstants.FUNCT_LBU, args);
            }
            case "LHU": {
                return this.parseLoad(InstructionConstants.FUNCT_LHU, args);
            }

            /* Stores */
            case "SB": {
                return this.parseStore(InstructionConstants.FUNCT_SB, args);
            }
            case "SH": {
                return this.parseStore(InstructionConstants.FUNCT_SH, args);
            }
            case "SW": {
                return this.parseStore(InstructionConstants.FUNCT_SW, args);
            }

            /* Imm ALU ops */
            case "ADDI": {
                return this.parseImm(InstructionConstants.FUNCT_ADDI, args);
            }
            case "SLTI": {
                return this.parseImm(InstructionConstants.FUNCT_SLTI, args);
            }
            case "SLTIU": {
                return this.parseImm(InstructionConstants.FUNCT_SLTIU, args);
            }
            case "XORI": {
                return this.parseImm(InstructionConstants.FUNCT_XORI, args);
            }
            case "ORI": {
                return this.parseImm(InstructionConstants.FUNCT_ORI, args);
            }
            case "ANDI": {
                return this.parseImm(InstructionConstants.FUNCT_ANDI, args);
            }
            case "SLLI": {
                return this.parseImm(InstructionConstants.FUNCT_SLLI, args);
            }
            case "SRLI": {
                return this.parseImm(InstructionConstants.FUNCT_SRLI, args);
            }
            case "SRAI": {
                return this.parseImm(InstructionConstants.FUNCT_SRAI, args);
            }

            /* ALU */
            case "ADD": {
                return this.parseALU(InstructionConstants.FUNCT_ADD, args);
            }
            case "SUB": {
                return this.parseALU(InstructionConstants.FUNCT_SUB, args);
            }
            case "SLL": {
                return this.parseALU(InstructionConstants.FUNCT_SLL, args);
            }
            case "SLT": {
                return this.parseALU(InstructionConstants.FUNCT_SLT, args);
            }
            case "SLTU": {
                return this.parseALU(InstructionConstants.FUNCT_SLTU, args);
            }
            case "XOR": {
                return this.parseALU(InstructionConstants.FUNCT_XOR, args);
            }
            case "SRL": {
                return this.parseALU(InstructionConstants.FUNCT_SRL, args);
            }
            case "SRA": {
                return this.parseALU(InstructionConstants.FUNCT_SRA, args);
            }
            case "OR": {
                return this.parseALU(InstructionConstants.FUNCT_OR, args);
            }
            case "AND": {
                return this.parseALU(InstructionConstants.FUNCT_AND, args);
            }

            default: {
                throw "Unknown instruction name: " + instrName;
            }
        }
    }

    private parseBranch(funct: string, argsStr: string): Value {
        let args = argsStr.split(",").map(arg => arg.trim());

        if (args.length != 3) {
            throw "Instruction requires 3 arguments";
        }

        if (!args[0].match(Assembler.REG_REGEX)) {
            throw "Invalid rs1 register format.";
        }

        if (!args[1].match(Assembler.REG_REGEX)) {
            throw "Invalid rs2 register format.";
        }

        if (!args[2].match(Assembler.NUMBER_REGEX) && !args[2].match(Assembler.LABEL_REGEX)) {
            throw "Invalid relative address format.";
        }

        return InstructionFactory.createBType(InstructionConstants.OP_CODE_BRANCH, funct,
            parseInt(args[0].substr(1)), parseInt(args[1].substr(1)), this.parseConstant(args[2], this.address));
    }

    private parseLoad(funct: string, argsStr: string): Value {
        let args = argsStr.split(",").map(arg => arg.trim());

        if (args.length != 2) {
            throw "Instruction requires 2 arguments";
        }

        if (!args[0].match(Assembler.REG_REGEX)) {
            throw "Invalid rd register format.";
        }

        if (!args[1].match(Assembler.INDEXING_REGEX)) {
            throw "Invalid address format."; // TODO: change message
        }

        return InstructionFactory.createIType(InstructionConstants.OP_CODE_LW, funct,
            parseInt(args[0].substr(1)),
            parseInt(args[1].split("(")[1].replace(/([x)])/g, "")),
            parseInt(args[1].split("(")[0]));
    }

    private parseStore(funct: string, argsStr: string): Value {
        let args = argsStr.split(",").map(arg => arg.trim());

        if (args.length != 2) {
            throw "Instruction requires 2 arguments";
        }

        if (!args[0].match(Assembler.REG_REGEX)) {
            throw "Invalid rs1 register format.";
        }

        if (!args[1].match(Assembler.INDEXING_REGEX)) {
            throw "Invalid address format."; // TODO: change message
        }

        return InstructionFactory.createSType(InstructionConstants.OP_CODE_SW, funct,
            parseInt(args[1].split("(")[1].replace(/([x)])/g, "")),
            parseInt(args[0].substr(1)),
            parseInt(args[1].split("(")[0]),);
    }

    private parseImm(funct: string, argsStr: string): Value {
        let args = argsStr.split(",").map(arg => arg.trim());

        if (args.length != 3) {
            throw "Instruction requires 3 arguments";
        }

        if (!args[0].match(Assembler.REG_REGEX)) {
            throw "Invalid rd register format.";
        }

        if (!args[1].match(Assembler.REG_REGEX)) {
            throw "Invalid rs1 register format.";
        }

        if (!args[2].match(Assembler.NUMBER_REGEX) && !args[2].match(Assembler.LABEL_REGEX)) {
            throw "Invalid relative address format.";
        }

        return InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, funct,
            parseInt(args[0].substr(1)), parseInt(args[1].substr(1)), this.parseConstant(args[2]));
    }

    private parseALU(funct: string, argsStr: string): Value {
        let args = argsStr.split(",").map(arg => arg.trim());

        if (args.length != 3) {
            throw "Instruction requires 3 arguments";
        }

        if (!args[0].match(Assembler.REG_REGEX)) {
            throw "Invalid rd register format.";
        }

        if (!args[1].match(Assembler.REG_REGEX)) {
            throw "Invalid rs1 register format.";
        }

        if (!args[2].match(Assembler.REG_REGEX)) {
            throw "Invalid rs2 register format.";
        }

        return InstructionFactory.createRType(InstructionConstants.OP_CODE_ALU, funct,
            parseInt(args[0].substr(1)), parseInt(args[1].substr(1)), parseInt(args[2].substr(1)));
    }

}