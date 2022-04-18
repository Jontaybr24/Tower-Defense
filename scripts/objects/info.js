MyGame.objects.Info = function (assets, graphics, magic, cursor) {
    'use strict';

    let coins = 100;
    let lives = 50;
    let step = 40;
    let asset_offset_y = -10;
    let asset_offset_x = -15;
    let placing = false;
    let towerDictionary = [];
    let currentTower = null;

    function render() {
        let x = graphics.canvas.width - (2 * (magic.X_OFFSET / 3));
        let y = step;
        let text = ": " + coins;
        graphics.drawTexture(assets.coin, { x: x + asset_offset_x, y: y + asset_offset_y }, 0, { width: magic.CELL_SIZE / 2, height: magic.CELL_SIZE / 2 })
        graphics.drawText(text, { x: x, y: y }, "white", "30px Arial");
        text = ": " + lives;
        graphics.drawTexture(assets.coin, { x: x + asset_offset_x, y: y + asset_offset_y + step }, 0, { width: magic.CELL_SIZE / 2, height: magic.CELL_SIZE / 2 })
        graphics.drawText(text, { x: x, y: y + step }, "white", "30px Arial");

        if(placing){
            cursor.render();
        }
    }

    function update(elapsedTime) {
        if (currentTower?.cost > coins){
            cursor.blocked();
        }
    }

    function addCoins(amount) {
        coins += amount;
        placing = false;
    }

    function hasFunds(amount) {
        if (coins >= amount) {
            return true;
        }
        return false;
    }

    function loadTowers(towers) {
        towerDictionary = towers;
    }

    function buyTower(tower) {
        if (!placing) {
            console.log(towerDictionary[tower]);
            currentTower = towerDictionary[tower];
            placing = true;
        }
    }

    let api = {
        update: update,
        render: render,
        addCoins: addCoins,
        hasFunds: hasFunds,
        loadTowers: loadTowers,
        buyTower: buyTower,
        get placing() { return placing; }
    };

    return api;
}