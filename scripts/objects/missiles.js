MyGame.objects.Missile = function (assets, graphics, magic, sounds, particles) {
    'use strict';
    let missiles = {};
    let count = 0;
    let size = magic.CELL_SIZE * .3; // The size of the hitbox for the missiles
    let maxSpeed = 1000 / 1000;
    let spinRate = magic.RPS;

    function render() {
        for (let idx in missiles) {
            let missile = missiles[idx];
            graphics.drawTexture(missile.image, missile.center, missile.rotation + Math.PI / 2, { x: size, y: size });
            //graphics.drawRectangle({center:{x:(missiles[idx].hitbox.xmin +missiles[idx].hitbox.xmax)/2,y:(missiles[idx].hitbox.ymin +missiles[idx].hitbox.ymax)/2}, size:{x:missiles[idx].hitbox.xmin - missiles[idx].hitbox.xmax, y:missiles[idx].hitbox.ymin - missiles[idx].hitbox.ymax}}, "red","red");
        }
    }

    function update(elapsedTime) {
        for (let idx in missiles) {
            let missile = missiles[idx];
            missile.lifetime += elapsedTime;
            if (missile.target !== undefined) {
                let result = magic.computeAngle(missile.rotation, missile.center, missile.target.center);
                // checks if the angle between the target is below the tollerance otherwise keep turning
                if (magic.testTolerance(result.angle, 0, .04) === false) {
                    if (result.crossProduct > 0) {
                        missile.rotation += spinRate * elapsedTime;
                    } else {
                        missile.rotation -= spinRate * elapsedTime;
                    }
                }
            }
            missile.velocity = magic.computeFromRot(missile.rotation);
            if (missile.moveSpeed < maxSpeed)
                missile.moveSpeed *= 1.06;
            missile.center.x += missile.velocity.x * missile.moveSpeed * elapsedTime;
            missile.center.y += missile.velocity.y * missile.moveSpeed * elapsedTime;
            particles.makeBoomTrail(missile.center, missile.velocity);
            magic.sethitbox(missile, { x: size, y: size })
            if (missile.center.x < 0 || missile.center.x > graphics.canvas.height || missile.center.y < 0 || missile.center.y > graphics.canvas.height) {
                deleteMissile(missile);
            }
        }
    }

    function deleteMissile(missile) {
        delete missiles[missile.id];
    }

    function hitMissile(missile, enemy) {
        missile.virus(enemy, missile.data);
        deleteMissile(missile);
    }

    function newTarget(enemy, newEnemy) {
        for (let idx in missiles) {
            if (enemy.id == missiles[idx]?.target?.id) {
                missiles[idx].target = newEnemy;
            }
        }
    }

    // takes a target as an enemy, pos as a spawn point, and virus as a function to execute when the collision happens
    function createMissile(vel, target, pos, virus, data, speed, image) {
        let res = magic.computeRotation(vel);
        missiles[++count] = {
            id: count,
            velocity: vel,
            moveSpeed: speed,
            center: pos,
            virus: virus,
            data: data,
            target: target,
            image: image,
            rotation: res,
            hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 },
        };

    }
    function loadMissile() {
        missiles = {};
        size = magic.CELL_SIZE * .8; // The size of the hitbox for the missiles
    }

    let api = {
        update: update,
        render: render,
        createMissile: createMissile,
        deleteMissile: deleteMissile,
        hitMissile: hitMissile,
        loadMissile: loadMissile,
        newTarget: newTarget,
        get missiles() { return missiles }
    };

    return api;
}