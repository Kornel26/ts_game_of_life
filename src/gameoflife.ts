/**
    Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overpopulation.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */

import { Point } from "./models/Point";

export class GameOfLife {

    private readonly neightbors: Point[] = [
        new Point(-1, -1), new Point(0, -1), new Point(1, -1),
        new Point(-1, 0), new Point(1, 0),
        new Point(-1, 1), new Point(0, 1), new Point(1, 1),
    ];

    private gen: Point[];

    constructor(gen: Point[] = []) {
        this.gen = gen;
    }

    public getCurrentGeneration() { return this.gen; }

    private getNumberOfLiveNeighbors(cell: Point, gen: Point[]): number {
        let count = 0;
        for (const neightbor of this.neightbors) {
            if(gen.some(c => c.x === cell.x + neightbor.x && c.y === cell.y + neightbor.y)) count++;
        }        
        return count;
    }

}