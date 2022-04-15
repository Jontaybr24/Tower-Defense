MyGame.screens['game-play'] = (function (game, objects, assets, renderer, graphics, input, sounds, data) {
    'use strict';

    let lastTimeStamp = performance.now();

    let myKeyboard = input.Keyboard();
    let myMouse = input.Mouse();

    let soundManager = sounds.manager();

    const GRID_SIZE = 17;
    const CELL_SIZE = graphics.canvas.height / GRID_SIZE;
    const X_OFFSET = graphics.canvas.width - graphics.canvas.height;
    console.log(X_OFFSET);

    let converter = {
        gridToPixel: function (point) {
            let x = (parseInt(point.x) + .5) * CELL_SIZE;
            let y = (parseInt(point.y) + .5) * CELL_SIZE;
            return { x: x, y: y };
        },
        pixelToGrid: function (point) {
            let x = Math.floor(((point.x) / graphics.canvas.width) * GRID_SIZE);
            let y = Math.floor(((point.y) / graphics.canvas.height) * GRID_SIZE);
            return { x: x, y: y };
        },
        mouseToGrid: function (point) {            
            let rect = graphics.canvas.getBoundingClientRect();
            let x = Math.floor(((point.x - rect.x) / rect.height) * GRID_SIZE);
            let y = Math.floor(((point.y - rect.y) / rect.height) * GRID_SIZE);
            return { x: x, y: y };
        }
    };

    let magic = {
        GRID_SIZE: GRID_SIZE,
        CELL_SIZE: CELL_SIZE,
        X_OFFSET: X_OFFSET,
        CANVAS_SIZE: graphics.canvas.width,
        converter: converter,
    }

    let myGameBoard = objects.Gameboard(assets, graphics, magic);
    let myParticles = objects.Particles(assets, graphics, magic);


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
        myParticles.update(elapsedTime);
    }

    function render() {
        graphics.clear();
        myGameBoard.render();
        myParticles.render();
    }

    function setControls() {
        myKeyboard.register(data.controls.grid.key, myGameBoard.toggleGrid);
        myMouse.register('mousedown', function (e) {
            let coords = converter.mouseToGrid({ x: e.clientX, y: e.clientY })
            console.log(e)
            if (e.ctrlKey)
                myGameBoard.removeObject(coords);
            else
                myParticles.makeCoin(converter.gridToPixel(coords));
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

}(MyGame.game, MyGame.objects, MyGame.assets, MyGame.render, MyGame.graphics, MyGame.input, MyGame.sounds, MyGame.data));