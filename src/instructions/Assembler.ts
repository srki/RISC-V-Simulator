import Value from "../util/Value";
import InstructionConstants from "./InstructionConstants";
import InstructionFactory from "./InstructionFactory";

export default class Assembler {

    private static readonly REG_REGEX = /^x\d+$/;
    private static readonly NUMBER_REGEX = /^-?((0x[0-9A-Fa-f]+)|\d+)$/;
    private static readonly INDEXING_REGEX = /^-?((0x[0-9A-Fa-f]+)|\d+)\(x\d+\)$/; // TODO: change name

    static parse(text: string): Value[] {
        return text.split('\n')
            .map(value => value.replace(/#.*/, ''))
            .map(value => value.replace(/;.*/, ''))
            .map(value => value.trim())
            .map((value, index) => {
                try {
                    return this.parseLine(value);
                } catch (e) {
                    throw "Line " + (index + 1) + ": " + e;
                }
            })
            .filter(value => value != null);
    }

    static parseLine(line: string): Value {
        if (line.length == 0) {
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

    private static parseBranch(funct: string, argsStr: string): Value {
        let args = argsStr.split(",").map(arg => arg.trim());

        if (args.length != 3) {
            throw "Instruction requires 3 arguments";
        }

        if (!args[0].match(this.REG_REGEX)) {
            throw "Invalid rs1 register format.";
        }

        if (!args[1].match(this.REG_REGEX)) {
            throw "Invalid rs2 register format.";
        }

        if (!args[2].match(this.NUMBER_REGEX)) {
            throw "Invalid relative address format.";
        }

        return InstructionFactory.createBType(InstructionConstants.OP_CODE_BRANCH, funct,
            parseInt(args[0].substr(1)), parseInt(args[1].substr(1)), parseInt(args[2]));
    }

    private static parseLoad(funct: string, argsStr: string): Value {
        let args = argsStr.split(",").map(arg => arg.trim());

        if (args.length != 2) {
            throw "Instruction requires 2 arguments";
        }

        if (!args[0].match(this.REG_REGEX)) {
            throw "Invalid rd register format.";
        }

        if (!args[1].match(this.INDEXING_REGEX)) {
            throw "Invalid address format."; // TODO: change message
        }

        return InstructionFactory.createIType(InstructionConstants.OP_CODE_LW, funct,
            parseInt(args[0].substr(1)),
            parseInt(args[1].split("(")[1].replace(/([x)])/g, "")),
            parseInt(args[1].split("(")[0]));
    }

    private static parseStore(funct: string, argsStr: string): Value {
        let args = argsStr.split(",").map(arg => arg.trim());

        if (args.length != 2) {
            throw "Instruction requires 2 arguments";
        }

        if (!args[0].match(this.REG_REGEX)) {
            throw "Invalid rs1 register format.";
        }

        if (!args[1].match(this.INDEXING_REGEX)) {
            throw "Invalid address format."; // TODO: change message
        }

        return InstructionFactory.createSType(InstructionConstants.OP_CODE_SW, funct,
            parseInt(args[1].split("(")[1].replace(/([x)])/g, "")),
            parseInt(args[0].substr(1)),
            parseInt(args[1].split("(")[0]),);
    }

    private static parseImm(funct: string, argsStr: string): Value {
        let args = argsStr.split(",").map(arg => arg.trim());

        if (args.length != 3) {
            throw "Instruction requires 3 arguments";
        }

        if (!args[0].match(this.REG_REGEX)) {
            throw "Invalid rd register format.";
        }

        if (!args[1].match(this.REG_REGEX)) {
            throw "Invalid rs1 register format.";
        }

        if (!args[2].match(this.NUMBER_REGEX)) {
            throw "Invalid relative address format.";
        }

        return InstructionFactory.createIType(InstructionConstants.OP_CODE_ALUI, funct,
            parseInt(args[0].substr(1)), parseInt(args[1].substr(1)), parseInt(args[2]));
    }

    private static parseALU(funct: string, argsStr: string): Value {
        let args = argsStr.split(",").map(arg => arg.trim());

        if (args.length != 3) {
            throw "Instruction requires 3 arguments";
        }

        if (!args[0].match(this.REG_REGEX)) {
            throw "Invalid rd register format.";
        }

        if (!args[1].match(this.REG_REGEX)) {
            throw "Invalid rs1 register format.";
        }

        if (!args[2].match(this.REG_REGEX)) {
            throw "Invalid rs2 register format.";
        }

        return InstructionFactory.createRType(InstructionConstants.OP_CODE_ALU, funct,
            parseInt(args[0].substr(1)), parseInt(args[1].substr(1)), parseInt(args[2].substr(1)));
    }

}