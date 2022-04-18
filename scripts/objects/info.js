MyGame.objects.Info = function (assets, graphics, magic) {
    'use strict';

    let coins = 0;
    let lives = 50;
    let step = 40;
    let asset_offset_y = -10;
    let asset_offset_x = -15;

    function render() {
        let x = graphics.canvas.width - (2 * (magic.X_OFFSET / 3));
        let y = step;
        let text = ": " + coins;
        graphics.drawTexture(assets.coin, { x: x + asset_offset_x, y: y + asset_offset_y }, 0, { width: magic.CELL_SIZE / 2, height: magic.CELL_SIZE / 2 })
        graphics.drawText(text, { x: x, y: y }, "white", "30px Arial");
        text = ": " + lives;
        graphics.drawTexture(assets.coin, { x: x + asset_offset_x, y: y + asset_offset_y + step }, 0, { width: magic.CELL_SIZE / 2, height: magic.CELL_SIZE / 2 })
        graphics.drawText(text, { x: x, y: y + step }, "white", "30px Arial");
    }

    function update(elapsedTime) {
    }

    function addCoins(amount) {
        coins += amount;
    }

    let api = {
        update: update,
        render: render,
        addCoins: addCoins,
    };

    return api;
}