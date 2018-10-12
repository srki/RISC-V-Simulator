class Graphics {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private readonly width: number;
    private readonly height: number;

    private scale: number;
    private offsetX: number;
    private offsetY: number;

    clearColor: string = "#000000";


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

        this.offsetX = (canvasWidth - this.scale * this.width) / 2;
        this.offsetY = (canvasHeight - this.scale * this.height) / 2;
    }

    clear() {
        this.ctx.fillStyle = this.clearColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    fillRect(x: number, y: number, w: number, h: number, fillStyle: string) {
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillRect(this.offsetX + x * this.scale, this.offsetY + y * this.scale, w * this.scale, h * this.scale);
    }

    line(x1: number, y1: number, x2: number, y2: number, color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetX + x1 * this.scale, this.offsetY + y1 * this.scale);
        this.ctx.lineTo(this.offsetX + x2 * this.scale, this.offsetY + y1 * this.scale);
        this.ctx.stroke();
    }

    fillPolygon(point: number[][], fillStyle: string) {
        this.ctx.fillStyle = fillStyle;
        this.ctx.beginPath();

        this.ctx.moveTo(this.offsetX + point[0][0] * this.scale, this.offsetY + point[0][1] * this.scale);
        for (let i = 1; i < point.length; i++) {
            this.ctx.lineTo(this.offsetX + point[i][0] * this.scale, this.offsetY + point[i][1] * this.scale);
        }

        this.ctx.closePath();
        this.ctx.fill();
    }

}

export {Graphics}