MyGame.objects.Magic = function (graphics) {
    'use strict';

    const GRID_SIZE = 17;
    const CELL_SIZE = graphics.canvas.height / GRID_SIZE;
    const MENU_SIZE = 60;
    const X_OFFSET = graphics.canvas.width - graphics.canvas.height;
    const RPS = Math.PI / 500 // 1 Rotation per second
    const CANVAS_SIZE = graphics.canvas.height
    let spawnPoints = {
        N: { x: CANVAS_SIZE / 2, y: 0 },
        E: { x: CANVAS_SIZE-GRID_SIZE, y: CANVAS_SIZE / 2 },
        W: { x: 0, y: CANVAS_SIZE / 2 },
        S: { x: CANVAS_SIZE / 2, y: CANVAS_SIZE-GRID_SIZE },
      }
    function sethitbox(thing){
        
        thing.hitbox.xmax = thing.center.x;
        thing.hitbox.xmin =  thing.center.x -CELL_SIZE;
        thing.hitbox.ymin = thing.center.y-CELL_SIZE+2;
        thing.hitbox.ymax = thing.center.y-2;
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
        get spawnPoints(){return spawnPoints},
        get GRID_SIZE() { return GRID_SIZE; },
        get CELL_SIZE() { return CELL_SIZE; },
        get X_OFFSET() { return X_OFFSET; },
        get MENU_SIZE() {return MENU_SIZE;},
        get RPS() { return RPS; },
        get CANVAS_SIZE() { return CANVAS_SIZE; },
    };

    return api;
}