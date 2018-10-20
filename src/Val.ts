
const NUM_BITS = 32;

export default class Val {
    readonly val : boolean[];

    private constructor(val : boolean[]) {
        this.val = val;
    }

    static UnsignedInt(val : number) : Val {
        val %= 2 ** NUM_BITS;
        let arr : boolean[] = [];
        while(val != 0) {
            arr.push((val & 1) == 1);
            val >>>= 1;
        }
        return new Val(arr);
    }

    asUnsignedInt() : number {
        let ret : number = 0;
        let accum : number = 1;
        for (let bit of this.val) {
            if(bit)
                ret += accum;
            accum *= 2;
        }
        return ret;
    }

    static SignedInt(val : number) : Val {
        return new Val([]); //TODO
    }

    asSignedInt() : number{
        return 0; //TODO
    }

    asString() : string {
        let str = this.asUnsignedInt().toString(16);
        while(str.length < NUM_BITS/16)
            str = "0" + str;
        return "0x" + str;
    }
}