MyGame.objects.Info = function (assets, graphics, magic, cursor, sounds) {
    'use strict';

    let coins = 2000;
    let lives = 50;
    let wave = 0;
    let step = 40;
    let padding = 45;
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
        if (placing) {
            cursor.render();
        }
        graphics.drawRectangle({ center: { x: graphics.canvas.width - magic.X_OFFSET / 2, y: graphics.canvas.height / 2 }, size: { x: magic.X_OFFSET, y: graphics.canvas.height } }, "#572c15", "black")
        let x = graphics.canvas.width - (magic.X_OFFSET * full_offset);
        let y = step;

        let text = "Wave: " + wave;
        graphics.drawText(text, { x: x - 30, y: y }, "white", "30px Arial");
        text = ": " + coins;
        graphics.drawTexture(assets.coin, { x: x + asset_offset_x, y: y + asset_offset_y + padding }, 0, { x: magic.MENU_SIZE / 2, y: magic.MENU_SIZE / 2 })
        graphics.drawText(text, { x: x, y: y + padding }, "white", "30px Arial");
        text = ": " + lives;
        graphics.drawTexture(assets.life, { x: x + asset_offset_x, y: y + asset_offset_y + padding * 2 }, 0, { x: magic.MENU_SIZE / 2, y: magic.MENU_SIZE / 2 })
        graphics.drawText(text, { x: x, y: y + padding * 2 }, "white", "30px Arial");


        renderTowers();
    }

    function renderTowers() {
        for (let idx in towerDictionary) {
            let tower = towerDictionary[idx];
            graphics.drawTexture(assets.buy_cell, tower.center, 0, { x: magic.MENU_SIZE, y: magic.MENU_SIZE })
            tower.renderPreview(tower, tower.center, 0, 3, { x: magic.MENU_SIZE * .75, y: magic.MENU_SIZE * .75 });
            graphics.drawText("$" + tower.cost, { x: tower.center.x - magic.MENU_SIZE / 2 + 5, y: tower.center.y - 10 }, "white", "18px Arial")
            if (tower.selected) {
                if (coins >= tower.cost)
                    graphics.drawRectangle({ size: { x: magic.MENU_SIZE, y: magic.MENU_SIZE }, center: tower.center, rotation: 0 }, "rgba(255, 255, 255, .5)", "black");
                else
                    graphics.drawRectangle({ size: { x: magic.MENU_SIZE, y: magic.MENU_SIZE }, center: tower.center, rotation: 0 }, "rgba(255, 0, 0, .5)", "black");
            }

        }
    }

    function update(elapsedTime) {
        cursor.blocked(currentTower?.cost > coins);
    }

    function addCoins(amount) {
        coins += amount;
    }

    function plusWave() {
        wave++;
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
                xmin: towerDictionary[idx].center.x - magic.MENU_SIZE / 2,
                xmax: towerDictionary[idx].center.x + magic.MENU_SIZE / 2,
                ymin: towerDictionary[idx].center.y - magic.MENU_SIZE / 2,
                ymax: towerDictionary[idx].center.y + magic.MENU_SIZE / 2,
            }
            x += magic.CELL_SIZE + towerStep;
            if (x > graphics.canvas.width) {
                x = start;
                y += magic.CELL_SIZE + towerStep;
            }
        }
    }

    function buyTower(tower) {
        if (!placing && towerDictionary[tower].selected) {
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
            if (!towerDictionary[idx].selected && collision)
                sounds.play(assets.menu_hover);
            towerDictionary[idx].selected = collision;
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

    function loseLife(amount) {
        lives -= amount;
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
        loseLife: loseLife,
        plusWave: plusWave,
        get placing() { return placing; },
        get coins() { return coins; }
    };

    return api;
}