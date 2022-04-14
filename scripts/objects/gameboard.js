MyGame.objects.Gameboard = function (assets, graphics, magic) {
    'use strict';

    const GAP_SIZE = 5;
    const ROTATION = 0;

    let board = [];

    function genBoard() {
        for (let i = 0; i < magic.GRID_SIZE; i++) {
            board.push([]);
            for (let j = 0; j < magic.GRID_SIZE; j++) {
                board[i].push({
                    x: i,
                    y: j,
                    object: null // The object here will help with pathfinding ie towers and walls
                });
                if (i == 0 || i == magic.GRID_SIZE - 1 || j == 0 || j == magic.GRID_SIZE - 1) {
                    board[i][j].object = "wall"; // make a border around the gamespace
                }
            }
        }
        console.log(board)
    }

    function render() {
        for (let row in board) {
            for (let col in board[row]) {
                let center = magic.converter.gridToPixel({ x: row, y: col })
                if (board[row][col].object == "wall") { // there is a wall here so render the wall
                    graphics.drawTexture(assets.wall, center, ROTATION, {width: magic.CELL_SIZE, height: magic.CELL_SIZE});
                }
                else if (board[row][col].object == null) { // No wall or tower at this location so render the grass
                    graphics.drawTexture(assets.grass, center, ROTATION, {width: magic.CELL_SIZE, height: magic.CELL_SIZE});
                }
            }
        }
    }

    function update() {

    }

    let api = {
        genBoard: genBoard,
        update: update,
        render: render,
        get board() { return board; },
    };

    return api;
}