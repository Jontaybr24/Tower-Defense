MyGame.objects.Towers = function (assets, graphics, magic, lasers) {
    'use strict';
    let RADS = magic.CELL_SIZE;

    let towerDictionary = {
        Turret: {
            name: "Turret",
            cost: 50,
            radius: 2.5,
            damage: 5,
            fireRate: 2, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [75, 150, 200],
                    [50, 100, 150],
                    [50, 100, 10050],],
                radius: [
                    [1, 0, 0],
                    [.5, 0, .5],
                    [1, 0, .5],],
                damage: [
                    [0, 1, 0],
                    [5, 0, 0],
                    [5, 0, 0],],
                fireRate: [
                    [0, 0, 1],
                    [0, 1, 0],
                    [0, 1, 0],],
            },
            renderPreview: renderPreview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            activate: function (tower, targets) {
                let pos = JSON.parse(JSON.stringify(tower.center));
                let color = assets.laser_basic;
                let virus = function(enemy, data){
                    enemy.takeHit(enemy, data.damage)
                }
                let data = {
                    damage: tower.damage,
                }

                
                if (tower.level >= 2) {
                    if (tower.path == 0) {
                        console.log("red tower");
                    }
                    else if (tower.path == 1) {
                        color = assets.laser_ice;
                    }
                    else if (tower.path == 2) {
                        color = assets.laser_acid;
                    }
                }
                lasers.createLaser(targets[0], pos, virus, data, color);
            },
        },
    };

    let towers = {};
    let count = 0;
    let OFFSET = Math.PI / 2; // rotate tower head asset by 90 degrees


    function render() {
        for (let index in towers) {
            let tower = towers[index];
            let base = assets[tower.name + "_base"];
            graphics.drawTexture(base, tower.center, 0, { x: magic.CELL_SIZE, y: magic.CELL_SIZE }) // renders the tower base
            let towerHead = assets[tower.name + "_" + tower.path + "_" + tower.level] // Gets the image of the tower head based on the level of the tower
            graphics.drawTexture(towerHead, tower.center, tower.rotation + OFFSET, { x: magic.CELL_SIZE, y: magic.CELL_SIZE }) // Renders the tower head            
        }
    }

    function renderPreview(tower, pos, level, path, size) {
        let base = assets[tower.name + "_base"];
        let towerHead = assets[tower.name + "_" + path + "_" + level] // Gets the image of the tower head based on the level of the tower
        graphics.drawTexture(base, pos, 0, size) // renders the tower base
        graphics.drawTexture(towerHead, pos, 0, size) // Renders the tower head    
    }

    function update(elapsedTime) {
        for (let idx in towers) {
            let tower = towers[idx];
            tower.lastShot += elapsedTime;

            // check to see if the enemies have left the radius, if they have, remove them
            for (let enemy in tower.enemies) {
                if (magic.magnitude(tower.center, tower.enemies[enemy].center) > tower.radius) {
                    tower.enemies.splice(enemy, 1);
                }
            }

            // check to see the there are enemies in the towers radius
            if (tower.enemies.length > 0) {
                // if the tower needs a target first turn to target before activating
                if (tower.needTarget) {
                    tower.target = tower.enemies[0];
                    let result = magic.computeAngle(tower.rotation, tower.center, tower.target.center);
                    // checks if the angle between the target is below the tollerance otherwise keep turning
                    if (magic.testTolerance(result.angle, 0, .04) === false) {
                        if (result.crossProduct > 0) {
                            tower.rotation += tower.spinRate * elapsedTime;
                        } else {
                            tower.rotation -= tower.spinRate * elapsedTime;
                        }
                    }
                    else {
                        // the tower needs to wait a specific time before it can activate again
                        if (tower.lastShot > (1000 / tower.fireRate)) {
                            tower.lastShot = 0;
                            tower.activate(tower, tower.enemies);
                        }
                    }
                }
                // the tower needs to wait a specific time before it can activate again
                else {
                    if (tower.lastShot > (1000 / tower.fireRate)) {
                        tower.lastShot = 0;
                        tower.activate(tower);
                    }
                }
            }
        }
    }

    // if an enemy died, we need to remove it from the radius of all other towers
    function removeTarget(target) {
        for (let idx in towers) {
            for (let enemy in towers[idx].enemies) {
                if (towers[idx].enemies[enemy].id == target.id){
                    towers[idx].target = null;
                towers[idx].enemies.splice(enemy, 1);}
            }
        }
    }

    function makeTower(pos, name) {
        let tower = JSON.parse(JSON.stringify(towerDictionary[name]));
        tower.center = pos;
        tower.level = 0;
        tower.path = 3;
        tower.id = count++;
        tower.spinRate = magic.RPS;
        tower.type = "tower"
        tower.radius = tower.radius * magic.CELL_SIZE;
        tower.rotation = 0;
        tower.enemies = [];
        tower.lastShot = 0;
        tower.activate = towerDictionary[name].activate;
        tower.renderPreview = renderPreview;
        towers[tower.id] = tower;
        return tower;
    }

    function getTower(name) {
        let tower = JSON.parse(JSON.stringify(towerDictionary[name]))
        return tower;
    }

    function deleteTower(tower) {
        if (tower.id in towers) {
            delete towers[tower.id];
        }
    }

    function addEnemy(tower, enemy) {
        if (!(tower.enemies.includes(enemy)))
            towers[tower.id].enemies.push(enemy);
    }

    function upgrade(tower, path) {
        let spent = 0;
        if (tower != null) {
            if (tower.path == 3) {
                tower.path = path;
            }
            if (tower.level < 3) {
                path = tower.path;
                tower.level += 1;
                spent = tower.upgrades["cost"][path].shift();
                tower.cost += spent;
                tower.damage += tower.upgrades["damage"][path].shift();
                tower.fireRate += tower.upgrades["fireRate"][path].shift();
                tower.radius += tower.upgrades["radius"][path].shift() * magic.CELL_SIZE;
            }
        }
        return spent;
    }

    let api = {
        update: update,
        render: render,
        getTower: getTower,
        makeTower: makeTower,
        deleteTower: deleteTower,
        addEnemy: addEnemy,
        upgrade: upgrade,
        removeTarget: removeTarget,
        get towerDictionary() { return towerDictionary; },
        get towers() { return towers; },
    };

    return api;
}