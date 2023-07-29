export class Point {

    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public static arePointsEqual(point1: Point, point2: Point): boolean {
        return point1.x === point2.x && point1.y === point2.y;
    }

    public static removeDuplicates(points: Point[]): Point[] {
        const uniquePoints: Point[] = [];
        points.forEach(point => {
            if (!uniquePoints.some(uniquePoint => this.arePointsEqual(uniquePoint, point))) {
                uniquePoints.push(point);
            }
        });
        return uniquePoints;
    }

}