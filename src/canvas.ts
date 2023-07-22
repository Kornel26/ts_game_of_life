import { Utils } from "./utils";
import { Point } from "./models/Point";

export class Canvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private mousexyHtml: HTMLSpanElement;

    private origo: Point = new Point();
    private mousePos: Point = new Point();

    private cellSize: number = 30;
    private maxCellSize: number = 50;
    private minCellSize: number = 10;

    private maxWidth: number;
    private maxHeight: number;

    constructor(width: number, height: number) {
        this.canvas = document.querySelector('#canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.maxWidth = width - 50;
        this.maxHeight = height - 50;
        this.canvas.width = this.maxWidth;
        this.canvas.height = this.maxHeight;

        this.mousexyHtml = document.querySelector('#mousepos') as HTMLSpanElement;
        this.registerEventHandlers();
        this.draw();
    }

    registerEventHandlers(): void {
        this.canvas.addEventListener('mousemove', Utils.throttle((e: MouseEvent) => {
            let x: number = e.x - this.canvas.offsetLeft;
            let y: number = e.y - this.canvas.offsetTop;
            this.mousePos.x = x;
            this.mousePos.y = y;
            this.mousexyHtml.innerText = `x: ${this.mousePos.x} y: ${this.mousePos.y}`;
        }, 8));

        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            let x: number = e.x - this.canvas.offsetLeft;
            let y: number = e.y - this.canvas.offsetTop;
        });

        this.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            let x: number = e.x - this.canvas.offsetLeft;
            let y: number = e.y - this.canvas.offsetTop;
        });

        this.canvas.addEventListener('wheel', Utils.throttle((e: WheelEvent) => {
            const wheelDirection = e.deltaY > 0;
            if(!wheelDirection && this.maxCellSize > this.cellSize) this.cellSize++;
            if(wheelDirection && this.minCellSize < this.cellSize) this.cellSize--;
            this.draw();
        }, 10));
    }

    draw() {
        this.canvas.width = this.maxWidth - this.maxWidth % this.cellSize;
        console.log(this.canvas.width);
        this.canvas.height = this.maxHeight - this.maxHeight % this.cellSize;
        this.drawGrid();
    }

    drawGrid(): void {
        // Draw vertical lines
        for (let x = 0; x < this.canvas.width; x += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        // Draw horizontal lines
        for (let y = 0; y < this.canvas.height; y += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
