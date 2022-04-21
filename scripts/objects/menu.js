MyGame.objects.Menu = function (assets, graphics, magic, towers) {
    'use strict';
    let tower = null;
    let smallBoxHeight = graphics.canvas.height / 11;
    let smallBoxWidth = magic.X_OFFSET * .8;
    let padding = 20;
    let textPadding = 22;
    let y_bottom = 140;
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

    let bgColor = "#6e3e1b";
    let highlight = "rgba(69, 69, 69, .5)";
    let locked = "#693a19";

    function render() {
        graphics.drawRectangle({ center: bigBoxPos, size: { x: bigBoxWidth, y: bigBoxHeight } }, bgColor, "black");
        if (tower != null) {
            graphics.drawRectangle({ center: box1.center, size: box1.size }, "#85481d", "black");
            graphics.drawRectangle({ center: box2.center, size: box2.size }, "#85481d", "black");
            graphics.drawRectangle({ center: box3.center, size: box3.size }, "#85481d", "black");

            graphics.drawRectangle({ center: sellBox.center, size: sellBox.size }, bgColor, "black");
            graphics.drawRectangle({ center: dataBox.center, size: dataBox.size }, bgColor, "black");

            graphics.drawText(tower.name, { x: dataBox.center.x, y: dataBox.center.y - 25 }, "black", "28px Arial", true);
            graphics.drawText("Damage:", { x: dataBox.center.x - dataBox.size.x / 2 + padding / 2, y: dataBox.center.y }, "black", "16px Arial");
            graphics.drawText("Rate of Fire:", { x: dataBox.center.x - dataBox.size.x / 2 + padding / 2, y: dataBox.center.y + textPadding }, "black", "16px Arial");
            graphics.drawText("Radius:", { x: dataBox.center.x - dataBox.size.x / 2 + padding / 2, y: dataBox.center.y + textPadding * 2 }, "black", "16px Arial");

            graphics.drawText("Sell", { x: sellBox.center.x, y: sellBox.center.y + 10 }, "white", "24px Arial", true);

            if (box1.selected && tower.path != 1 && tower.path != 2 && tower.level < 3) {
                if (tower.upgrades["radius"][0][0] == 0) {
                    graphics.drawEllipse({ center: tower.center, radius: tower.radius }, "rgba(0, 25, 0, .25)", "black");
                    graphics.drawText(Math.floor(tower.radius / magic.CELL_SIZE), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "white", "16px Arial");
                }
                else {
                    graphics.drawEllipse({ center: tower.center, radius: tower.radius + (tower.upgrades["radius"][0][0] * magic.CELL_SIZE) }, "rgba(0, 225, 0, .25)", "black");
                    graphics.drawText(Math.floor(tower.radius / magic.CELL_SIZE) + tower.upgrades["radius"][0][0], { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "green", "16px Arial");
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
                    graphics.drawText(Math.floor(tower.radius / magic.CELL_SIZE), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "white", "16px Arial");
                }
                else {
                    graphics.drawEllipse({ center: tower.center, radius: tower.radius + (tower.upgrades["radius"][1][0] * magic.CELL_SIZE) }, "rgba(0, 225, 0, .25)", "black");
                    graphics.drawText(Math.floor(tower.radius / magic.CELL_SIZE) + tower.upgrades["radius"][1][0], { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "green", "16px Arial");
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
                    graphics.drawText(Math.floor(tower.radius / magic.CELL_SIZE), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "white", "16px Arial");
                }
                else {
                    graphics.drawEllipse({ center: tower.center, radius: tower.radius + (tower.upgrades["radius"][2][0] * magic.CELL_SIZE) }, "rgba(0, 225, 0, .25)", "black");
                    graphics.drawText(Math.floor(tower.radius / magic.CELL_SIZE) + tower.upgrades["radius"][2][0], { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "green", "16px Arial");
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
                graphics.drawText(Math.floor(tower.radius / magic.CELL_SIZE), { x: dataBox.center.x - 20, y: dataBox.center.y + textPadding * 2 }, "white", "16px Arial");
            }
            if (tower.level < 3) {
                tower.renderPreview(tower, box1.center, tower.level + 1, 0, { x: magic.MENU_SIZE, y: magic.MENU_SIZE });
                tower.renderPreview(tower, box2.center, tower.level + 1, 1, { x: magic.MENU_SIZE, y: magic.MENU_SIZE });
                tower.renderPreview(tower, box3.center, tower.level + 1, 2, { x: magic.MENU_SIZE, y: magic.MENU_SIZE });
            }
            else {
                graphics.drawText("MAX LEVEL", box1.center, "white", "24px Arial", true);
                graphics.drawText("MAX LEVEL", box2.center, "white", "24px Arial", true);
                graphics.drawText("MAX LEVEL", box3.center, "white", "24px Arial", true);
            }

            if (box1.selected && tower.path != 1 && tower.path != 2) {
                graphics.drawRectangle({ center: box1.center, size: box1.size }, highlight, "black");
            }
            else if (box2.selected && tower.path != 0 && tower.path != 2) {
                graphics.drawRectangle({ center: box2.center, size: box2.size }, highlight, "black");
            }
            else if (box3.selected && tower.path != 0 && tower.path != 2) {
                graphics.drawRectangle({ center: box3.center, size: box3.size }, highlight, "black");
            }
            else if (sellBox.selected) {
                graphics.drawRectangle({ center: sellBox.center, size: sellBox.size }, "rgba(255, 0, 0, .5)", "black");
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
        }
    }

    function update(elapsedTime) {
    }

    function setTower(obj) {
        tower = obj;
    }

    function buyUpgrade() {
        if (tower != null) {
            if (box1.selected && tower.path != 1 && tower.path != 2) {
                return towers.upgrade(tower, 0)
            }
            if (box2.selected && tower.path != 0 && tower.path != 2) {
                return towers.upgrade(tower, 1)
            }
            if (box3.selected && tower.path != 0 && tower.path != 1) {
                return towers.upgrade(tower, 2)
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
        point = { xmin: point.x, xmax: point.x, ymin: point.y, ymax: point.y }
        box1.selected = magic.collision(point, box1.hitbox);
        box2.selected = magic.collision(point, box2.hitbox);
        box3.selected = magic.collision(point, box3.hitbox);
        sellBox.selected = magic.collision(point, sellBox.hitbox);
    }

    let api = {
        update: update,
        render: render,
        setTower: setTower,
        checkHover: checkHover,
        buyUpgrade: buyUpgrade,
        sellTower: sellTower,
        get tower() { return tower; },
    };

    return api;
}