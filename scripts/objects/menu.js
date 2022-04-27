MyGame.objects.Menu = function (assets, graphics, magic, towers, info, sounds) {
    'use strict';
    let tower = null;
    let smallBoxHeight = graphics.canvas.height / 12;
    let smallBoxWidth = magic.X_OFFSET * .8;
    let padding = 20;
    let textPadding = 22;
    let y_bottom = 125; // distance from the bottom of the screen
    let bigBoxHeight = (smallBoxHeight + padding) * 3;
    let bigBoxWidth = magic.X_OFFSET * .9;
    let dataBoxHeight = smallBoxHeight * 1.3;
    let sellBoxHeight = 30;
    let bigBoxPos = { x: graphics.canvas.height + magic.X_OFFSET / 2, y: graphics.canvas.height - (bigBoxHeight / 2) - y_bottom }
    let box1 = {
        center: { x: bigBoxPos.x, y: bigBoxPos.y - (smallBoxHeight + padding) },
        size: { x: smallBoxWidth, y: smallBoxHeight },
        selected: false,
    };
    box1.hitbox = {
        xmin: box1.center.x - box1.size.x / 2,
        xmax: box1.center.x + box1.size.x / 2,
        ymin: box1.center.y - box1.size.y / 2,
        ymax: box1.center.y + box1.size.y / 2,
    };
    let box2 = {
        center: { x: bigBoxPos.x, y: bigBoxPos.y },
        size: { x: smallBoxWidth, y: smallBoxHeight },
        selected: false,
    };
    box2.hitbox = {
        xmin: box2.center.x - box2.size.x / 2,
        xmax: box2.center.x + box2.size.x / 2,
        ymin: box2.center.y - box2.size.y / 2,
        ymax: box2.center.y + box2.size.y / 2,
    };
    let box3 = {
        center: { x: bigBoxPos.x, y: bigBoxPos.y + (smallBoxHeight + padding) },
        size: { x: smallBoxWidth, y: smallBoxHeight },
        selected: false,
    };
    box3.hitbox = {
        xmin: box3.center.x - box3.size.x / 2,
        xmax: box3.center.x + box3.size.x / 2,
        ymin: box3.center.y - box3.size.y / 2,
        ymax: box3.center.y + box3.size.y / 2,
    };
    let dataBox = {
        center: { x: bigBoxPos.x, y: bigBoxPos.y - bigBoxHeight / 2 - dataBoxHeight / 2 - padding / 2 },
        size: { x: bigBoxWidth, y: dataBoxHeight },
        selected: false,
    }
    let sellBox = {
        center: { x: bigBoxPos.x, y: bigBoxPos.y + bigBoxHeight / 2 + sellBoxHeight / 2 + padding / 2 },
        size: { x: bigBoxWidth, y: sellBoxHeight },
        selected: false,
    }
    sellBox.hitbox = {
        xmin: sellBox.center.x - sellBox.size.x / 2,
        xmax: sellBox.center.x + sellBox.size.x / 2,
        ymin: sellBox.center.y - sellBox.size.y / 2,
        ymax: sellBox.center.y + sellBox.size.y / 2,
    };

    let hoverBox = { center: { x: 0, y: 0 }, size: { x: 300, y: 120 }, name: "Test", message: "Test" };
    let pBoxStyle = "rgba(255, 195, 143, .5)";
    let hpadding = 25;
    let anySelected = false;

    let bgColor = "#6e3e1b";
    let highlight = "rgba(69, 69, 69, .5)";
    let rhighlight = "rgba(255, 69, 69, .5)";
    let locked = "#693a19";

    function render() {
        graphics.drawRectangle({ center: bigBoxPos, size: { x: bigBoxWidth, y: bigBoxHeight } }, bgColor, "black");
        graphics.drawRectangle({ center: dataBox.center, size: dataBox.size }, bgColor, "black");
        graphics.drawRectangle({ center: sellBox.center, size: sellBox.size }, bgColor, "black");
        if (tower != null) {
            graphics.drawText(tower.name, { x: dataBox.center.x, y: dataBox.center.y - 25 }, "black", "28px Arial", true);
            graphics.drawText("Sell $" + Math.floor(tower.cost * magic.SELL_PRICE), { x: sellBox.center.x, y: sellBox.center.y + 8 }, "white", "24px Arial", true);
            if (sellBox.selected) {
                graphics.drawRectangle({ center: sellBox.center, size: sellBox.size }, "rgba(255, 0, 0, .5)", "black");
            }
            graphics.drawRectangle({ center: tower.center, size: { x: magic.CELL_SIZE, y: magic.CELL_SIZE }, rotation: 0 }, "rgba(12, 170, 7, .5)", "black");
            graphics.drawRectangle({ center: box1.center, size: box1.size }, "#85481d", "black");
            graphics.drawRectangle({ center: box2.center, size: box2.size }, "#85481d", "black");
            graphics.drawRectangle({ center: box3.center, size: box3.size }, "#85481d", "black");

            graphics.drawText("Damage:", { x: dataBox.center.x - dataBox.size.x / 2 + padding / 2, y: dataBox.center.y }, "black", "16px Arial");
            graphics.drawText("Rate of Fire:", { x: dataBox.center.x - dataBox.size.x / 2 + padding / 2, y: dataBox.center.y + textPadding }, "black", "16px Arial");
            graphics.drawText("Radius:", { x: dataBox.center.x - dataBox.size.x / 2 + padding / 2, y: dataBox.center.y + textPadding * 2 }, "black", "16px Arial");

            if ("upgrades" in tower) {
                if (box1.selected && tower.path != 1 && tower.path != 2 && tower.level < 3) {
                    if (tower.upgrades["radius"][0][0] == 0) {
                        graphics.drawEllipse({ center: tower.center, radius: tower.radius }, "rgba(0, 25, 0, .25)", "black");
                        graphics.drawText((tower.radius / magic.CELL_SIZE - .5).toFixed(1), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "white", "16px Arial");
                    }
                    else {
                        graphics.drawEllipse({ center: tower.center, radius: tower.radius + (tower.upgrades["radius"][0][0] * magic.CELL_SIZE) }, "rgba(0, 225, 0, .25)", "black");
                        graphics.drawText((tower.radius / magic.CELL_SIZE + tower.upgrades["radius"][0][0] - .5).toFixed(1), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "green", "16px Arial");
                    }
                    if (tower.upgrades["damage"][0][0] == 0) {
                        graphics.drawText(tower.damage, { x: dataBox.center.x - 10, y: dataBox.center.y }, "white", "16px Arial");
                    }
                    else {
                        graphics.drawText(tower.damage + tower.upgrades["damage"][0][0], { x: dataBox.center.x - 10, y: dataBox.center.y }, "green", "16px Arial");
                    }
                    if (tower.upgrades["fireRate"][0][0] == 0) {
                        graphics.drawText(tower.fireRate, { x: dataBox.center.x + 12, y: dataBox.center.y + textPadding }, "white", "16px Arial");
                    }
                    else {
                        graphics.drawText(tower.fireRate + tower.upgrades["fireRate"][0][0], { x: dataBox.center.x + 12, y: dataBox.center.y + textPadding }, "green", "16px Arial");
                    }
                }
                else if (box2.selected && tower.path != 0 && tower.path != 2 && tower.level < 3) {
                    if (tower.upgrades["radius"][1][0] == 0) {
                        graphics.drawEllipse({ center: tower.center, radius: tower.radius }, "rgba(0, 25, 0, .25)", "black");
                        graphics.drawText((tower.radius / magic.CELL_SIZE - .5).toFixed(1), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "white", "16px Arial");
                    }
                    else {
                        graphics.drawEllipse({ center: tower.center, radius: tower.radius + (tower.upgrades["radius"][1][0] * magic.CELL_SIZE) }, "rgba(0, 225, 0, .25)", "black");
                        graphics.drawText((tower.radius / magic.CELL_SIZE + tower.upgrades["radius"][1][0] - .5).toFixed(1), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "green", "16px Arial");
                    }
                    if (tower.upgrades["damage"][1][0] == 0) {
                        graphics.drawText(tower.damage, { x: dataBox.center.x - 10, y: dataBox.center.y }, "white", "16px Arial");
                    }
                    else {
                        graphics.drawText(tower.damage + tower.upgrades["damage"][1][0], { x: dataBox.center.x - 10, y: dataBox.center.y }, "green", "16px Arial");
                    }
                    if (tower.upgrades["fireRate"][1][0] == 0) {
                        graphics.drawText(tower.fireRate, { x: dataBox.center.x + 12, y: dataBox.center.y + textPadding }, "white", "16px Arial");
                    }
                    else {
                        graphics.drawText(tower.fireRate + tower.upgrades["fireRate"][1][0], { x: dataBox.center.x + 12, y: dataBox.center.y + textPadding }, "green", "16px Arial");
                    }
                }
                else if (box3.selected && tower.path != 1 && tower.path != 0 && tower.level < 3) {
                    if (tower.upgrades["radius"][2][0] == 0) {
                        graphics.drawEllipse({ center: tower.center, radius: tower.radius }, "rgba(0, 25, 0, .25)", "black");
                        graphics.drawText((tower.radius / magic.CELL_SIZE - .5).toFixed(1), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "white", "16px Arial");
                    }
                    else {
                        graphics.drawEllipse({ center: tower.center, radius: tower.radius + (tower.upgrades["radius"][2][0] * magic.CELL_SIZE) }, "rgba(0, 225, 0, .25)", "black");
                        graphics.drawText((tower.radius / magic.CELL_SIZE + tower.upgrades["radius"][2][0] - .5).toFixed(1), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "green", "16px Arial");
                    }
                    if (tower.upgrades["damage"][2][0] == 0) {
                        graphics.drawText(tower.damage, { x: dataBox.center.x - 10, y: dataBox.center.y }, "white", "16px Arial");
                    }
                    else {
                        graphics.drawText(tower.damage + tower.upgrades["damage"][2][0], { x: dataBox.center.x - 10, y: dataBox.center.y }, "green", "16px Arial");
                    }
                    if (tower.upgrades["fireRate"][2][0] == 0) {
                        graphics.drawText(tower.fireRate, { x: dataBox.center.x + 12, y: dataBox.center.y + textPadding }, "white", "16px Arial");
                    }
                    else {
                        graphics.drawText(tower.fireRate + tower.upgrades["fireRate"][2][0], { x: dataBox.center.x + 12, y: dataBox.center.y + textPadding }, "green", "16px Arial");
                    }
                }
                else {
                    graphics.drawEllipse({ center: tower.center, radius: tower.radius }, "rgba(0, 25, 0, .25)", "black");
                    graphics.drawText(tower.damage, { x: dataBox.center.x - 10, y: dataBox.center.y }, "white", "16px Arial");
                    graphics.drawText(tower.fireRate, { x: dataBox.center.x + 12, y: dataBox.center.y + textPadding }, "white", "16px Arial");
                    graphics.drawText((tower.radius / magic.CELL_SIZE - .5).toFixed(1), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "white", "16px Arial");
                }
                if (tower.level < 3) {
                    tower.renderPreview(tower, box1.center, tower.level + 1, 0, { x: magic.MENU_SIZE, y: magic.MENU_SIZE });
                    tower.renderPreview(tower, box2.center, tower.level + 1, 1, { x: magic.MENU_SIZE, y: magic.MENU_SIZE });
                    tower.renderPreview(tower, box3.center, tower.level + 1, 2, { x: magic.MENU_SIZE, y: magic.MENU_SIZE });
                    if (tower.path == 3 || tower.path == 0) {
                        graphics.drawText("$" + tower.upgrades["cost"][0][0], { x: box1.center.x - box1.size.x / 2 + padding / 2, y: box1.center.y - padding }, "white", "22px Arial");
                    }
                    if (tower.path == 3 || tower.path == 1) {
                        graphics.drawText("$" + tower.upgrades["cost"][1][0], { x: box2.center.x - box2.size.x / 2 + padding / 2, y: box2.center.y - padding }, "white", "22px Arial");
                    }
                    if (tower.path == 3 || tower.path == 2) {
                        graphics.drawText("$" + tower.upgrades["cost"][2][0], { x: box3.center.x - box3.size.x / 2 + padding / 2, y: box3.center.y - padding }, "white", "22px Arial");
                    }
                    if (box1.selected && tower.path != 1 && tower.path != 2) {
                        if (info.coins >= tower.upgrades["cost"][0][0])
                            graphics.drawRectangle({ center: box1.center, size: box1.size }, highlight, "black");
                        else
                            graphics.drawRectangle({ center: box1.center, size: box1.size }, rhighlight, "black");
                    }
                    else if (box2.selected && tower.path != 0 && tower.path != 2) {
                        if (info.coins >= tower.upgrades["cost"][1][0])
                            graphics.drawRectangle({ center: box2.center, size: box2.size }, highlight, "black");
                        else
                            graphics.drawRectangle({ center: box2.center, size: box2.size }, rhighlight, "black");
                    }
                    else if (box3.selected && tower.path != 0 && tower.path != 1) {
                        if (info.coins >= tower.upgrades["cost"][2][0])
                            graphics.drawRectangle({ center: box3.center, size: box3.size }, highlight, "black");
                        else
                            graphics.drawRectangle({ center: box3.center, size: box3.size }, rhighlight, "black");
                    }
                }
                else {
                    graphics.drawText("MAX LEVEL", box1.center, "white", "24px Arial", true);
                    graphics.drawText("MAX LEVEL", box2.center, "white", "24px Arial", true);
                    graphics.drawText("MAX LEVEL", box3.center, "white", "24px Arial", true);
                }


                if (tower.path == 0) {
                    graphics.drawRectangle({ center: box2.center, size: box2.size }, locked, "black");
                    graphics.drawRectangle({ center: box3.center, size: box3.size }, locked, "black");
                }
                else if (tower.path == 1) {
                    graphics.drawRectangle({ center: box1.center, size: box1.size }, locked, "black");
                    graphics.drawRectangle({ center: box3.center, size: box3.size }, locked, "black");
                }
                else if (tower.path == 2) {
                    graphics.drawRectangle({ center: box1.center, size: box1.size }, "#693a19", "black");
                    graphics.drawRectangle({ center: box2.center, size: box2.size }, "#693a19", "black");
                }
                if (anySelected && tower.level < 3) {
                    graphics.drawRectangle(hoverBox, pBoxStyle, "black");
                    graphics.drawText(hoverBox.message, { x: hoverBox.center.x - hoverBox.size.x / 2 + hpadding / 2, y: hoverBox.center.y - hoverBox.size.y / 2 + hpadding }, "black", "18px Arial", false, hpadding);

                }
            }
        }
    }

    function update(elapsedTime) {
    }

    function setTower(obj) {
        if (obj == null) {
            box1.selected = false;
            box2.selected = false;
            box3.selected = false;
            sellBox.selected = false;
        }
        tower = obj;
    }

    function buyUpgrade() {
        if (tower != null && tower.level < 3) {
            if (box1.selected && tower.path != 1 && tower.path != 2) {
                if (info.coins >= tower.upgrades["cost"][0][0]) {
                    hoverBox.message = tower["upgrades"]["des"][0][1];
                    return towers.upgrade(tower, 0)
                }
                else {
                    sounds.play(assets.deny);
                }
            }
            if (box2.selected && tower.path != 0 && tower.path != 2) {
                if (info.coins >= tower.upgrades["cost"][1][0]) {
                    hoverBox.message = tower["upgrades"]["des"][1][1];
                    return towers.upgrade(tower, 1)
                }
                else {
                    sounds.play(assets.deny);
                }
            }
            if (box3.selected && tower.path != 0 && tower.path != 1) {
                if (info.coins >= tower.upgrades["cost"][2][0]) {
                    hoverBox.message = tower["upgrades"]["des"][2][1];
                    return towers.upgrade(tower, 2)
                }
                else {
                    sounds.play(assets.deny);
                }
            }
        }
        return 0;
    }

    function sellTower() {
        if (tower != null && sellBox.selected) {
            return true;
        }
        return false;
    }

    function checkHover(point) {
        hoverBox.center.x = point.x - hoverBox.size.x / 2;
        hoverBox.center.y = point.y - hoverBox.size.y / 2;
        anySelected = false;
        if (tower != null) {
            point = { xmin: point.x, xmax: point.x, ymin: point.y, ymax: point.y }
            if (!box1.selected && magic.collision(point, box1.hitbox) && (tower.path == 3 || tower.path == 0) && "upgrades" in tower)
                sounds.play(assets.menu_hover);
            if (!box2.selected && magic.collision(point, box2.hitbox) && (tower.path == 3 || tower.path == 1) && "upgrades" in tower)
                sounds.play(assets.menu_hover);
            if (!box3.selected && magic.collision(point, box3.hitbox) && (tower.path == 3 || tower.path == 2) && "upgrades" in tower)
                sounds.play(assets.menu_hover);
            if (!sellBox.selected && magic.collision(point, sellBox.hitbox))
                sounds.play(assets.menu_hover);
            box1.selected = (magic.collision(point, box1.hitbox) && (tower.path == 3 || tower.path == 0));
            box2.selected = (magic.collision(point, box2.hitbox) && (tower.path == 3 || tower.path == 1));
            box3.selected = (magic.collision(point, box3.hitbox) && (tower.path == 3 || tower.path == 2));
            if (box1.selected || box2.selected || box3.selected) {
                anySelected = true;
                let path = 0;
                if (box2.selected)
                    path = 1;
                if (box3.selected)
                    path = 2;
                hoverBox.message = tower["upgrades"]["des"][path][0];
            }
            sellBox.selected = magic.collision(point, sellBox.hitbox);
        }
    }

    function loadUpgrades() {
        tower = null;
        box1.selected = false;
        box2.selected = false;
        box3.selected = false;
    }

    let api = {
        update: update,
        render: render,
        setTower: setTower,
        checkHover: checkHover,
        buyUpgrade: buyUpgrade,
        sellTower: sellTower,
        loadUpgrades: loadUpgrades,
        get tower() { return tower; },
    };

    return api;
}