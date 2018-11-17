import Val, {VAL_ZERO_32b} from "./Val";
import InstructionMemory from "../components/InstructionMemory";
import InstructionHelper from "../instructions/InstructionHelper";


export default class Parser {
    static parse(textContent : String) : Val[] {

        let ret : Val[] = [];
        let lines = textContent.split('\n');
        for(let i = 0; i < lines.length; i++) {
             ret.push(Val.HexString(lines[i]));
        }

        while(ret.length < InstructionMemory.SIZE)
            ret.push(VAL_ZERO_32b);

        return ret;
    }
}