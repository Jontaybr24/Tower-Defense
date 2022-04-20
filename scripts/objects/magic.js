MyGame.objects.Magic = function (graphics) {
    'use strict';

    const GRID_SIZE = 17;
    const CELL_SIZE = graphics.canvas.height / GRID_SIZE;
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


    let api = {
        gridToPixel: gridToPixel,
        pixelToGrid: pixelToGrid,
        mouseToGrid: mouseToGrid,
        mouseToPixel: mouseToPixel,
        magnitude: magnitude,
        collision: collision,
        sethitbox: sethitbox,
        get spawnPoints(){return spawnPoints},
        get GRID_SIZE() { return GRID_SIZE; },
        get CELL_SIZE() { return CELL_SIZE; },
        get X_OFFSET() { return X_OFFSET; },
        get RPS() { return RPS; },
        get CANVAS_SIZE() { return CANVAS_SIZE; },
    };

    return api;
}