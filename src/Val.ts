export default class Val {
    readonly val: number;
    readonly num_bits: number;

    private static mod(n: number, m: number): number {
        return ((n % m) + m) % m;
    }

    constructor(val: number = 0, num_bits: number) {
        this.num_bits = num_bits;
        this.val = val;
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

    asShortHexString(): string {
        return this.asUnsignedInt().toString(16).toLocaleUpperCase();
    }

    getNumBits(): number {
        return this.num_bits;
    }

    static main() {
        console.log("hello world");

        console.log(this.UnsignedInt(12345).asSignedInt());
        console.log(this.UnsignedInt(-123).asSignedInt());
        console.log(this.UnsignedInt(123231).asSignedInt());
        console.log(this.UnsignedInt(123412).asSignedInt());
        console.log(this.UnsignedInt(2 ** 32).asSignedInt());
        console.log(this.UnsignedInt(2 ** 32 - 1).asSignedInt());
        console.log(this.UnsignedInt(2 ** 32 + 1).asSignedInt());

        console.log(this.SignedInt(1).asSignedInt());
        console.log(this.SignedInt(0).asSignedInt());
        console.log(this.SignedInt(-1).asSignedInt());

        console.log(this.SignedInt(-1234567).asSignedInt());
        console.log(this.SignedInt(7654321).asSignedInt());
        console.log(this.SignedInt(999999999999999).asHexString());


    }

}

export const ZERO_VAL_0 = Val.UnsignedInt(0, 0);
export const ZERO_VAL_32 = Val.UnsignedInt(0, 32);
export const ZERO_VAL_5 = Val.UnsignedInt(0, 5);