export default class Value {
    readonly bitValue: string;
    readonly numBits: number;

    private static mod(n: number, m: number): number {
        return ((n % m) + m) % m;
    }

    constructor(bitValue: string, numBits: number) {
        if (bitValue.length > numBits) {
            console.log("BitValue is too long");
        }

        this.numBits = numBits;
        this.bitValue = this.padWith(bitValue, "0", numBits);
    }

    static fromUnsignedInt(val: number, num_bits: number = 32): Value {
        return new Value(Value.mod(val, 2 ** num_bits).toString(2), num_bits);
    }

    static fromSignedInt(val: number, numBits: number = 32): Value {
        return new Value((val < 0 ? val + (1 << numBits) : val).toString(2), numBits);
    }

    asUnsignedInt(): number {
        return parseInt(this.bitValue, 2);
    }

    asSignedInt(): number {
        let str = this.padWith(this.bitValue, "0", this.numBits);
        if (str[0] == "0") {
            return parseInt(this.bitValue, 2);
        }

        let flippedStr = "";
        for (let i = 1; i < str.length; i++) {
            flippedStr += str[i] == "1" ? "0" : "1";
        }

        return -parseInt(flippedStr, 2) - 1;
    }

    asHexString(): string {
        let str = this.asUnsignedInt().toString(16);
        while (str.length < this.numBits / 4) {
            str = "0" + str;
        }
        return "0x" + str.toUpperCase();
    }

    asBinaryString(): string {
        return this.bitValue;
    }

    asShortHexString(): string {
        return this.asUnsignedInt().toString(16).toUpperCase();
    }

    signExtend(numBits: number): Value {
        return new Value(this.padWith(this.bitValue, this.bitValue[0], numBits), numBits);
    }

    getNumBits(): number {
        return this.numBits;
    }

    getByteBinary(byteIdx: number): string {
        if (this.numBits != 32) {
            console.log("Error");
            return null;
        }

        return this.asBinaryString().substr((3 - byteIdx) * 8, 8)
    }

    writeByte(byteIdx: number, byte: string): Value {
        if (this.numBits != 32) {
            console.log("Error");
            return null;
        }

        byteIdx = 3 - byteIdx;
        let str = this.asBinaryString();
        str = str.substring(0, byteIdx * 8) + byte + str.substr((byteIdx + 1) * 8);

        return new Value(str, 32);
    }

    private padWith(str: string, padValue: string, length: number) {
        while (str.length < length) {
            str = padValue + str;
        }
        return str;
    }

    // TODO: check if the implementations are correct
    static add(lhs: Value, rhs: Value): Value {
        return Value.fromUnsignedInt(lhs.asUnsignedInt() + rhs.asUnsignedInt(), 32);
    }

    static sub(lhs: Value, rhs: Value): Value {
        return Value.fromUnsignedInt(lhs.asUnsignedInt() - rhs.asUnsignedInt(), 32);
    }

    static and(lhs: Value, rhs: Value): Value {
        return Value.fromUnsignedInt(lhs.asUnsignedInt() & rhs.asUnsignedInt(), 32);
    }

    static or(lhs: Value, rhs: Value): Value {
        return Value.fromUnsignedInt(lhs.asUnsignedInt() | rhs.asUnsignedInt(), 32);
    }

    static xor(lhs: Value, rhs: Value): Value {
        return Value.fromUnsignedInt(lhs.asUnsignedInt() ^ rhs.asUnsignedInt(), 32);
    }

    static shiftLeftLogical(lhs: Value, rhs: Value): Value {
        return Value.fromUnsignedInt(lhs.asUnsignedInt() << rhs.asUnsignedInt(), 32);
    }

    static shiftRightLogical(lhs: Value, rhs: Value): Value {
        return Value.fromUnsignedInt(lhs.asUnsignedInt() >>> rhs.asUnsignedInt(), 32);
    }

    static shiftRightArithmetic(lhs: Value, rhs: Value): Value {
        return Value.fromUnsignedInt(lhs.asUnsignedInt() >> rhs.asUnsignedInt(), 32);
    }

    static cmp(lhs: Value, rhs: Value, signed: boolean): number {
        if (lhs.numBits != rhs.numBits) {
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

    static cmpEQ(lhs: Value, rhs: Value): boolean {
        return this.cmp(lhs, rhs, false) == 0;
    }

    static cmpNE(lhs: Value, rhs: Value): boolean {
        return this.cmp(lhs, rhs, false) != 0;
    }

    static cmpLT(lhs: Value, rhs: Value): boolean {
        return this.cmp(lhs, rhs, true) == -1;
    }

    static cmpGE(lhs: Value, rhs: Value): boolean {
        return this.cmp(lhs, rhs, true) != -1;
    }

    static cmpLTU(lhs: Value, rhs: Value): boolean {
        return this.cmp(lhs, rhs, false) == -1;
    }

    static cmpGEU(lhs: Value, rhs: Value): boolean {
        return this.cmp(lhs, rhs, false) != -1;
    }

    static main() {
        // for (let i = -4; i < 4; i++) {
        //     let v = this.fromSignedInt(i, 3);
        //     console.log(v.asBinaryString() + " " + v.asSignedInt() + " " + v.asUnsignedInt());
        // }

        //@formatter:off
        // console.log(this.cmpEQ(new Value(-10, 32), new Value( 10, 32)) == false);
        // console.log(this.cmpEQ(new Value( 10, 32), new Value(-10, 32)) == false);
        // console.log(this.cmpEQ(new Value( 10, 32), new Value( 10, 32)) == true);
        // console.log(this.cmpEQ(new Value(-10, 32), new Value(-10, 32)) == true);
        // console.log(this.cmpEQ(new Value(  9, 32), new Value(-10, 32)) == false);
        // console.log(this.cmpEQ(new Value(  9, 32), new Value( 10, 32)) == false);
        // console.log(this.cmpEQ(new Value( 11, 32), new Value( 10, 32)) == false);
        // console.log(this.cmpEQ(new Value(-11, 32), new Value( 10, 32)) == false);
        //
        // console.log("--");
        //
        // console.log(this.cmpNE(new Value(-10, 32), new Value( 10, 32)) == true);
        // console.log(this.cmpNE(new Value( 10, 32), new Value(-10, 32)) == true);
        // console.log(this.cmpNE(new Value( 10, 32), new Value( 10, 32)) == false);
        // console.log(this.cmpNE(new Value(-10, 32), new Value(-10, 32)) == false);
        // console.log(this.cmpNE(new Value(  9, 32), new Value(-10, 32)) == true);
        // console.log(this.cmpNE(new Value(  9, 32), new Value( 10, 32)) == true);
        // console.log(this.cmpNE(new Value( 11, 32), new Value( 10, 32)) == true);
        // console.log(this.cmpNE(new Value(-11, 32), new Value( 10, 32)) == true);
        //
        // console.log("--");
        //
        // console.log(this.cmpLT(new Value(-10, 32), new Value( 10, 32)) == true);
        // console.log(this.cmpLT(new Value( 10, 32), new Value(-10, 32)) == false);
        // console.log(this.cmpLT(new Value( 10, 32), new Value( 10, 32)) == false);
        // console.log(this.cmpLT(new Value(-10, 32), new Value(-10, 32)) == false);
        // console.log(this.cmpLT(new Value(  9, 32), new Value(-10, 32)) == false);
        // console.log(this.cmpLT(new Value(  9, 32), new Value( 10, 32)) == true);
        // console.log(this.cmpLT(new Value( 11, 32), new Value( 10, 32)) == false);
        // console.log(this.cmpLT(new Value(-11, 32), new Value( 10, 32)) == true);
        //
        // console.log("--");
        //
        // console.log(this.cmpGE(new Value(-10, 32), new Value( 10, 32)) == false);
        // console.log(this.cmpGE(new Value( 10, 32), new Value(-10, 32)) == true);
        // console.log(this.cmpGE(new Value( 10, 32), new Value( 10, 32)) == true);
        // console.log(this.cmpGE(new Value(-10, 32), new Value(-10, 32)) == true);
        // console.log(this.cmpGE(new Value(  9, 32), new Value(-10, 32)) == true);
        // console.log(this.cmpGE(new Value(  9, 32), new Value( 10, 32)) == false);
        // console.log(this.cmpGE(new Value( 11, 32), new Value( 10, 32)) == true);
        // console.log(this.cmpGE(new Value(-11, 32), new Value( 10, 32)) == false);
        //
        // console.log("--");
        //
        // console.log(this.cmpLTU(new Value( 10, 32), new Value( 10, 32)) == false);
        // console.log(this.cmpLTU(new Value(  9, 32), new Value( 10, 32)) == true);
        // console.log(this.cmpLTU(new Value( 11, 32), new Value( 10, 32)) == false);
        //
        // console.log("--");
        //
        // console.log(this.cmpGEU(new Value( 10, 32), new Value( 10, 32)) == true);
        // console.log(this.cmpGEU(new Value(  9, 32), new Value( 10, 32)) == false);
        // console.log(this.cmpGEU(new Value( 11, 32), new Value( 10, 32)) == true);
        //@formatter:on

    }

    static HexString(s: string, num_bits: number = 32) {
        return Value.fromUnsignedInt(parseInt(s, 16), num_bits);
    }
}

export const VAL_ZERO_32b = Value.fromUnsignedInt(0, 32);
export const VAL_ONE_32b = Value.fromUnsignedInt(1, 32);
export const VAL_TWO_32b = Value.fromUnsignedInt(2, 32);
export const VAL_THREE_32b = Value.fromUnsignedInt(3, 32);

export const VAL_ZERO_1b = Value.fromUnsignedInt(0, 1);
export const VAL_ZERO_5b = Value.fromUnsignedInt(0, 5);