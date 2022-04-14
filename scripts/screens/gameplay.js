MyGame.screens['game-play'] = (function (game, objects, assets, renderer, graphics, input, sounds, data) {
    'use strict';

    let lastTimeStamp = performance.now();

    let myKeyboard = input.Keyboard();

    let soundManager = sounds.manager();

    const GRID_SIZE = 17;
    const CELL_SIZE = graphics.canvas.width / GRID_SIZE;

    let converter = {
        gridToPixel: function(point) {
            let x = (parseInt(point.x) + .5) * CELL_SIZE;
            let y = (parseInt(point.y) + .5) * CELL_SIZE;
            return {x: x, y: y};
        },
        pixelToGrid: function(point) {
            return point;
        }
    };

    let magic = {
        GRID_SIZE: GRID_SIZE,
        CELL_SIZE: CELL_SIZE,
        CANVAS_SIZE: graphics.canvas.width,
        converter: converter,
    }

    let myGameBoard = objects.Gameboard(assets, graphics, magic);


    // Checks to see if two boxes have collided
    function checkCollision(box1, box2) {
        let collision = !(
            box2.xmin > box1.xmax ||
            box2.xmax < box1.xmin ||
            box2.ymin > box1.ymax ||
            box2.ymax < box1.ymin);
        return collision;
    }

    function loadLevel() {
        myGameBoard.genBoard();
    }

    function setControls() {
    }


    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
    }

    function render() {
        myGameBoard.render();
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        update(elapsedTime);
        processInput(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    function initialize() {
    }

    function run() {
        lastTimeStamp = performance.now();
        loadLevel();
        setControls();
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };

}(MyGame.game, MyGame.objects, MyGame.assets, MyGame.render, MyGame.graphics, MyGame.input, MyGame.sounds));