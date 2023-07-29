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

    public getCurrentGeneration(): Point[] { return this.gen; }

    public getNextGeneration(): void {
        this.gen = this.nextGeneration(this.gen);
    }

    public addNewCell(cell: Point): void {
        this.gen.push(cell);
    }

    private getNumberOfLiveNeighbors(cell: Point, gen: Point[]): number {
        let count = 0;
        for (const neightbor of this.neightbors) {
            if (gen.some(c => c.x === cell.x + neightbor.x && c.y === cell.y + neightbor.y)) count++;
        }
        return count;
    }

    private nextGeneration(gen: Point[]): Point[] {
        const nextGen: Point[] = [];
        const candidates: Point[] = [];

        for (const cell of gen) {
            candidates.push(cell);
            for (const neighbor of this.neightbors) {
                candidates.push(new Point(neighbor.x + cell.x, neighbor.y + cell.y));
            }
        }

        const uniqueCandidates = Point.removeDuplicates(candidates);

        for (const candidate of uniqueCandidates) {
            const liveNeighbors = this.getNumberOfLiveNeighbors(candidate, gen);
            if (gen.some(cell => cell.x === candidate.x && cell.y === candidate.y)) {
                if (liveNeighbors === 2 || liveNeighbors === 3) {
                    nextGen.push(candidate);
                }
            } else {
                if (liveNeighbors === 3) {
                    nextGen.push(candidate);
                }
            }
        }
        return nextGen;
    }

}