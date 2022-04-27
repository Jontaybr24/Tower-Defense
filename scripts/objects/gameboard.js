MyGame.objects.Gameboard = function (assets, graphics, magic) {
    'use strict';

    const ROTATION = 0;
    let timePassed = 0;

    let board = [];
    let gridOn = MyGame.data.toggleGrid; // The grid is off by default

    function genBoard(data) {
        gridOn = MyGame.data.toggleGrid;
        board = [];
        for (let i = 0; i < data.size; i++) {
            board.push([]);
            for (let j = 0; j < data.size; j++) {
                board[i].push({
                    x: i,
                    y: j,
                    object: null, // The object here will help with pathfinding ie towers and walls
                });
                let mid = Math.floor(data.size / 2);
                let gap = Math.floor(data.gap / 2);
                // make a border around the gamespace leaving space for the enemies to spawn on the 4 sides of the map
                if (i == 0 && j < mid - gap ||
                    i == 0 && j > mid + gap ||
                    i == data.size - 1 && j < mid - gap ||
                    i == data.size - 1 && j > mid + gap ||
                    j == 0 && i < mid - gap ||
                    j == 0 && i > mid + gap ||
                    j == data.size - 1 && i < mid - gap ||
                    j == data.size - 1 && i > mid + gap) {
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
        gridOn = !gridOn;
        MyGame.data.toggleGrid = gridOn;
        localStorage['data'] = JSON.stringify(MyGame.data);
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
        if (point.x < board.length - 1 && point.y < board.length - 1 && point.x > 0 && point.y > 0 || board[point.x][point.y].object == "Cursor") {            
            copy = JSON.parse(JSON.stringify(board[point.x][point.y].object));
            board[point.x][point.y].object = null;
        }
        return copy;
    }

    function checkCell(point) {
        if (point.x < board.length && point.y < board.length && point.x >= 0 && point.y >= 0) {
            return (board[point.x][point.y].object == null) // will return true if the cell is empty
        }
        return false;
    }

    function getObject(point) {
        if (point.x < board.length && point.y < board.length && point.x >= 0 && point.y >= 0) {
            return board[point.x][point.y].object;
        }
        return null;
    }

    let api = {
        update: update,
        render: render,
        genBoard: genBoard,
        toggleGrid: toggleGrid,
        addObject: addObject,
        removeObject: removeObject,
        checkCell: checkCell,
        getObject: getObject,
        get board() { return board; },
    };

    return api;
}