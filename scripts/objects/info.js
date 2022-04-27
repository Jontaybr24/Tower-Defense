MyGame.objects.Info = function (assets, graphics, magic, cursor, sounds, aParticles) {
    'use strict';

    let coins = 0;
    let lives = 0;
    let waves = null;
    let step = 40;
    let padding = 45;
    let towerYStep = 180;
    let towerStep = 15;
    let towerOffset = .7;
    let asset_offset_y = -10;
    let asset_offset_x = -15;
    let full_offset = 0.65; // the percentage of the X_OFFSET that is padding from the right
    let placing = false;
    let towerDictionary = [];
    let currentTower = null;
    let anySelected = false;
    let hoverBox = { center: { x: 0, y: 0 }, size: { x: 300, y: 120 }, name: "Test", message: "Test" };
    let pBoxStyle = "rgba(255, 195, 143, .5)";
    let hpadding = 25;


    function render() {
        if (placing) {
            cursor.render();
        }
        graphics.drawRectangle({ center: { x: graphics.canvas.width - magic.X_OFFSET / 2, y: graphics.canvas.height / 2 }, size: { x: magic.X_OFFSET, y: graphics.canvas.height } }, "#572c15", "black")
        let x = graphics.canvas.width - (magic.X_OFFSET * full_offset);
        let y = step;

        let text = "Wave: " + waves.waveCount;
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
            if (anySelected) {
                graphics.drawRectangle(hoverBox, pBoxStyle, "black");
                graphics.drawText(hoverBox.name, { x: hoverBox.center.x, y: hoverBox.center.y - hoverBox.size.y / 2 + hpadding}, "black", "24px Arial", true);
                graphics.drawText(hoverBox.message, { x: hoverBox.center.x - hoverBox.size.x / 2 + hpadding / 2, y: hoverBox.center.y - hoverBox.size.y / 2 + hpadding * 2.2}, "black", "18px Arial", false, hpadding);
            }

        }
    }

    function update(elapsedTime) {
        if (currentTower?.cost > coins)
            cursor.blocked();
    }

    function addCoins(amount, location) {
        coins += amount;
        aParticles.makeCoin(JSON.parse(JSON.stringify(location)), amount);
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
            x += magic.MENU_SIZE + towerStep;
            if (x > graphics.canvas.width) {
                x = start;
                y += magic.MENU_SIZE + towerStep;
            }
        }
    }

    function loadInfo(info) {
        coins = info.coins;
        lives = info.lives;
        placing = false;
        currentTower = null;
    }

    function plusWave(wave) {
        waves = wave;
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
        hoverBox.center.x = point.x - hoverBox.size.x / 2;
        hoverBox.center.y = point.y - hoverBox.size.y / 2;
        anySelected = false;
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
            if (collision){
                anySelected = true;
                hoverBox.name = tower.name;
                hoverBox.message = tower.description;
            }
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
        loadInfo: loadInfo,
        buyTower: buyTower,
        checkHover: checkHover,
        checkBuy: checkBuy,
        loseLife: loseLife,
        plusWave: plusWave,
        cancelTower: cancelTower,
        get placing() { return placing; },
        get coins() { return coins; },
        get lives() { return lives; }
    };

    return api;
}