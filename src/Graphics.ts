class Graphics {
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

    fillRect(offsetX: number, offsetY: number, x: number, y: number, w: number, h: number, fillStyle: string) {
        offsetX = offsetX * this.scale + this.rescaleOffsetX;
        offsetY = offsetY * this.scale +  this.rescaleOffsetY;

        this.ctx.fillStyle = fillStyle;
        this.ctx.fillRect(offsetX + x * this.scale, offsetY + y * this.scale,
            w * this.scale, h * this.scale);
    }

    line(x1: number, y1: number, x2: number, y2: number, color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.rescaleOffsetX + x1 * this.scale, this.rescaleOffsetY + y1 * this.scale);
        this.ctx.lineTo(this.rescaleOffsetX + x2 * this.scale, this.rescaleOffsetY + y2 * this.scale);
        this.ctx.stroke();
    }

    fillPolygon(offsetX: number, offsetY: number, point: number[][], fillStyle: string, strokeStyle: string) {
        offsetX = offsetX * this.scale + this.rescaleOffsetX;
        offsetY = offsetY * this.scale +  this.rescaleOffsetY;

        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.beginPath();

        this.ctx.moveTo(offsetX + point[0][0] * this.scale, offsetY + point[0][1] * this.scale);
        for (let i = 1; i < point.length; i++) {
            this.ctx.lineTo(offsetX + point[i][0] * this.scale, offsetY + point[i][1] * this.scale);
        }

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    fillCircle(offsetX: number, offsetY: number, x : number, y: number, r: number, fillStyle: string) {
        offsetX = offsetX * this.scale + this.rescaleOffsetX;
        offsetY = offsetY * this.scale +  this.rescaleOffsetY;

        this.ctx.fillStyle = fillStyle;
        this.ctx.beginPath();
        this.ctx.arc(offsetX + x * this.scale, offsetY + y * this.scale, r* this.scale,
            0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawText(offsetX: number, offsetY: number, text: string, fontColor: string, fontSize: number) {
        offsetX = offsetX * this.scale + this.rescaleOffsetX;
        offsetY = offsetY * this.scale +  this.rescaleOffsetY;

        this.ctx.font = fontSize * this.scale + "px Monospace";
        this.ctx.fillStyle = fontColor;
        this.ctx.fillText(text, offsetX, offsetY);
    }

}

export {Graphics}