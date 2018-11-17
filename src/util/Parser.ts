import Value, {VAL_ZERO_32b} from "./Value";
import InstructionMemory from "../components/InstructionMemory";
import InstructionHelper from "../instructions/InstructionHelper";


export default class Parser {
    static parse(textContent : String) : Value[] {

        let ret : Value[] = [];
        let lines = textContent.split('\n');
        for(let i = 0; i < lines.length; i++) {
             ret.push(Value.HexString(lines[i]));
        }

        while(ret.length < InstructionMemory.SIZE)
            ret.push(VAL_ZERO_32b);

        return ret;
    }
}