/**
    Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overpopulation.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 */

import type { Point } from "./models/Point";

export class GameOfLife {

    private array: Point[] = [];

    constructor(array: Point[] = []){
        this.array = array;
    }

    

}