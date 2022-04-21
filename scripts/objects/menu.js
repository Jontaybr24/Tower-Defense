MyGame.objects.Menu = function (assets, graphics, magic, towers) {
    'use strict';
    let tower = null;
    let smallBoxHeight = graphics.canvas.height / 10;
    let smallBoxWidth = magic.X_OFFSET * .8;
    let padding = 20;
    let y_bottom = 100;
    let bigBoxHeight = (smallBoxHeight + padding) * 2;
    let bigBoxWidth = magic.X_OFFSET * .9;
    let bigBoxPos = { x: graphics.canvas.height + magic.X_OFFSET / 2, y: graphics.canvas.height - (bigBoxHeight / 2) - y_bottom }
    let box1 = {
        center: { x: bigBoxPos.x, y: bigBoxPos.y - (smallBoxHeight + padding) / 2 },
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
        center: { x: bigBoxPos.x, y: bigBoxPos.y + (smallBoxHeight + padding) / 2 },
        size: { x: smallBoxWidth, y: smallBoxHeight },
        selected: false,
    };
    box2.hitbox = {
        xmin: box2.center.x - box2.size.x / 2,
        xmax: box2.center.x + box2.size.x / 2,
        ymin: box2.center.y - box2.size.y / 2,
        ymax: box2.center.y + box2.size.y / 2,
    };

    function render() {
        graphics.drawRectangle({ center: bigBoxPos, size: { x: bigBoxWidth, y: bigBoxHeight } }, "#6e3e1b", "black");
        if (tower != null) {
            graphics.drawEllipse({ center: tower.center, radius: tower.radius }, "rgba(0, 25, 0, .25)", "black");
            graphics.drawRectangle({ center: box1.center, size: box1.size }, "#85481d", "black");
            graphics.drawRectangle({ center: box2.center, size: box2.size }, "#85481d", "black");
            if (tower.level < 3) {
                tower.renderPreview(tower, box1.center, tower.level + 1, 0, { x: magic.CELL_SIZE, y: magic.CELL_SIZE });
                tower.renderPreview(tower, box2.center, tower.level + 1, 1, { x: magic.CELL_SIZE, y: magic.CELL_SIZE });
            }
            else{
                graphics.drawText("MAX LEVEL", box1.center, "white", "24px Arial", true);
                graphics.drawText("MAX LEVEL", box2.center, "white", "24px Arial", true);
            }

            if (box1.selected && tower.path != 1) {
                graphics.drawRectangle({ center: box1.center, size: box1.size }, "rgba(69, 69, 69, .5)", "black");
            }
            else if (box2.selected && tower.path != 0) {
                graphics.drawRectangle({ center: box2.center, size: box2.size }, "rgba(69, 69, 69, .5)", "black");
            }
            if (tower.path == 0) {
                graphics.drawRectangle({ center: box2.center, size: box2.size }, "#693a19", "black");
            }
            else if (tower.path == 1) {
                graphics.drawRectangle({ center: box1.center, size: box1.size }, "#693a19", "black");
            }

            //console.log(Math.floor(tower.radius / magic.CELL_SIZE));
            console.log(tower.name, tower.fireRate);
        }
    }

    function update(elapsedTime) {
    }

    function setTower(obj) {
        tower = obj;
    }

    function buyUpgrade() {
        if (box1.selected && tower.path != 1) {
            return towers.upgrade(tower, 0)
        }
        if (box2.selected && tower.path != 0) {
            return towers.upgrade(tower, 1)
        }
        return 0;
    }

    function checkHover(point) {
        point = { xmin: point.x, xmax: point.x, ymin: point.y, ymax: point.y }
        box1.selected = magic.collision(point, box1.hitbox);
        box2.selected = magic.collision(point, box2.hitbox);
    }

    let api = {
        update: update,
        render: render,
        setTower: setTower,
        checkHover: checkHover,
        buyUpgrade: buyUpgrade,
        get tower() { return tower; },
    };

    return api;
}