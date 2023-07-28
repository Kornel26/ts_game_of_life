import { Utils } from "./utils";
import { Point } from "./models/Point";
import { GameOfLife } from "./gameoflife";

export class Canvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private gol: GameOfLife;

    private mousexyHtml: HTMLSpanElement;

    private origo: Point = new Point();
    private mousePos: Point = new Point();
    private dragStart: Point = new Point();
    private dragEnd: Point = new Point();
    private isDrag: boolean = false;

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

        this.gol = new GameOfLife([new Point(17, 49), new Point(3, 18), new Point(28, 31), new Point(45, 5), new Point(9, 44),
        new Point(38, 25), new Point(27, 42), new Point(21, 9), new Point(12, 33), new Point(47, 46),
        new Point(13, 4), new Point(2, 19), new Point(39, 47), new Point(43, 30), new Point(36, 24),
        new Point(31, 8), new Point(26, 40), new Point(25, 37), new Point(7, 11), new Point(35, 37)]);

        this.mousexyHtml = document.querySelector('#mousepos') as HTMLSpanElement;
        this.registerEventHandlers();
        this.draw();
    }

    private registerEventHandlers(): void {
        this.canvas.addEventListener('mousemove', Utils.throttle((e: MouseEvent) => {
            let x: number = e.x - this.canvas.offsetLeft;
            let y: number = e.y - this.canvas.offsetTop;
            this.mousePos.x = x;
            this.mousePos.y = y;
            this.mousexyHtml.innerText = `x: ${this.mousePos.x} y: ${this.mousePos.y}`;
            if (this.isDrag) {
                this.draw();
            }
        }, 8));

        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            let x: number = e.x - this.canvas.offsetLeft;
            let y: number = e.y - this.canvas.offsetTop;
            if (!this.isDrag) {
                this.dragStart = new Point(x, y);
                this.isDrag = true;
            }
        });

        this.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            let x: number = e.x - this.canvas.offsetLeft;
            let y: number = e.y - this.canvas.offsetTop;
            if (this.isDrag) {
                this.dragEnd = new Point(x, y);
                this.isDrag = false;
                const draggedX: number = this.dragEnd.x - this.dragStart.x;
                const draggedY: number = this.dragEnd.y - this.dragStart.y;

                const draggedCellsX: number = Math.round(draggedX / this.cellSize);
                const draggedCellsY: number = Math.round(draggedY / this.cellSize);

                this.origo = new Point(this.origo.x + draggedCellsX, this.origo.y + draggedCellsY);

                this.draw();
            }
        });

        this.canvas.addEventListener('wheel', Utils.throttle((e: WheelEvent) => {
            const wheelDirection = e.deltaY > 0;
            if (!wheelDirection && this.maxCellSize > this.cellSize) {
                this.cellSize++;
            }
            if (wheelDirection && this.minCellSize < this.cellSize) {
                this.cellSize--;
            }
            this.draw();
        }, 10));
    }

    private draw() {
        this.canvas.width = this.maxWidth - this.maxWidth % this.cellSize;
        this.canvas.height = this.maxHeight - this.maxHeight % this.cellSize;
        if (this.isDrag) {
            this.ctx.translate(this.mousePos.x - this.dragStart.x, this.mousePos.y - this.dragStart.y);
        }
        this.clear();
        this.drawGrid();
        this.drawCells();
    }

    private drawCells(): void {
        const cells: Point[] = this.gol.getCurrentGeneration();
        cells.forEach((cell) => {
            this.ctx.fillRect(this.origo.x * this.cellSize + cell.x * this.cellSize, this.origo.y * this.cellSize + cell.y * this.cellSize, this.cellSize, this.cellSize);
        });
    }

    private drawGrid(): void {
        // Draw vertical lines
        for (let x = -this.canvas.width; x < this.canvas.width * 2; x += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, -this.canvas.height);
            this.ctx.lineTo(x, this.canvas.height * 2);
            this.ctx.stroke();
        }
        // Draw horizontal lines
        for (let y = -this.canvas.height; y < this.canvas.height * 2; y += this.cellSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(-this.canvas.width, y);
            this.ctx.lineTo(this.canvas.width * 2, y);
            this.ctx.stroke();
        }
    }

    private clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
