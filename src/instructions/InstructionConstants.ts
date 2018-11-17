
export default class InstructionConstants {
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
    static readonly FUNCT_LHU = "101";

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
}


