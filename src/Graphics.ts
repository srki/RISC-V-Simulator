export default class Graphics {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private readonly width: number;
    private readonly height: number;

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.width = width;
        this.height = height;

        if (canvas.style.width == undefined || canvas.style.height == undefined) {
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            console.warn("Canvas width or height undefined");
        }
    }

    rescale() {
        let canvasWidth = this.canvas.clientWidth;
        let canvasHeight = this.canvas.clientHeight;

        /* Added support for Retina display */
        this.canvas.width = canvasWidth * window.devicePixelRatio;
        this.canvas.height = canvasHeight * window.devicePixelRatio;

        let scale = canvasWidth / canvasHeight > this.width / this.height ?
            canvasHeight / this.height :
            canvasWidth / this.width;

        let rescaleOffsetX = (canvasWidth - scale * this.width) / 2;
        let rescaleOffsetY = (canvasHeight - scale * this.height) / 2;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(rescaleOffsetX , rescaleOffsetY);
        this.ctx.scale(scale * window.devicePixelRatio, scale * window.devicePixelRatio);
    }

    clear(color: string) {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, color: string) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawPath(path: number[][], strokeStyle: string) {
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.beginPath();

        this.ctx.moveTo(path[0][0], path[0][1]);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i][0], path[i][1]);
        }

        this.ctx.stroke();
    }


    fillRect(x: number, y: number, w: number, h: number, fillStyle: string, strokeStyle: string) {
        this.fillPolygon([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fillStyle, strokeStyle);
    }

    fillPolygon(point: number[][], fillStyle: string, strokeStyle: string) {
        this.ctx.fillStyle = fillStyle;
        this.ctx.strokeStyle = strokeStyle;
        this.ctx.beginPath();

        this.ctx.moveTo(point[0][0], point[0][1]);
        for (let i = 1; i < point.length; i++) {
            this.ctx.lineTo(point[i][0], point[i][1]);
        }

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    fillCircle(x: number, y: number, r: number, fillStyle: string) {
        this.ctx.fillStyle = fillStyle;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawText(x: number, y: number, text: string, fontColor: string, fontSize: number) {
        this.ctx.font = fontSize + "px Monospace";
        this.ctx.fillStyle = fontColor;
        this.ctx.fillText(text, x, y);
    }

    drawTextCentered(x: number, y: number, width: number, text: string, fontColor: string, fontSize: number) {
        this.ctx.font = fontSize + "px Monospace";
        this.ctx.fillStyle = fontColor;

        let textWidth = this.ctx.measureText(text).width;

        this.ctx.fillText(text, (x + (width - textWidth) / 2), y);
    }

    static addOffset(points: number[][], xOffset: number, yOffset: number): number[][] {
        let updated: number[][] = [];

        for (let idx  in points) {
            updated.push([xOffset + points[idx][0], yOffset + points[idx][1]]);
        }

        return updated;
    }

}