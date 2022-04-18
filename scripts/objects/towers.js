MyGame.objects.Towers = function (assets, graphics, magic) {
    'use strict';

    let towerDictionary = {
        turret: {
            name: "Basic Turret",
            cost: 50,
            image: "turret",
            radius: 10,
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

    function update(elapsedTime) {
        for (let idx in towers){
            towers[idx].rotation += towers[idx].spinRate * elapsedTime;
        }
    }

    function makeTower(pos, name) {
        let tower = JSON.parse(JSON.stringify(towerDictionary[name]))
        tower.center = pos;
        tower.image = { base: assets.tower_base, tower: tower.image };
        tower.level = Math.floor(Math.random() * 4) + 1;
        tower.id = count++;
        tower.spinRate = magic.RPS;
        tower.type = "tower"
        tower.rotation = 0;
        towers.push(tower);
        return tower;
    }

    function getTower(name){
        let tower = JSON.parse(JSON.stringify(towerDictionary[name]))
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
        getTower: getTower,
        makeTower: makeTower,
        deleteTower: deleteTower,
        get towerDictionary() { return towerDictionary; },
    };

    return api;
}