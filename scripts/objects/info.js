MyGame.objects.Info = function (assets, graphics, magic, cursor) {
    'use strict';

    let coins = 1000;
    let lives = 50;
    let step = 40;
    let towerYStep = 200;
    let towerStep = 20;
    let towerOffset = .7;
    let asset_offset_y = -10;
    let asset_offset_x = -15;
    let full_offset = 0.65; // the percentage of the X_OFFSET that is padding from the right
    let placing = false;
    let towerDictionary = [];
    let currentTower = null;

    function render() {
        let x = graphics.canvas.width - (magic.X_OFFSET * full_offset);
        let y = step;
        let text = ": " + coins;
        graphics.drawTexture(assets.coin, { x: x + asset_offset_x, y: y + asset_offset_y }, 0, { x: magic.CELL_SIZE / 2, y: magic.CELL_SIZE / 2 })
        graphics.drawText(text, { x: x, y: y }, "white", "30px Arial");
        text = ": " + lives;
        graphics.drawTexture(assets.life, { x: x + asset_offset_x, y: y + asset_offset_y + step }, 0, { x: magic.CELL_SIZE / 2, y: magic.CELL_SIZE / 2 })
        graphics.drawText(text, { x: x, y: y + step }, "white", "30px Arial");

        if (placing) {
            cursor.render();
        }

        renderTowers();
    }

    function renderTowers() {
        for (let idx in towerDictionary) {
            let tower = towerDictionary[idx];
            graphics.drawRectangle({ size: { x: magic.CELL_SIZE, y: magic.CELL_SIZE }, center: tower.center, rotation: 0 }, "black", "black")
            graphics.drawTexture(tower.preview, tower.center, 0, { x: magic.CELL_SIZE * .75, y: magic.CELL_SIZE * .75 })
        }
    }

    function update(elapsedTime) {
        if (currentTower?.cost > coins) {
            cursor.blocked();
        }
    }

    function addCoins(amount) {
        coins += amount;
    }

    function hasFunds(amount) {
        if (coins >= amount) {
            return true;
        }
        return false;
    }

    function loadTowers(towers) {
        towerDictionary = towers;
        let start = graphics.canvas.width - (magic.X_OFFSET * towerOffset);
        let x = start;
        let y = towerYStep;
        for (let idx in towerDictionary) {
            towerDictionary[idx].center = { x: x, y: y };
            x += magic.CELL_SIZE + towerStep;
            if (x > graphics.canvas.width) {
                x = start;
                y += magic.CELL_SIZE + towerStep;
            }
        }
    }

    function buyTower(tower) {
        if (!placing) {
            currentTower = towerDictionary[tower];
            cursor.setPreview(currentTower.preview)
            placing = true;
        }
    }

    function cancelTower() {
        currentTower = null;
        placing = false;
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