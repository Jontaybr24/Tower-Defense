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
            if (tower.selected)
                graphics.drawRectangle({ size: { x: magic.CELL_SIZE, y: magic.CELL_SIZE }, center: tower.center, rotation: 0 }, "rgba(255, 255, 255, .5)", "black")

        }
    }

    function update(elapsedTime) {
        cursor.blocked(currentTower?.cost > coins);
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
            towerDictionary[idx].hitbox = {
                xmin: towerDictionary[idx].center.x - magic.CELL_SIZE / 2,
                xmax: towerDictionary[idx].center.x + magic.CELL_SIZE / 2,
                ymin: towerDictionary[idx].center.y - magic.CELL_SIZE / 2,
                ymax: towerDictionary[idx].center.y + magic.CELL_SIZE / 2,
            }
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
            cursor.setPreview(currentTower)
            placing = true;
        }
    }

    function cancelTower() {
        currentTower = null;
        placing = false;
    }

    function checkHover(point) {
        for (let idx in towerDictionary) {
            let tower = towerDictionary[idx];
            let box1 = tower.hitbox;

            let collision = !(
                point.x > box1.xmax ||
                point.x < box1.xmin ||
                point.y > box1.ymax ||
                point.y < box1.ymin);
            towerDictionary[idx].selected = collision;
            if (collision){
                buyTower(tower.name)
            }
        }
    }

    function checkBuy() {
        placing = false;
        for (let idx in towerDictionary) {
            let tower = JSON.parse(JSON.stringify(towerDictionary[idx]));
            if (tower.selected) {
                buyTower(idx)
            }
        }
    }

    let api = {
        update: update,
        render: render,
        addCoins: addCoins,
        hasFunds: hasFunds,
        loadTowers: loadTowers,
        buyTower: buyTower,
        checkHover: checkHover,
        checkBuy: checkBuy,
        get placing() { return placing; }
    };

    return api;
}