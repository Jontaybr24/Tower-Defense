MyGame.objects.Towers = function (assets, graphics, magic) {
    'use strict';

    let towerDictionary = {
        turret: {
            name: "Basic Turret",
            cost: 50,
            image: "turret",
            center: null,
            rotation: 90,
            type: "tower",
        }
    };

    let towers = [];
    let count = 0;

    function render() {
        for (let index in towers) {
            let tower = towers[index];
            graphics.drawTexture(tower.image.base, tower.center, 0, { width: magic.CELL_SIZE, height: magic.CELL_SIZE }) // renders the tower base
            let towerHead = assets[tower.image.tower + "_" + tower.level] // Gets the image of the tower head based on the level of the tower
            graphics.drawTexture(towerHead, tower.center, tower.rotation, { width: magic.CELL_SIZE, height: magic.CELL_SIZE }) // Renders the tower head            
        }
    }

    function update() {

    }

    function pushTower(spec) {
        spec.image = { base: assets.tower_base, tower: spec.image };
        spec.level = Math.floor(Math.random() * 4) + 1;
        spec.id = count++;
        console.log(spec);
        towers.push(spec);
    }

    function makeTower(pos, name) {
        let tower = JSON.parse(JSON.stringify(towerDictionary[name]))
        tower.center = pos;
        pushTower(tower);
        return tower;
    }

    function deleteTower(tower) {
        if (tower?.type == "tower") {
            for (let index in towers) {
                if (towers[index].id == tower.id)
                    towers.splice(index, 1);
            }
        }
    }



    let api = {
        update: update,
        render: render,
        makeTower: makeTower,
        deleteTower: deleteTower,
        get towerDictionary() { return towerDictionary; },
    };

    return api;
}