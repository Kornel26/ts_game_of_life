import { Utils } from "./utils";
import { Point } from "./models/Point";
import { GameOfLife } from "./gameoflife";

export class Canvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private mainLoopTimer: number = 100;
    private isMainLoopOn: boolean = false;

    private gol: GameOfLife;

    private speedHtml: HTMLInputElement;
    private mainLoopHtml: HTMLButtonElement;

    private origo: Point = new Point();
    private mousePos: Point = new Point();
    private dragStart: Point = new Point();
    private dragEnd: Point = new Point();
    private isDrag: boolean = false;

    private cellSize: number = 30;
    private maxCellSize: number = 50;
    private minCellSize: number = 5;

    private readonly margin: number = 50;
    private maxWidth!: number;
    private maxHeight!: number;
    private canvasTop!: number;
    private canvasLeft!: number;

    constructor(width: number, height: number, gen?: Point[]) {
        this.speedHtml = document.querySelector('#speed') as HTMLInputElement;
        this.speedHtml.value = `${this.mainLoopTimer}`;
        this.mainLoopHtml = document.querySelector('#mainloopbtn') as HTMLButtonElement;
        this.canvas = document.querySelector('#canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.gol = new GameOfLife(gen ? gen : []);

        this.resize(width, height);
        this.registerEventHandlers();
        this.draw();
        this.mainLoop();
    }

    private mainLoop = (): void => {
        if (this.isMainLoopOn) {
            this.gol.getNextGeneration();
            this.draw();
        }

        setTimeout(this.mainLoop, this.mainLoopTimer);
    }

    private resize(width: number, height: number) {
        this.maxWidth = width - this.margin;
        this.maxHeight = height - this.margin;
        this.canvas.width = this.maxWidth;
        this.canvas.height = this.maxHeight;
        this.canvasTop = this.canvas.getBoundingClientRect().top;
        this.canvasLeft = this.canvas.getBoundingClientRect().left;
        this.draw();
    }

    private registerEventHandlers(): void {
        this.canvas.addEventListener('mousemove', Utils.throttle((e: MouseEvent) => {
            const x: number = e.x - this.canvas.offsetLeft;
            const y: number = e.y - this.canvas.offsetTop;
            this.mousePos.x = x;
            this.mousePos.y = y;
            if (this.isDrag) {
                this.draw();
            }
        }, 8));

        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            const x: number = e.x - this.canvas.offsetLeft;
            const y: number = e.y - this.canvas.offsetTop;
            if (!this.isDrag) {
                this.dragStart = new Point(x, y);
                this.isDrag = true;
            }
        });

        this.canvas.addEventListener('mouseup', (e: MouseEvent) => {
            const x: number = e.x - this.canvas.offsetLeft;
            const y: number = e.y - this.canvas.offsetTop;
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

        this.speedHtml.addEventListener('change', (e: any) => {
            this.mainLoopTimer = parseInt(this.speedHtml.value);
        });

        this.canvas.addEventListener('click', (e: MouseEvent) => {
            if (!Point.arePointsEqual(this.dragStart, this.dragEnd)) return;
            const x: number = e.x - this.canvasLeft - this.origo.x * this.cellSize;
            const y: number = e.y - this.canvasTop - this.origo.y * this.cellSize;
            const pointX: number = Math.floor(x / this.cellSize);
            const pointY: number = Math.floor(y / this.cellSize);
            this.gol.addNewCell(new Point(pointX, pointY));
            this.draw();
        });

        this.mainLoopHtml.addEventListener('click', (e: Event) => {
            this.isMainLoopOn = !this.isMainLoopOn;
            this.mainLoopHtml.classList.toggle('start');
            this.mainLoopHtml.classList.toggle('stop');
            this.mainLoopHtml.innerText = this.isMainLoopOn ? `Stop` : `Start`;
        });

        window.addEventListener('resize', (e: Event) => {
            this.resize(window.innerWidth, window.innerHeight);
        });
    }

    private draw() {
        this.canvas.width = this.maxWidth - this.maxWidth % this.cellSize;
        this.canvas.height = this.maxHeight - this.maxHeight % this.cellSize;
        this.canvasTop = this.canvas.getBoundingClientRect().top;
        this.canvasLeft = this.canvas.getBoundingClientRect().left;
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
        this.ctx.save();
        this.ctx.strokeStyle = 'lightblue';
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
        this.ctx.restore();
    }

    private clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
