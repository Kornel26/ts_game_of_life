import { Point } from "./models/Point";

interface PointArraysObject {
    [key: string]: Point[];
}

export class Preset {

    public static readonly presets: PointArraysObject = {
        blinker: [
            new Point(0, 0),
            new Point(0, 1),
            new Point(0, 2)
        ],
        glider: [
            new Point(0, 0),
            new Point(1, 0),
            new Point(2, 0),
            new Point(0, 1),
            new Point(1, 2)
        ],
        toad: [
            new Point(1, 1),
            new Point(2, 1),
            new Point(3, 1),
            new Point(0, 2),
            new Point(1, 2),
            new Point(2, 2)
        ],
        beacon: [
            new Point(0, 0),
            new Point(1, 0),
            new Point(0, 1),
            new Point(3, 2),
            new Point(2, 3),
            new Point(3, 3)
        ],
        lightweightSpaceship: [
            new Point(1, 0),
            new Point(4, 0),
            new Point(0, 1),
            new Point(0, 2),
            new Point(4, 2),
            new Point(0, 3),
            new Point(1, 3),
            new Point(2, 3),
            new Point(3, 3)
        ],
        gliderGun: [
            new Point(1, 5),
            new Point(1, 6),
            new Point(2, 5),
            new Point(2, 6),
            new Point(11, 5),
            new Point(11, 6),
            new Point(11, 7),
            new Point(12, 4),
            new Point(12, 8),
            new Point(13, 3),
            new Point(13, 9),
            new Point(14, 3),
            new Point(14, 9),
            new Point(15, 6),
            new Point(16, 4),
            new Point(16, 8),
            new Point(17, 5),
            new Point(17, 6),
            new Point(17, 7),
            new Point(18, 6),
            new Point(21, 3),
            new Point(21, 4),
            new Point(21, 5),
            new Point(22, 3),
            new Point(22, 4),
            new Point(22, 5),
            new Point(23, 2),
            new Point(23, 6),
            new Point(25, 1),
            new Point(25, 2),
            new Point(25, 6),
            new Point(25, 7),
            new Point(35, 3),
            new Point(35, 4),
            new Point(36, 3),
            new Point(36, 4)
        ]
    };
    
}