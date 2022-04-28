MyGame.objects.Towers = function (assets, graphics, magic, lasers, sounds, missiles, particles, bombs) {
    'use strict';

    let enemies = null;

    let towerDictionary = {
        Wall: {
            name: "Wall",
            description: "A Wall for guiding enemies",
            cost: 10,
            radius: 0,
            damage: 0,
            fireRate: 0, // times per second it can shoot in ms 
            renderPreview: renderPreview, // the piction image
            needTarget: false, // if the tower needs to turn to target before activating
            activate: function () { },
        },
        Turret: {
            name: "Turret",
            description: "A Simple Turret with paths\n focused on strong single target \nstatus effects",
            cost: 50,
            radius: 2.5,
            damage: 5,
            fireRate: 2, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [50, 100, 150],
                    [50, 100, 150],
                    [50, 100, 150],],
                radius: [
                    [1, 0, 2],
                    [1, 1, 0],
                    [1, 0, 0],],
                damage: [
                    [1, 2, 4],
                    [0, -1, 0],
                    [0, 1, 10],],
                fireRate: [
                    [0, 0, 0],
                    [0, -1, -.5],
                    [0, 0, -.8],],
                des: [
                    ["Small increase to damage and\nrange", "Increases damage\nAdds a slow effect", "Big increase to range and damage,\nIcresses amount slowed\nIncreses duration slowed"],
                    ["Increase Radius", "Now freezes enemies in place,\nLowers fire rate and damage", "Improves freeze effect\nLowers fire rate"],
                    ["Increase Radius", "Adds a corrosive status\nDeals damage over time", "Strong corrosive effect\nIncresses dmg"],
                ]
            },
            renderPreview: renderPreview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            targetAir: false,
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
                            if (tower.level == 3)
                                status = { type: "slow", time: 10000, amount: .2 }


                            enemy.takeHit(enemy, data.damage)
                            enemy.setStatus(enemy, status);
                        }
                    }
                    else if (tower.path == 1) {
                        color = assets.laser_ice;

                        virus = function (enemy, data) {
                            // add status effect here
                            let status = { type: "ice", time: 500 }
                            if (tower.level == 3)
                                status = { type: "ice", time: 1200 }
                            enemy.takeHit(enemy, data.damage)
                            enemy.setStatus(enemy, status);
                        }
                    }
                    else if (tower.path == 2) {
                        color = assets.laser_acid;
                        virus = function (enemy, data) {
                            // add status effect here
                            let status = { type: "poison", time: 2500, interval: 500, dmg: tower.damage }
                            if (tower.level == 3)
                                status = { type: "poison", time: 6000, interval: 250, dmg: tower.damage }
                            enemy.takeHit(enemy, data.damage)
                            enemy.setStatus(enemy, status)
                        }
                    }
                }
                lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);

            },
        },
        Ringtrap: {
            name: "Ringtrap",
            description: "Shoots a ring of fire damaging all \nground enemies in its radius",
            cost: 75,
            radius: 1.5,
            damage: 15,
            fireRate: .5, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [50, 100, 150],
                    [50, 200, 500],
                    [50, 100, 150],],
                radius: [
                    [0, 1, 0],
                    [0, 0, 1],
                    [1, 0, 0],],
                damage: [
                    [1, 2, 10],
                    [0, -7, 7],
                    [0, -15, 0],],
                fireRate: [
                    [0, 0, 0],
                    [.5, 2, 0],
                    [0, 0, .3],],
                des: [
                    ["Increses damage", "Increses damage\nIncreses Range", " Massive increase to damage"],
                    ["Incresses fire rate", " Big Incresses to fire rate\nat the cost of damage", "Removes damage penalty"],
                    ["Incresses range", "Converts fire into an Ice wave\nfrezing enimes at the\ncost of all damage", "Incresses freaze duration"],
                ]
            },
            renderPreview: renderPreview, // the piction image
            needTarget: false, // if the tower needs to turn to target before activating
            targetAir: false,
            targetGround: true,
            activate: function (tower, targets) {

                if (tower.level >= 2) {
                    if (tower.path == 0) {
                        particles.makeRing(tower.center, (tower.radius / magic.CELL_SIZE - .5), magic.pallets.fire);
                        for (let enemy in targets) {
                            targets[enemy].takeHit(targets[enemy], tower.damage)
                        }
                    }
                    else if (tower.path == 1) {
                        particles.makeRing(tower.center, (tower.radius / magic.CELL_SIZE - .5), magic.pallets.smoke);
                        for (let enemy in targets) {
                            targets[enemy].takeHit(targets[enemy], tower.damage)
                        }
                    }
                    else if (tower.path == 2) {

                        particles.makeRing(tower.center, (tower.radius / magic.CELL_SIZE - .5), magic.pallets.ice);
                        for (let enemy in targets) {
                            targets[enemy].takeHit(targets[enemy], tower.damage)
                            let status = { type: "ice", time: 200 }
                            if (tower.level == 3)
                                status = { type: "ice", time: 500 }
                            targets[enemy].setStatus(targets[enemy], status);
                        }
                    }
                }
                else {             
                    particles.makeRing(tower.center, (tower.radius / magic.CELL_SIZE - .5), magic.pallets.fire);       
                    for (let enemy in targets) {
                        targets[enemy].takeHit(targets[enemy], tower.damage)
                    }
                }
            },
        },
        AirTower: {
            name: "AirTower",
            description: "Only targets air enemies",
            cost: 60,
            radius: 2.5,
            damage: 5,
            fireRate: 2, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [50, 150, 100],
                    [50, 100, 150],
                    [50, 150, 300],],
                radius: [
                    [0, -1, 0],
                    [1, 2, 4],
                    [2, 4, 4],],
                damage: [
                    [0, -2, -2.5],
                    [0, 10, 35],
                    [0, 1, 2],],
                fireRate: [
                    [1, 2, 4],
                    [0, -1, -.5],
                    [0, 0, .5],],
                des: [
                    ["Incresses fire rate", "Increase fire rate at the \ncost of damage\nAdds a slow effect", "Massive increase to fire rate\nat cost of damage\nStronger slow"],
                    ["Incresses Range", "Big increase to damage \nat cost of fire rate", "Massive increase to damage at cost of fire rate"],
                    ["Incresses Range", "Incresses Range\nIncresses fire rate\nSmall damage increase", "Incresses Range\nBig increase fire rate\nIncrease to damage"],
                ]
            },
            renderPreview: renderPreview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            targetAir: true,
            targetGround: false,
            activate: function (tower, targets) {
                let color = assets.laser_basic;
                let vel = magic.computeVelocity(tower.center, targets[0].center);
                let virus = function (enemy, data) {
                    enemy.takeHit(enemy, data.damage)
                }
                if (tower.level >= 2) {
                    if (tower.path == 0) {
                        virus = function (enemy, data) {
                            // add status effect here
                            let status = { type: "slow", time: 5000, amount: .5 }
                            if (tower.level == 3)
                                status = { type: "slow", time: 15000, amount: .3 }


                            enemy.takeHit(enemy, data.damage);
                            enemy.setStatus(enemy, status);
                        }
                    }
                    else if (tower.path == 1) {


                        virus = function (enemy, data) {
                            enemy.takeHit(enemy, data.damage);
                        }
                    }
                    else if (tower.path == 2) {

                        virus = function (enemy, data) {
                            enemy.takeHit(enemy, data.damage)
                        }
                    }
                }
                let data = {
                    damage: tower.damage,
                }
                lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
            },
        },
        Bomb: {
            name: "Bomb",
            description: "Shoots a bomb that explodes on \nimpact damaging all ground troops \nin the explosion",
            cost: 150,
            radius: 1.5,
            damage: 10,
            fireRate: .5, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [75, 100, 200],
                    [75, 150, 200],
                    [75, 100, 150],],
                radius: [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, .5],],
                damage: [
                    [0, 1, 0],
                    [0, 0, 0],
                    [1, 3, 5],],
                fireRate: [
                    [0, .5, 0],
                    [0, 0, 0],
                    [0.1, .1, 0.2],],
                des: [
                    ["Incresses Radius", "Adds corosive effect\nto bombs blast radius", "Stronger corosive effect"],
                    ["Incresses Radius", "Explotions cause shrapnal\nto shoot out", "Explodes into more bombs"],
                    ["Incresses damage and fire rate", "Incresses damage", "Incresses damage"],
                ]
            },
            renderPreview: renderPreview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            targetAir: false,
            targetGround: true,
            activate: function (tower, targets) {
                let speed = 400 / 1000; // speed in pixels per ms
                let color = assets.laser_black;
                let pos = JSON.parse(JSON.stringify(tower.center));
                let vel = magic.computeVelocity(tower.center, targets[0].center);
                let size = { x: magic.CELL_SIZE * .75, y: magic.CELL_SIZE * .75 };
                let radius = magic.CELL_SIZE * 2.5;
                let sradius = magic.CELL_SIZE * 1.5;
                let virus = function (enemy, data) {
                    enemy.takeHit(enemy, data.damage)
                    //sounds.play(assets.boom);
                }
                let sideEffect = function (bomb, data) {
                    sounds.play(assets.boom);
                    particles.makeExplosion(bomb.center, magic.pallets.fire);
                };
                if (tower.level >= 2) {
                    if (tower.path == 0) {
                        virus = function (enemy, data) {
                            // add status effect here
                            //sounds.play(assets.boom);
                            let status = { type: "poison", time: 1000, interval: 500, dmg: tower.damage / 4 }
                            if (tower.level == 3)
                                status = { type: "poison", time: 1500, interval: 500, dmg: tower.damage/2 }
                            enemy.setStatus(enemy, status);
                            enemy.takeHit(enemy, data.damage);
                        }

                        sideEffect = function (bomb, data) {
                            sounds.play(assets.boom);
                            particles.makeExplosion(bomb.center, magic.pallets.acid);
                        };
                    }
                    else if (tower.path == 1) {
                        sideEffect = function (bomb, data) {
                            data.damage = data.damage2;
                            sounds.play(assets.boom);

                            //lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                            let vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                            lasers.createLaser(vel, enemies, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data, color);
                            vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                            lasers.createLaser(vel, enemies, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data, color);
                            vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                            lasers.createLaser(vel, enemies, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data, color);
                            vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                            lasers.createLaser(vel, enemies, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data, color);
                            vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                            lasers.createLaser(vel, enemies, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data, color);
                            particles.makeExplosion(bomb.center, magic.pallets.fire);
                        }
                        if (tower.level == 3) {
                            sideEffect = function (bomb, data) {
                                data.damage = data.damage2;
                                sounds.play(assets.boom);
                                let vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                                bombs.createBomb(vel, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data.sideEffect, data, data.img, data.size, data.radius, data.speed);
                                vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                                bombs.createBomb(vel, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data.sideEffect, data, data.img, data.size, data.radius, data.speed);
                                vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                                bombs.createBomb(vel, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data.sideEffect, data, data.img, data.size, data.radius, data.speed);
                                vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                                bombs.createBomb(vel, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data.sideEffect, data, data.img, data.size, data.radius, data.speed);
                                vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
                                bombs.createBomb(vel, JSON.parse(JSON.stringify(bomb.center)), bomb.virus, data.sideEffect, data, data.img, data.size, data.radius, data.speed);
                                particles.makeExplosion(bomb.center, magic.pallets.fire);
                            }
                        }
                        virus = function (enemy, data) {

                            enemy.takeHit(enemy, data.damage);
                        }
                    }
                    else if (tower.path == 2) {

                    }

                }
                let data = {
                    damage: tower.damage,
                    damage2: tower.damage / 2,
                    speed: speed / 3,
                    img: assets.bomb,
                    size: { x: size.x / 2, y: size.y / 2 },
                    radius: sradius,
                    sideEffect: function (bomb) {
                        particles.makeExplosion(bomb.center, magic.pallets.fire);
                    }
                }
                bombs.createBomb(vel, pos, virus, sideEffect, data, assets.bomb, size, radius, speed);
            },
        },
        Trigun: {
            name: "Trigun",
            description: "Fires a spread of three lasers",
            cost: 200,
            radius: 1.5,
            damage: 5,
            fireRate: 2, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [75, 150, 500],
                    [50, 100, 150],
                    [50, 200, 250],],
                radius: [
                    [1, 1, 0],
                    [1, 1, 0],
                    [0, 1, .5],],
                damage: [
                    [0, 0, 2],
                    [0, 0, 0],
                    [0, 0, 5],],
                fireRate: [
                    [0, 2, 3],
                    [0, 1, .5],
                    [1, 1, 0],],
                des: [
                    ["Increases Range ", "Increases Range and\nBig increase to FireRate", "Big increase to Damage and FireRate"],
                    ["Incresses Range", "Adds additional shot", "Adds additional shot"],
                    ["Incresses FireRate", "Tightens spread", "Massive increase to Damage"],
                ]
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
                if (tower.level >= 1) {
                    if (tower.path == 0) {
                        //this.targetAir = true;
                        lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                        lasers.createLaser(vel2, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                        lasers.createLaser(vel3, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                    }
                    else if (tower.path == 1) {
                        //more shots 
                        if (tower.level == 2) {
                            vel = magic.computeFromRot(rot + Math.PI / 20);
                            let vel4 = magic.computeFromRot(rot - Math.PI / 20);
                            lasers.createLaser(vel4, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                        }
                        else if (tower.level == 3) {
                            let vel5 = magic.computeFromRot(rot + Math.PI / 20);
                            let vel4 = magic.computeFromRot(rot - Math.PI / 20);
                            lasers.createLaser(vel4, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                            lasers.createLaser(vel5, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                        }
                        lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                        lasers.createLaser(vel2, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                        lasers.createLaser(vel3, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);

                    }
                    else if (tower.path == 2) {
                        //tighter spred
                        if (tower.level >= 2) {
                            vel2 = magic.computeFromRot(rot + Math.PI / 16);
                            vel3 = magic.computeFromRot(rot - Math.PI / 16);
                        }
                        else {
                        }
                        lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                        lasers.createLaser(vel2, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                        lasers.createLaser(vel3, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                    }
                }
                else {
                    lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                    lasers.createLaser(vel2, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                    lasers.createLaser(vel3, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
                }
            },
        },
        MachineGun: {
            name: "MachineGun",
            description: "Low damage, high shooting speed",
            cost: 250,
            radius: 1.5,
            damage: 5,
            fireRate: 10, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [100, 250, 500],
                    [50, 100, 200],
                    [50, 200, 300],],
                radius: [
                    [1, 1, 0],
                    [1, 1, 1],
                    [1, 0, 1],],
                damage: [
                    [2, 5, 8],
                    [0, 0, 0],
                    [0, 0, 0],],
                fireRate: [
                    [0, 0, 0],
                    [0, 0, 0],
                    [5, 5, 10],],
                des: [
                    ["Increses Range and Damage", "Increses Range and \n big increse to Damage", "big increse to Damage"],
                    ["Incresses Range", "Adds slow effect", "Stronges slow effect"],
                    ["Incresses FireRate", "Incresses FireRate \n Now targets air", "Massive increse to FireRate"],
                ]
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
                if (tower.level >= 2) {
                    if (tower.path == 0) {

                    }
                    else if (tower.path == 1) {


                        virus = function (enemy, data) {
                            let status = { type: "slow", time: 5000, amount: .7 }
                            if (tower.level == 3)
                                status = { type: "slow", time: 15000, amount: .5 }


                            enemy.takeHit(enemy, data.damage);
                            enemy.setStatus(enemy, status);
                        }
                    }
                    else if (tower.path == 2) {
                        if (tower.level == 3)
                            this.targetAir = true;
                    }
                }
                lasers.createLaser(vel, targets, JSON.parse(JSON.stringify(tower.center)), virus, data, color);
            },
        },
        Launcher: {
            name: "Launcher",
            description: "Fires a homing missile that follows \nits target \ntargets both air and ground",
            cost: 100,
            radius: 9.5,
            damage: 100,
            fireRate: .5, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [100, 300, 1000],
                    [100, 500, 500],
                    [100, 300, 300],],
                radius: [
                    [1, 1, 2],
                    [1, 1, 1],
                    [0, 0, 2],],
                damage: [
                    [0, 100, 8000],
                    [0, 0, 50],
                    [0, 0, 0],],
                fireRate: [
                    [0, 0, 0],
                    [0, 1, 0],
                    [0.1, .1, 0.1],],
                des: [
                    ["Incresses radius ", "Big incress to dmg at\nthe cost of fire rate\nrocket speed icressed", "Rocket will one shot anything\nrocket speed icressed"],
                    ["Incresses radius", "Shoots twin rockets at half dmg", "incresses damage of twin rockets\nto full damage"],
                    ["Slight incress to fire rate", "Adds a corosive effect on impact", " Stronger corosive effect"],
                ]
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
                if (tower.level >= 2) {
                    if (tower.path == 0) {
                        if (tower.level == 2)
                            missiles.createMissile(vel, targets[0], pos, virus, data, 100 / 1000, towerHead, magic.pallets.smoke);
                        else
                            missiles.createMissile(vel, targets[0], pos, virus, data, 200 / 1000, towerHead, magic.pallets.smoke);


                    }
                    else if (tower.path == 1) {

                        let rot = magic.computeRotation(vel);
                        let vel1 = magic.computeFromRot(rot + Math.PI / 4);
                        let vel2 = magic.computeFromRot(rot - Math.PI / 4);
                        missiles.createMissile(vel1, targets[0], JSON.parse(JSON.stringify(tower.center)), virus, data, 50 / 1000, towerHead, magic.pallets.smoke);
                        missiles.createMissile(vel2, targets[0], JSON.parse(JSON.stringify(tower.center)), virus, data, 50 / 1000, towerHead, magic.pallets.smoke);

                    }
                    else if (tower.path == 2) {

                        virus = function (enemy, data) {
                            enemy.takeHit(enemy, data.damage)
                            let status = { type: "poison", time: 2500, interval: 500, dmg: tower.damage / 10 }
                            if (tower.level == 3)
                                status = { type: "poison", time: 2000, interval: 250, dmg: tower.damage / 5 }
                            enemy.setStatus(enemy, status);
                        }

                        missiles.createMissile(vel, targets[0], JSON.parse(JSON.stringify(tower.center)), virus, data, 50 / 1000, towerHead, magic.pallets.acid);
                    }
                }
                else
                    missiles.createMissile(vel, targets[0], pos, virus, data, 50 / 1000, towerHead, magic.pallets.smoke);

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
        sounds.play(assets.place)
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
                tower.upgrades["des"][path].shift();
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
        set enemies(val) { enemies = val },
        get towerDictionary() { return partialDict; },
        get towers() { return towers; },
    };

    return api;
}