import {Component} from "./Component";
import {Graphics} from "./Graphics";
import {Config} from "./Config";

class Memory extends Component {
    private readonly size: number = 32;
    private values: number[] = [];

    constructor(x: number, y: number) {
        super(x, y);
        for (let i = 0; i < this.size; i++) {
            this.values.push(i);
        }
    }


    draw(g: Graphics): void {
        g.fillRect(this.x, this.y, 0, 0, 100, this.size * 15 + 20,
            Config.elementFillColor, Config.elementStrokeColor);

        for (let i = 0; i < this.size; i++) {
            g.fillRect(this.x + 10, this.y + 10, 0, i * 15, 80, 15,
                Config.memoryFillColor, Config.memoryStrokeColor);
            g.drawText(this.x + 10 + 5, this.y + 10 + 12 + i * 15, this.formatValue(i),
                Config.fontColor, 12);
        }
    }

    private formatValue(idx: number): string {
        let formatted = this.values[idx].toString(16);
        while (formatted.length < 8) {
            formatted = "0" + formatted;
        }

        return "0x" + formatted;
    }

}

export {Memory}