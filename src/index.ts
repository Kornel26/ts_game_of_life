import { Canvas } from "./canvas";
import { Point } from "./models/Point";

const glider: Point[] = [
    { x: 1, y: 0 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
];


const firstGen: Point[] = [new Point(10, 10), new Point(10, 11), new Point(10, 12)];
new Canvas(window.innerWidth, window.innerHeight, glider);