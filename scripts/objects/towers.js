MyGame.objects.Towers = function (assets, graphics, magic) {
    'use strict';
    let RADS = magic.CELL_SIZE;

    let towerDictionary = {
        turret: {
            name: "turret",
            cost: 50,
            radius: 2.5,
            damage: 5,
            fireRate: 2, // times per second it can shoot in ms 
            upgrades: {
                cost: [
                    [75, 150, 200],
                    [50, 100, 150],],
                radius: [
                    [0, 0, .5],
                    [.5, 0, .5],],
                damage: [
                    [0, 0, 0],
                    [5, 0, 0],],
                fireRate: [
                    [0, 0, 0],
                    [0, 1, 0],],
            },
            preview: assets.turret_preview, // the piction image
            needTarget: true, // if the tower needs to turn to target before activating
            activate: function (tower, target) {
                if (target.takeHit(target, tower.damage))
                    removeTarget(target)

            },
        },
    };

    let towers = {};
    let count = 0;
    let OFFSET = Math.PI / 2; // rotate tower head asset by 90 degrees

    //------------------------------------------------------------------
    //
    // Returns the magnitude of the 2D cross product.  The sign of the
    // magnitude tells you which direction to rotate to close the angle
    // between the two vectors.
    //
    //------------------------------------------------------------------
    function crossProduct2d(v1, v2) {
        return (v1.x * v2.y) - (v1.y * v2.x);
    }

    //------------------------------------------------------------------
    //
    // Computes the angle, and direction (cross product) between two vectors.
    //
    //------------------------------------------------------------------
    function computeAngle(rotation, ptCenter, ptTarget) {
        let v1 = {
            x: Math.cos(rotation),
            y: Math.sin(rotation)
        };
        let v2 = {
            x: ptTarget.x - ptCenter.x,
            y: ptTarget.y - ptCenter.y
        };

        v2.len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        v2.x /= v2.len;
        v2.y /= v2.len;

        let dp = v1.x * v2.x + v1.y * v2.y;
        let angle = Math.acos(dp);

        //
        // Get the cross product of the two vectors so we can know
        // which direction to rotate.
        let cp = crossProduct2d(v1, v2);

        return {
            angle: angle,
            crossProduct: cp
        };
    }

    //------------------------------------------------------------------
    //
    // Simple helper function to help testing a value with some level of tolerance.
    //
    //------------------------------------------------------------------
    function testTolerance(value, test, tolerance) {
        if (Math.abs(value - test) < tolerance) {
            return true;
        } else {
            return false;
        }
    }

    function render() {
        for (let index in towers) {
            let tower = towers[index];
            graphics.drawTexture(tower.image.base, tower.center, 0, { x: magic.CELL_SIZE, y: magic.CELL_SIZE }) // renders the tower base
            let towerHead = assets[tower.image.tower + "_" + tower.path + "_" + tower.level] // Gets the image of the tower head based on the level of the tower
            graphics.drawTexture(towerHead, tower.center, tower.rotation + OFFSET, { x: magic.CELL_SIZE, y: magic.CELL_SIZE }) // Renders the tower head            
        }
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
                    let result = computeAngle(tower.rotation, tower.center, tower.target.center);
                    // checks if the angle between the target is below the tollerance otherwise keep turning
                    if (testTolerance(result.angle, 0, .04) === false) {
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
                            tower.activate(tower, tower.target);
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
                if (towers[idx].enemies[enemy].id == target.id)
                    towers[idx].target = null;
                towers[idx].enemies.splice(enemy, 1);
            }
        }
    }

    function makeTower(pos, name) {
        let tower = JSON.parse(JSON.stringify(towerDictionary[name]));
        tower.center = pos;
        tower.image = { base: assets.tower_base, tower: tower.name };
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
            if (tower.path != path){
                tower.path = path;                
            }
            if (tower.level < 3) {
                tower.level += 1;
                spent = tower.upgrades["cost"][path].shift();
                tower.cost += spent;
                tower.damage += tower.upgrades["damage"][path].shift();
                let fire = tower.upgrades["fireRate"][path].shift();
                if (fire != 0)
                    tower.fireRate += 1000 / fire;
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
        get towerDictionary() { return towerDictionary; },
        get towers() { return towers; },
    };

    return api;
}