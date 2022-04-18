MyGame.objects.Towers = function (assets, graphics, magic) {
    'use strict';
    let RADS = magic.CELL_SIZE;
    let BASE_RADS = .5 * magic.CELL_SIZE;

    let towerDictionary = {
        turret: {
            name: "Basic Turret",
            cost: 50,
            image: "turret",
            radius: BASE_RADS + RADS * 3,
            preview: assets.turret_preview,
        },
    };

    console.log(assets.turret_preview)

    let towers = [];
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
            let towerHead = assets[tower.image.tower + "_" + tower.level] // Gets the image of the tower head based on the level of the tower
            graphics.drawTexture(towerHead, tower.center, tower.rotation + OFFSET, { x: magic.CELL_SIZE, y: magic.CELL_SIZE }) // Renders the tower head            
        }
    }

    function update(elapsedTime) {
        for (let idx in towers) {
            for (let enemy in towers[idx].enemies) {
                if (magic.converter.magnitude(towers[idx].center, towers[idx].enemies[enemy].center) > towers[idx].radius) {
                    towers[idx].enemies.splice(enemy, 1);
                }
            }
            if (towers[idx].enemies.length > 0) {
                towers[idx].target = towers[idx].enemies[0];
            }
            else {
                towers[idx].target = null; 
            }
            if (towers[idx].target != null) {
                let result = computeAngle(towers[idx].rotation, towers[idx].center, towers[idx].target.center);
                if (testTolerance(result.angle, 0, .01) === false) {
                    if (result.crossProduct > 0) {
                        towers[idx].rotation += towers[idx].spinRate * elapsedTime;
                    } else {
                        towers[idx].rotation -= towers[idx].spinRate * elapsedTime;
                    }
                }
                else{
                    console.log("Firing");
                }
            }
            console.log(towers[idx].rotation)

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
        tower.enemies = [];
        towers.push(tower);
        return tower;
    }

    function getTower(name) {
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

    function addEnemy(tower, enemy) {
        for (let index in towers) {
            if (towers[index].id == tower.id) {
                if (!towers[index].enemies.includes(enemy)) {
                    towers[index].enemies.push(enemy);
                }
            }
        }
    }


    let api = {
        update: update,
        render: render,
        getTower: getTower,
        makeTower: makeTower,
        deleteTower: deleteTower,
        addEnemy: addEnemy,
        get towerDictionary() { return towerDictionary; },
        get towers() { return towers; },
    };

    return api;
}