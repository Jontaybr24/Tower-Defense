MyGame.objects.Towers = function (assets, graphics, magic) {
    'use strict';

    let towerDictionary = {
        turret: {
            name: "Basic Turret",
            cost: 50,
            image: "turret",
            center: null,
            rotation: 90,
        }
    };

    let towers = [];

    function render() {
        for (let index in towers) {
            let tower = towers[index];
            graphics.drawTexture(tower.image.base, tower.center, 0, { width: magic.CELL_SIZE / 2, height: magic.CELL_SIZE / 2 }) // renders the tower base
            let towerHead = assets[tower.image.tower + "_" + tower.level] // Gets the image of the tower head based on the level of the tower
            graphics.drawTexture(towerHead, tower.center, tower.rotation, { width: magic.CELL_SIZE, height: magic.CELL_SIZE }) // Renders the tower head            
        }
    }

    function update() {

    }

    function pushTower(spec) {
        spec.image = { base: assets.tower_base, tower: spec.image };
        spec.level = Math.floor(Math.random() * 4) + 1;
        console.log(spec);
        towers.push(spec);
    }

    function makeTower(pos, name) {
        let tower = JSON.parse(JSON.stringify(towerDictionary[name]))
        tower.center = pos;
        pushTower(tower);
        return tower;
    }



    let api = {
        update: update,
        render: render,
        makeTower: makeTower,
        get towerDictionary() { return towerDictionary; },
    };

    return api;
}