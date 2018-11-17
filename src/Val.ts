export default class Val {
    readonly val: number;
    readonly num_bits: number;

    private static mod(n: number, m: number): number {
        return ((n % m) + m) % m;
    }

    constructor(val: number = 0, num_bits: number) {
        this.num_bits = num_bits;
        this.val = Val.mod(val, 2 ** this.num_bits);
    }

    static UnsignedInt(val: number, num_bits: number = 32): Val {
        return new Val(Val.mod(val, 2 ** num_bits), num_bits);
    }

    asUnsignedInt(): number {
        return this.val;
    }

    static SignedInt(val: number, num_bits: number = 32): Val {
        const max_signed = 2 ** (num_bits - 1) - 1;
        if (val >= 0)
            return new Val(Val.mod(val, max_signed), num_bits);
        if (val < 0)
            return new Val((max_signed + 1) - Val.mod(val, max_signed), num_bits);
    }

    asSignedInt(): number {
        const max_signed = 2 ** (this.num_bits - 1) - 1;
        if (this.val <= max_signed)
            return this.val;
        return -(this.val - (max_signed + 1));
    }

    asHexString(): string {
        let str = this.asUnsignedInt().toString(16);
        while (str.length < this.num_bits / 4) {
            str = "0" + str;
        }
        return "0x" + str.toUpperCase();
    }

    asBinaryString(): string {
        let str = this.asUnsignedInt().toString(2);
        while (str.length < this.num_bits) {
            str = "0" + str;
        }
        return str;
    }

    asShortHexString(): string {
        return this.asUnsignedInt().toString(16).toLocaleUpperCase();
    }

    getNumBits(): number {
        return this.num_bits;
    }

    getByteBinary(byteIdx: number): string {
        if (this.num_bits != 32) {
            console.log("Error");
            return null;
        }

        return this.asBinaryString().substr((3 - byteIdx) * 8, 8)
    }

    writeByte(byteIdx: number, byte: string): Val {
        if (this.num_bits != 32) {
            console.log("Error");
            return null;
        }

        byteIdx = 3 - byteIdx;
        let str = this.asBinaryString();
        str = str.substring(0, byteIdx * 8) + byte + str.substr((byteIdx + 1) * 8);

        return new Val(parseInt(str, 2), 32);
    }

    // TODO: check if the implementations are correct
    static add(lhs: Val, rhs: Val): Val {
        return new Val(lhs.asUnsignedInt() + rhs.asUnsignedInt(), 32);
    }

    static sub(lhs: Val, rhs: Val): Val {
        return new Val(lhs.asUnsignedInt() - rhs.asUnsignedInt(), 32);
    }

    static and(lhs: Val, rhs: Val): Val {
        return new Val(lhs.asUnsignedInt() & rhs.asUnsignedInt(), 32);
    }

    static or(lhs: Val, rhs: Val): Val {
        return new Val(lhs.asUnsignedInt() | rhs.asUnsignedInt(), 32);
    }

    static xor(lhs: Val, rhs: Val): Val {
        return new Val(lhs.asUnsignedInt() ^ rhs.asUnsignedInt(), 32);
    }

    static shiftLeftLogical(lhs: Val, rhs: Val): Val {
        return new Val(lhs.asUnsignedInt() << rhs.asUnsignedInt(), 32);
    }

    static shiftRightLogical(lhs: Val, rhs: Val): Val {
        return new Val(lhs.asUnsignedInt() >>> rhs.asUnsignedInt(), 32);
    }

    static shiftRightArithmetic(lhs: Val, rhs: Val): Val {
        return new Val(lhs.asUnsignedInt() >> rhs.asUnsignedInt(), 32);
    }

    static cmp(lhs: Val, rhs: Val, signed: boolean): number {
        if (lhs.num_bits != rhs.num_bits) {
            console.error("The nuber of bits do not match");
            return null;
        }

        let a = lhs.asBinaryString();
        let b = rhs.asBinaryString();

        if (signed && (a[0]) != b[0]) {
            return a[0] == '1' ? -1 : 1;
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return a[i] == '0' ? -1 : 1;
            }
        }

        return 0;
    }

    static cmpEQ(lhs: Val, rhs: Val): boolean {
        return this.cmp(lhs, rhs, false) == 0;
    }

    static cmpNE(lhs: Val, rhs: Val): boolean {
        return this.cmp(lhs, rhs, false) != 0;
    }

    static cmpLT(lhs: Val, rhs: Val): boolean {
        return this.cmp(lhs, rhs, true) == -1;
    }

    static cmpGE(lhs: Val, rhs: Val): boolean {
        return this.cmp(lhs, rhs, true) != -1;
    }

    static cmpLTU(lhs: Val, rhs: Val): boolean {
        return this.cmp(lhs, rhs, false) == -1;
    }

    static cmpGEU(lhs: Val, rhs: Val): boolean {
        return this.cmp(lhs, rhs, false) != -1;
    }

    static main() {
        //@formatter:off
        console.log(this.cmpEQ(new Val(-10, 32), new Val( 10, 32)) == false);
        console.log(this.cmpEQ(new Val( 10, 32), new Val(-10, 32)) == false);
        console.log(this.cmpEQ(new Val( 10, 32), new Val( 10, 32)) == true);
        console.log(this.cmpEQ(new Val(-10, 32), new Val(-10, 32)) == true);
        console.log(this.cmpEQ(new Val(  9, 32), new Val(-10, 32)) == false);
        console.log(this.cmpEQ(new Val(  9, 32), new Val( 10, 32)) == false);
        console.log(this.cmpEQ(new Val( 11, 32), new Val( 10, 32)) == false);
        console.log(this.cmpEQ(new Val(-11, 32), new Val( 10, 32)) == false);

        console.log("--");

        console.log(this.cmpNE(new Val(-10, 32), new Val( 10, 32)) == true);
        console.log(this.cmpNE(new Val( 10, 32), new Val(-10, 32)) == true);
        console.log(this.cmpNE(new Val( 10, 32), new Val( 10, 32)) == false);
        console.log(this.cmpNE(new Val(-10, 32), new Val(-10, 32)) == false);
        console.log(this.cmpNE(new Val(  9, 32), new Val(-10, 32)) == true);
        console.log(this.cmpNE(new Val(  9, 32), new Val( 10, 32)) == true);
        console.log(this.cmpNE(new Val( 11, 32), new Val( 10, 32)) == true);
        console.log(this.cmpNE(new Val(-11, 32), new Val( 10, 32)) == true);

        console.log("--");

        console.log(this.cmpLT(new Val(-10, 32), new Val( 10, 32)) == true);
        console.log(this.cmpLT(new Val( 10, 32), new Val(-10, 32)) == false);
        console.log(this.cmpLT(new Val( 10, 32), new Val( 10, 32)) == false);
        console.log(this.cmpLT(new Val(-10, 32), new Val(-10, 32)) == false);
        console.log(this.cmpLT(new Val(  9, 32), new Val(-10, 32)) == false);
        console.log(this.cmpLT(new Val(  9, 32), new Val( 10, 32)) == true);
        console.log(this.cmpLT(new Val( 11, 32), new Val( 10, 32)) == false);
        console.log(this.cmpLT(new Val(-11, 32), new Val( 10, 32)) == true);

        console.log("--");

        console.log(this.cmpGE(new Val(-10, 32), new Val( 10, 32)) == false);
        console.log(this.cmpGE(new Val( 10, 32), new Val(-10, 32)) == true);
        console.log(this.cmpGE(new Val( 10, 32), new Val( 10, 32)) == true);
        console.log(this.cmpGE(new Val(-10, 32), new Val(-10, 32)) == true);
        console.log(this.cmpGE(new Val(  9, 32), new Val(-10, 32)) == true);
        console.log(this.cmpGE(new Val(  9, 32), new Val( 10, 32)) == false);
        console.log(this.cmpGE(new Val( 11, 32), new Val( 10, 32)) == true);
        console.log(this.cmpGE(new Val(-11, 32), new Val( 10, 32)) == false);

        console.log("--");

        console.log(this.cmpLTU(new Val( 10, 32), new Val( 10, 32)) == false);
        console.log(this.cmpLTU(new Val(  9, 32), new Val( 10, 32)) == true);
        console.log(this.cmpLTU(new Val( 11, 32), new Val( 10, 32)) == false);

        console.log("--");

        console.log(this.cmpGEU(new Val( 10, 32), new Val( 10, 32)) == true);
        console.log(this.cmpGEU(new Val(  9, 32), new Val( 10, 32)) == false);
        console.log(this.cmpGEU(new Val( 11, 32), new Val( 10, 32)) == true);
        //@formatter:on

    }

    static HexString(s: string, num_bits: number = 32) {
        return Val.UnsignedInt(parseInt(s, 16), num_bits);
    }
}

export const VAL_ZERO_32b = Val.UnsignedInt(0, 32);
export const VAL_ONE_32b = Val.UnsignedInt(1, 32);
export const VAL_TWO_32b = Val.UnsignedInt(2, 32);
export const VAL_THREE_32b = Val.UnsignedInt(3, 32);

export const VAL_ZERO_0b = Val.UnsignedInt(0, 0);
export const VAL_ZERO_5b = Val.UnsignedInt(0, 5);