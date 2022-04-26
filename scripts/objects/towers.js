MyGame.objects.Towers = function (assets, graphics, magic, lasers, sounds, missiles, particles, bombs) {
    'use strict';

    let towerDictionary = {
        Wall: {
            name: "Wall",
            cost: 5,
            radius: 0,
            damage: 0,
            fireRate: 0, // times per second it can shoot in ms 
            renderPreview: renderPreview, // the piction image
            needTarget: false, // if the tower needs to turn to target before activating
            activate: function () { },
        },
        Turret: {
            name: "Turret",
            cost: 50,
            radius: 2.5,
            damage: 1,
            fireRate: 1, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [50, 100, 150],
                    [50, 100, 150],
                    [50, 100, 150],],
                radius: [
                    [0, 0, 0],
                    [0, 0, 0],
                    [1, 0, 0],],
                damage: [
                    [1, 1, 2],
                    [0, 0, 0],
                    [0, 1, 1],],
                fireRate: [
                    [0, 0, 0],
                    [0, -.5, 0],
                    [0, -.8, 0],],
            },
            renderPreview: renderPreview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            targetAir: true,
            targetGround: true,
            activate: function (tower, targets) {
                let color = assets.laser_basic;
                let virus = function (enemy, data) {
                    enemy.takeHit(enemy, data.damage)
                }
                let data = {
                    damage: tower.damage,
                }
                let vel = magic.computeVelocity(tower.center, targets[0].center);

                if (tower.level >= 2) {
                    if (tower.path == 0) {
                        virus = function (enemy, data) {
                            // add status effect here
                            let status = { type: "slow", time: 5000, amount: .5 }
                            enemy.takeHit(enemy, data.damage)
                            enemy.setStatus(enemy, status);
                        }
                    }
                    else if (tower.path == 1) {
                        color = assets.laser_ice;

                        virus = function (enemy, data) {
                            // add status effect here
                            let status = { type: "ice", time: 500 }
                            enemy.takeHit(enemy, data.damage)
                            enemy.setStatus(enemy, status);
                        }
                    }
                    else if (tower.path == 2) {
                        color = assets.laser_acid;
                        virus = function (enemy, data) {
                            // add status effect here
                            let status = { type: "poison", time: 2500, interval: 500, dmg: tower.damage }
                            enemy.takeHit(enemy, data.damage)
                            enemy.setStatus(enemy, status)
                        }
                    }
                }
                lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);

            },
        },
        AirTower: {
            name: "AirTower",
            cost: 60,
            radius: 1.5,
            damage: 5,
            fireRate: 2, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [75, 150, 200],
                    [50, 100, 150],
                    [50, 100, 150],],
                radius: [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, .5],],
                damage: [
                    [0, 1, 0],
                    [0, 0, 50],
                    [5, 0, 0],],
                fireRate: [
                    [0, 0, 1],
                    [0, 1, 0],
                    [0.1, .1, 0.1],],
            },
            renderPreview: renderPreview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            targetAir: true,
            targetGround: false,
            activate: function (tower, targets) {
                let color = assets.laser_basic;
                let vel = magic.computeVelocity(tower.center, targets[0].center);
                let virus = function (enemy, data) {
                    enemy.takeHit(enemy, data.damage);
                }
                let data = {
                    damage: tower.damage,
                }
                lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
            },
        },
        Launcher: {
            name: "Launcher",
            cost: 100,
            radius: 9.5,
            damage: 100,
            fireRate: .5, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [75, 150, 200],
                    [50, 100, 150],
                    [50, 100, 150],],
                radius: [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, .5],],
                damage: [
                    [0, 1, 0],
                    [0, 0, 50],
                    [5, 0, 0],],
                fireRate: [
                    [0, 0, 1],
                    [0, 1, 0],
                    [0.1, .1, 0.1],],
            },
            renderPreview: renderPreview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            targetAir: true,
            targetGround: true,
            activate: function (tower, targets) {
                let towerHead = assets[tower.name + "_" + tower.path + "_" + tower.level];
                let vel = magic.computeVelocity(tower.center, targets[0].center);
                let pos = JSON.parse(JSON.stringify(tower.center));
                let virus = function (enemy, data) {
                    enemy.takeHit(enemy, data.damage)
                }
                let data = {
                    damage: tower.damage,
                }
                if (tower.level >= 2 && tower.path == 2) {
                    missiles.createMissile(vel, targets[0], pos, virus, data, 100 / 1000, towerHead);
                }
                else if (tower.level >= 2 && tower.path == 1){
                    let rot = magic.computeRotation(vel);
                    let vel1 = magic.computeFromRot(rot + Math.PI / 4);
                    let vel2 = magic.computeFromRot(rot - Math.PI / 4);
                    missiles.createMissile(vel1, targets[0], JSON.parse(JSON.stringify(tower.center)), virus, data, 50 / 1000, towerHead);
                    missiles.createMissile(vel2, targets[0], JSON.parse(JSON.stringify(tower.center)), virus, data, 50 / 1000, towerHead);
                }
                else {
                    missiles.createMissile(vel, targets[0], pos, virus, data, 50 / 1000, towerHead);
                }
            },
        },
        Ringtrap: {
            name: "Ringtrap",
            cost: 500,
            radius: 1.5,
            damage: 15,
            fireRate: .5, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [50, 100, 150],
                    [50, 100, 150],
                    [50, 100, 150],],
                radius: [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0],],
                damage: [
                    [1, 1, 3],
                    [0, 0, 0],
                    [0, 0, 0],],
                fireRate: [
                    [0, 0, 0],
                    [0, 0, 0],
                    [0.5, .5, 0.5],],
            },
            renderPreview: renderPreview, // the piction image
            needTarget: false, // if the tower needs to turn to target before activating
            targetAir: false,
            targetGround: true,
            activate: function (tower, targets) {

                // need to add paths
                particles.makeFireRing(tower.center);
                for (let enemy in targets) {
                    targets[enemy].takeHit(targets[enemy], tower.damage)
                }
            },
        },
        Bomb: {
            name: "Bomb",
            cost: 500,
            radius: 1.5,
            damage: 10,
            fireRate: .5, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [75, 150, 200],
                    [50, 100, 150],
                    [50, 100, 150],],
                radius: [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, .5],],
                damage: [
                    [0, 1, 0],
                    [0, 0, 0],
                    [5, 0, 0],],
                fireRate: [
                    [0, 0, 1],
                    [0, 1, 0],
                    [0.1, .1, 0.1],],
            },
            renderPreview: renderPreview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            targetAir: false,
            targetGround: true,
            activate: function (tower, targets) {
                let pos = JSON.parse(JSON.stringify(tower.center));
                let vel = magic.computeVelocity(tower.center, targets[0].center);
                let size = {x: magic.CELL_SIZE * .75, y: magic.CELL_SIZE * .75};
                let radius = magic.CELL_SIZE * 2.5;
                let sradius = magic.CELL_SIZE * 1.5;
                let virus = function (enemy, data) {
                    enemy.takeHit(enemy, data.damage)
                }
                let sideEffect = function(bomb, data){
                    data.damage = data.damage2;
                    let vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                    bombs.createBomb(vel, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data.sideEffect, data, data.img, data.size, data.radius);
                    vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                    bombs.createBomb(vel, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data.sideEffect, data, data.img, data.size, data.radius);
                    vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                    bombs.createBomb(vel, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data.sideEffect, data, data.img, data.size, data.radius);
                    vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                    bombs.createBomb(vel, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data.sideEffect, data, data.img, data.size, data.radius);
                    vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                    bombs.createBomb(vel, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data.sideEffect, data, data.img, data.size, data.radius);
                    particles.makeExplosion(bomb.center)
                }
                let data = {
                    damage: tower.damage,
                    damage2: tower.damage / 2,
                    img: assets.bomb,
                    size: {x: size.x / 2, y: size.y / 2},
                    radius: sradius,
                    sideEffect: function(bomb){
                        particles.makeExplosion(bomb.center);
                    }
                }
                bombs.createBomb(vel, pos, virus, sideEffect, data, assets.bomb, size, radius);
            },
        },
        MachineGun: {
            name: "MachineGun",
            cost: 500,
            radius: 1.5,
            damage: 1,
            fireRate: 10, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [75, 150, 200],
                    [50, 100, 150],
                    [50, 100, 150],],
                radius: [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0],],
                damage: [
                    [1, 1, 1],
                    [0, 0, 0],
                    [0, 0, 0],],
                fireRate: [
                    [0, 0, 0],
                    [0, 1, 0],
                    [5, 5, 10],],
            },
            renderPreview: renderPreview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            targetAir: false,
            targetGround: true,
            activate: function (tower, targets) {
                let color = assets.laser_basic;
                let vel = magic.computeVelocity(tower.center, targets[0].center);
                let virus = function (enemy, data) {
                    enemy.takeHit(enemy, data.damage);
                }
                let data = {
                    damage: tower.damage,
                }
                lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
            },
        },
        Trigun: {
            name: "Trigun",
            cost: 500,
            radius: 1.5,
            damage: 5,
            fireRate: 2, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [75, 150, 200],
                    [50, 100, 150],
                    [50, 100, 150],],
                radius: [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, .5],],
                damage: [
                    [0, 1, 0],
                    [0, 0, 50],
                    [5, 0, 0],],
                fireRate: [
                    [0, 0, 1],
                    [0, 1, 0],
                    [0.1, .1, 0.1],],
            },
            renderPreview: renderPreview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            targetAir: false,
            targetGround: true,
            activate: function (tower, targets) {
                let color = assets.laser_basic;
                let vel = magic.computeVelocity(tower.center, targets[0].center);
                let rot = magic.computeRotation(vel);
                let vel2 = magic.computeFromRot(rot + Math.PI / 8);
                let vel3 = magic.computeFromRot(rot - Math.PI / 8);
                let virus = function (enemy, data) {
                    enemy.takeHit(enemy, data.damage);
                }
                let data = {
                    damage: tower.damage,
                }
                if (tower.level == 3) {
                }
                lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                lasers.createLaser(vel2, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                lasers.createLaser(vel3, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
            },
        },
    };
    let partialDict = {};

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
                        tower.activate(tower, tower.enemies);
                    }
                }
            }
        }
    }

    // if an enemy died, we need to remove it from the radius of all other towers
    function removeTarget(target) {
        for (let idx in towers) {
            for (let enemy in towers[idx].enemies) {
                if (towers[idx].enemies[enemy].id == target.id) {
                    towers[idx].target = null;
                    towers[idx].enemies.splice(enemy, 1);
                }
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
        tower.lastShot = 1000 / tower.fireRate;
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
        if (enemy.type == "ground" && tower.targetGround || enemy.type == "flying" && tower.targetAir) {
            if (!(tower.enemies.includes(enemy)))
                towers[tower.id].enemies.push(enemy);
        }
    }

    function upgrade(tower, path) {
        let spent = 0;
        if (tower != null && "upgrades" in tower) {
            if (tower.path == 3) {
                tower.path = path;
            }
            if (tower.level < 3 && path == tower.path) {
                tower.level += 1;
                let string = "upgrade" + tower.level;
                sounds.play(assets[string]);
                spent = tower.upgrades["cost"][path].shift();
                tower.cost += spent;
                tower.damage += tower.upgrades["damage"][path].shift();
                tower.fireRate += tower.upgrades["fireRate"][path].shift();
                tower.radius += tower.upgrades["radius"][path].shift() * magic.CELL_SIZE;
            }
        }
        return spent;
    }

    function clearAll() {
        partialDict = {};
        for (let idx in towers) {
            deleteTower(towers[idx]);
        }
    }

    function loadTowers(num) {
        clearAll();
        let i = 0;
        for (let idx in towerDictionary) {
            if (i++ < num) {
                partialDict[idx] = towerDictionary[idx];
            }
        }
    }

    function getTowerValue() {
        let score = 0;
        for (let idx in towers) {
            score += towers[idx].cost;
        }
        return score;
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
        clearAll: clearAll,
        loadTowers: loadTowers,
        getTowerValue: getTowerValue,
        get towerDictionary() { return partialDict; },
        get towers() { return towers; },
    };

    return api;
}