MyGame.objects.Gameboard = function (assets, graphics, magic) {
    'use strict';

    const GAP = 5; // works best with odd numbers
    const ROTATION = 0;
    const BUFFER = 100 // time in ms for button presses to register after being held
    let timePassed = 0;

    let board = [];
    let gridOn = false; // The grid is off by default

    function genBoard() {
        for (let i = 0; i < magic.GRID_SIZE; i++) {
            board.push([]);
            for (let j = 0; j < magic.GRID_SIZE; j++) {
                board[i].push({
                    x: i,
                    y: j,
                    object: null, // The object here will help with pathfinding ie towers and walls
                    visited: false // to see where you have been in pathfinding 
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
                let center = magic.gridToPixel({ x: row, y: col })
                graphics.drawTexture(assets.snow, center, ROTATION, { x: magic.CELL_SIZE, y: magic.CELL_SIZE }); // Renders grass in every cell incase the tower has transperency
                if (board[row][col].object == "wall") { // there is a wall here so render the wall
                    graphics.drawTexture(assets.wall, center, ROTATION, { x: magic.CELL_SIZE, y: magic.CELL_SIZE });
                }
                else if (board[row][col].object != null){
                    graphics.drawTexture(assets.snow_imprint, center, ROTATION, { x: magic.CELL_SIZE, y: magic.CELL_SIZE });}
            }
        }
        if (gridOn) {
            drawGrid();
        }
    }

    function drawGrid() {
        let fillStyle = "rgba(0, 0, 0, .25)";
        let strokeStyle = "black"
        for (let row in board) {
            for (let col in board) {
                if (fillStyle == "rgba(0, 0, 0, .25)")
                    fillStyle = "rgba(50, 50, 50, .25)";
                else
                    fillStyle = "rgba(0, 0, 0, .25)";
                let center = magic.gridToPixel({ x: row, y: col })
                let rect = { size: { x: magic.CELL_SIZE, y: magic.CELL_SIZE }, center: center, rotation: 0 }
                graphics.drawRectangle(rect, fillStyle, strokeStyle)
            }
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

    function addObject(point, obj) {
        if (point.x < board.length && point.y < board.length) {
            board[point.x][point.y].object = obj;
        }
    }

    function removeObject(point) {
        let copy = null;
        if (point.x < board.length && point.y < board.length && point.x > 0 && point.y > 0) {
            copy = JSON.parse(JSON.stringify(board[point.x][point.y].object));
            board[point.x][point.y].object = null;
        }
        return copy;
    }

    function checkCell(point) {
        if (point.x < board.length && point.y < board.length && point.x >= 0 && point.y >= 0) {
            return (board[point.x][point.y].object == null /*|| board[point.x][point.y].object == "Cursor"*/) // will return true if the cell is empty
        }
        return false;
    }

    let api = {
        update: update,
        render: render,
        genBoard: genBoard,
        toggleGrid: toggleGrid,
        addObject: addObject,
        removeObject: removeObject,
        checkCell: checkCell,
        get board() { return board; },
    };

    return api;
}