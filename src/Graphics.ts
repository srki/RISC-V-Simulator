export default class Graphics {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private readonly width: number;
    private readonly height: number;

    private scale: number;
    private rescaleOffsetX: number;
    private rescaleOffsetY: number;

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.width = width;
        this.height = height;
    }

    rescale() {
        let canvasWidth = this.canvas.width;
        let canvasHeight = this.canvas.height;

        this.scale = canvasWidth / canvasHeight > this.width / this.height ?
            canvasHeight / this.height :
            canvasWidth / this.width;

        this.rescaleOffsetX = (canvasWidth - this.scale * this.width) / 2;
        this.rescaleOffsetY = (canvasHeight - this.scale * this.height) / 2;
    }

    clear(color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    line(x1: number, y1: number, x2: number, y2: number, color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.rescaleOffsetX + x1 * this.scale, this.rescaleOffsetY + y1 * this.scale);
        this.ctx.lineTo(this.rescaleOffsetX + x2 * this.scale, this.rescaleOffsetY + y2 * this.scale);
        this.ctx.stroke();
    }

    fillRect(x: number, y: number, w: number, h: number,
             fillStyle: string, strokeStyle: string) {
        this.fillPolygon([[x, y], [x + w, y], [x + w, y + h], [x, y +h]], fillStyle, strokeStyle);
    }

    fillPolygon(point: number[][], fillStyle: string, strokeStyle: string) {
        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.beginPath();

        this.ctx.moveTo(this.rescaleOffsetX + point[0][0] * this.scale,
            this.rescaleOffsetY + point[0][1] * this.scale);
        for (let i = 1; i < point.length; i++) {
            this.ctx.lineTo(this.rescaleOffsetX + point[i][0] * this.scale,
                this.rescaleOffsetY + point[i][1] * this.scale);
        }

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    fillCircle(x: number, y: number, r: number, fillStyle: string) {
        this.ctx.fillStyle = fillStyle;
        this.ctx.beginPath();
        this.ctx.arc(this.rescaleOffsetX + x * this.scale, this.rescaleOffsetY + y * this.scale,
            r * this.scale, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawText(x: number, y: number, text: string, fontColor: string, fontSize: number) {
        this.ctx.font = fontSize * this.scale + "px Monospace";
        this.ctx.fillStyle = fontColor;
        this.ctx.fillText(text, this.rescaleOffsetX + x * this.scale, this.rescaleOffsetY + y * this.scale);
    }

    static addOffset(points: number[][], xOffset: number, yOffset: number): number[][] {
        let updated: number[][] = [];

        for (let idx  in points) {
            updated.push([xOffset + points[idx][0], yOffset + points[idx][1]]);
        }

        return updated;
    }

}