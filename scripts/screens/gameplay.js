MyGame.screens['game-play'] = (function (game, objects, assets, renderer, graphics, input, sounds, data) {
    'use strict';

    let lastTimeStamp = performance.now();

    let myKeyboard = input.Keyboard();
    let myMouse = input.Mouse();

    let soundManager = sounds.manager();

    const GRID_SIZE = 17;
    const CELL_SIZE = graphics.canvas.width / GRID_SIZE;

    let converter = {
        gridToPixel: function (point) {
            let x = (parseInt(point.x) + .5) * CELL_SIZE;
            let y = (parseInt(point.y) + .5) * CELL_SIZE;
            return { x: x, y: y };
        },
        mouseToGrid: function (point) {
            let rect = graphics.canvas.getBoundingClientRect();
            let x = Math.floor(((point.x - rect.x) / rect.width) * GRID_SIZE);
            let y = Math.floor(((point.y - rect.y) / rect.width) * GRID_SIZE);
            return { x: x, y: y };
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


    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
    }

    function update(elapsedTime) {
        myGameBoard.update(elapsedTime);
    }

    function render() {
        myGameBoard.render();
    }

    function setControls() {
        myKeyboard.register('g', myGameBoard.toggleGrid);
        myMouse.register('mousedown', function (e) {
            let coords = magic.converter.mouseToGrid({ x: e.clientX, y: e.clientY })
            if (e.ctrlKey)
                myGameBoard.removeObject(coords);
            else
                myGameBoard.addObject(coords, "wall");
        })
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