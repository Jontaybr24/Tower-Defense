MyGame.objects.Magic = function (graphics) {
    'use strict';

    let GRID_SIZE = 0;
    let CELL_SIZE = 0;
    const MENU_SIZE = 60;
    const X_OFFSET = graphics.canvas.width - graphics.canvas.height;
    const RPS = Math.PI / 500 // 1 Rotation per second
    const CANVAS_SIZE = graphics.canvas.height

    const SELL_PRICE = 1; // The percentage you get from selling a tower

    let spawnPoints = {
        N: { x: CANVAS_SIZE / 2, y: 0 },
        E: { x: CANVAS_SIZE - CELL_SIZE, y: CANVAS_SIZE / 2 },
        W: { x: 0, y: CANVAS_SIZE / 2 },
        S: { x: CANVAS_SIZE / 2, y: CANVAS_SIZE - CELL_SIZE },
    }
    function sethitbox(thing, size) {
        thing.hitbox.ymin = thing.center.y - size.y * .45,
            thing.hitbox.ymax = thing.center.y + size.y * .45,
            thing.hitbox.xmin = thing.center.x - size.x * .45,
            thing.hitbox.xmax = thing.center.x + size.x * .45
    }
    function gridToPixel(point) {
        let x = (parseInt(point.x) + .5) * CELL_SIZE;
        let y = (parseInt(point.y) + .5) * CELL_SIZE;
        return { x: x, y: y };
    }
    function pixelToGrid(point) {
        let x = Math.floor(((point.x) / graphics.canvas.height) * GRID_SIZE);
        let y = Math.floor(((point.y) / graphics.canvas.height) * GRID_SIZE);
        return { x: x, y: y };
    }
    function mouseToGrid(point) {
        let rect = graphics.canvas.getBoundingClientRect();
        let x = Math.floor(((point.x - rect.x) / rect.height) * GRID_SIZE);
        let y = Math.floor(((point.y - rect.y) / rect.height) * GRID_SIZE);
        return { x: x, y: y };
    }
    function mouseToPixel(point) {
        let rect = graphics.canvas.getBoundingClientRect();
        let x = Math.floor(((point.x - rect.x) / rect.width) * graphics.canvas.width);
        let y = Math.floor(((point.y - rect.y) / rect.height) * graphics.canvas.height);
        return { x: x, y: y };
    }
    function magnitude(point1, point2) {
        let x = point1.x - point2.x;
        let y = point1.y - point2.y;
        return Math.sqrt((x * x) + (y * y));
    }

    // Checks to see if two boxes have collided
    function collision(box1, box2) {
        let collision = !(
            box2.xmin > box1.xmax ||
            box2.xmax < box1.xmin ||
            box2.ymin > box1.ymax ||
            box2.ymax < box1.ymin);
        return collision;
    }

    //------------------------------------------------------------------
    //
    // Returns the magnitude of the 2D cross product.  The sign of the
    // magnitude tells you which direction to rotate to close the angle
    // between the two vectors.
    //
    //------------------------------------------------------------------
    function crossProduct2d(v1, v2) {
        return (v1.x * v2.y) - (v1.y * v2.x);
    }

    //------------------------------------------------------------------
    //
    // Computes the angle, and direction (cross product) between two vectors.
    //
    //------------------------------------------------------------------
    function computeAngle(rotation, ptCenter, ptTarget) {
        let v1 = {
            x: Math.cos(rotation),
            y: Math.sin(rotation)
        };
        let v2 = {
            x: ptTarget.x - ptCenter.x,
            y: ptTarget.y - ptCenter.y
        };

        v2.len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        v2.x /= v2.len;
        v2.y /= v2.len;

        let dp = v1.x * v2.x + v1.y * v2.y;
        let angle = Math.acos(dp);

        //
        // Get the cross product of the two vectors so we can know
        // which direction to rotate.
        let cp = crossProduct2d(v1, v2);

        return {
            angle: angle,
            crossProduct: cp
        };
    }

    //------------------------------------------------------------------
    //
    // Simple helper function to help testing a value with some level of tolerance.
    //
    //------------------------------------------------------------------
    function testTolerance(value, test, tolerance) {
        if (Math.abs(value - test) < tolerance) {
            return true;
        } else {
            return false;
        }
    }

    function computeVelocity(position, target) {
        let x = position.x - target.x;
        let y = position.y - target.y;
        let angle = Math.atan(y / x);
        if (x < 0) {
            y = Math.sin(angle);
            x = Math.cos(angle);
        }
        else {
            y = Math.sin(angle) * -1;
            x = Math.cos(angle) * -1;
        }
        if (x == 0) {
            x = 0;
        }
        if (y == 0) {
            y = 0;
        }
        return { x: x, y: y }
    }

    function computeRotation(vel) {
        return Math.atan2(vel.y, vel.x);
    }

    // returns a velocity when given an angle
    function computeFromRot(rot) {
        return { x: Math.cos(rot), y: Math.sin(rot) }
    }

    function setGridSize(size) {
        GRID_SIZE = size;
        CELL_SIZE = graphics.canvas.height / GRID_SIZE;
        spawnPoints = {
            N: { x: CANVAS_SIZE / 2, y: 0 },
            E: { x: CANVAS_SIZE - CELL_SIZE, y: CANVAS_SIZE / 2 },
            W: { x: 0, y: CANVAS_SIZE / 2 },
            S: { x: CANVAS_SIZE / 2, y: CANVAS_SIZE - CELL_SIZE },
        }
    }

    let pallets = {
        fire: [
            "#c44910",
            "#ff5b0f",
            "#545454",
            "#ed7300",
            "#ff8c21"
        ],
        smoke: [
            "#c44910",
            "#ff5b0f",
            "#545454",
            "#ff8c21",
            "#454545",
            "#38312b",
            "#1c1c1c"
        ],
        ice: [
            "#0586ff",
            "#b0d9ff",
            "#5890c4",
            "#5cb0ff"
        ],
        acid: [
            "#0cfa00",
            "#079400",
            "#58db2c",
            "#53bf00"
        ]
    }

    let api = {
        gridToPixel: gridToPixel,
        pixelToGrid: pixelToGrid,
        mouseToGrid: mouseToGrid,
        mouseToPixel: mouseToPixel,
        magnitude: magnitude,
        collision: collision,
        sethitbox: sethitbox,
        computeAngle: computeAngle,
        testTolerance: testTolerance,
        computeVelocity: computeVelocity,
        computeRotation: computeRotation,
        computeFromRot: computeFromRot,
        setGridSize: setGridSize,
        get spawnPoints() { return spawnPoints },
        get GRID_SIZE() { return GRID_SIZE; },
        get CELL_SIZE() { return CELL_SIZE; },
        get X_OFFSET() { return X_OFFSET; },
        get MENU_SIZE() { return MENU_SIZE; },
        get RPS() { return RPS; },
        get CANVAS_SIZE() { return CANVAS_SIZE; },
        get SELL_PRICE() { return SELL_PRICE; },
        get pallets() { return pallets; },
    };

    return api;
}