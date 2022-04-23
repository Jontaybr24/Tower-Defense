MyGame.objects.Healthbars = function (graphics, magic) {
    'use strict';

    let allBars = {};
    let WIDTH = magic.CELL_SIZE;
    let HEIGHT = magic.CELL_SIZE / 10;

    function update(elapsedTime) {
        for (let idx in allBars) {
            allBars[idx].center = { x: allBars[idx].enemy.center.x, y: allBars[idx].enemy.center.y - magic.CELL_SIZE };
            allBars[idx].currentHealth = allBars[idx].enemy.health;
        }
    }

    function render() {
        for (let idx in allBars) {
            let bar = allBars[idx];
            if (bar.currentHealth / bar.maxHealth != 1) {
                let bars = barSize(bar);
                graphics.drawRectangle({ center: bars.red.center, size: bars.red.size }, "#6e0000", "black");
                graphics.drawRectangle({ center: bars.green.center, size: bars.green.size }, "green", "black");
            }
        }
    }

    function barSize(bar) {
        let percent = bar.currentHealth / bar.maxHealth;
        let lengthG = WIDTH * percent;
        let lengthR = WIDTH - lengthG;
        let left = bar.center.x - WIDTH / 2;
        left += lengthG / 2;
        let right = left + lengthG / 2 + lengthR / 2;
        let green = { x: lengthG, y: HEIGHT };
        let red = { x: lengthR, y: HEIGHT };
        let greenCenter = { x: left, y: bar.center.y };
        let redCenter = { x: right, y: bar.center.y };
        return { green: { size: green, center: greenCenter }, red: { size: red, center: redCenter } };
    }

    function newHealthbar(enemy) {
        allBars[enemy.id] = {
            maxHealth: enemy.health,
            currentHealth: enemy.health,
            id: enemy.id,
            enemy: enemy,
        }
    }

    function removeBar(id) {
        delete allBars[id];
    }

    function loadHP() {
        WIDTH = magic.CELL_SIZE;
        HEIGHT = magic.CELL_SIZE / 10;
        for(let i in allBars){
            removeBar(i);
        }
    }

    let api = {
        update: update,
        render: render,
        removeBar: removeBar,
        newHealthbar: newHealthbar,
        loadHP: loadHP,
    };

    return api;
}