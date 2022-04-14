MyGame.objects.Gameboard = function (assets, graphics, magic) {
    'use strict';

    const GAP = 5; // works best with odd numbers
    const ROTATION = 0;
    const BUFFER = 100 // time in ms for button presses to register after being held
    let timePassed = 0;

    let board = [];
    let gridOn = true;

    function genBoard() {
        for (let i = 0; i < magic.GRID_SIZE; i++) {
            board.push([]);
            for (let j = 0; j < magic.GRID_SIZE; j++) {
                board[i].push({
                    x: i,
                    y: j,
                    object: null // The object here will help with pathfinding ie towers and walls
                });
                let mid = Math.floor(magic.GRID_SIZE / 2);
                let gap = Math.floor(GAP / 2);
                // make a border around the gamespace leaving space for the enemies to spawn on the 4 sides of the map
                if (i == 0 && j < mid - gap ||
                    i == 0 && j > mid + gap ||
                    i == magic.GRID_SIZE - 1 && j < mid - gap ||
                    i == magic.GRID_SIZE - 1 && j > mid + gap ||
                    j == 0 && i < mid - gap ||
                    j == 0 && i > mid + gap ||
                    j == magic.GRID_SIZE - 1 && i < mid - gap ||
                    j == magic.GRID_SIZE - 1 && i > mid + gap) {
                    board[i][j].object = "wall";
                }
            }
        }
    }

    function render() {
        for (let row in board) {
            for (let col in board[row]) {
                let center = magic.converter.gridToPixel({ x: row, y: col })
                if (board[row][col].object == "wall") { // there is a wall here so render the wall
                    graphics.drawTexture(assets.wall, center, ROTATION, { width: magic.CELL_SIZE, height: magic.CELL_SIZE });
                }
                else if (board[row][col].object == null) { // No wall or tower at this location so render the grass
                    graphics.drawTexture(assets.grass, center, ROTATION, { width: magic.CELL_SIZE, height: magic.CELL_SIZE });
                }
            }
        }
        if (gridOn) {
            drawGrid();
        }
    }

    function drawGrid() {
        for (let slice in board) {
            let center = magic.converter.gridToPixel({ x: parseInt(slice), y: parseInt(slice) });
            let coord = + center.y + magic.CELL_SIZE / 2;
            graphics.drawLine({ x: 0, y: coord }, { x: magic.CANVAS_SIZE, y: coord }, 2, "FFFFFF");
            graphics.drawLine({ x: coord, y: 0 }, { x: coord, y: magic.CANVAS_SIZE }, 2, "FFFFFF");
        }
    }

    function toggleGrid() {
        if (timePassed > BUFFER) {
            gridOn = !gridOn;
            timePassed = 0;
        }
    }

    function update(elapsedTime) {
        timePassed += elapsedTime;
    }

    let api = {
        update: update,
        render: render,
        genBoard: genBoard,
        toggleGrid: toggleGrid,
        get board() { return board; },
    };

    return api;
}