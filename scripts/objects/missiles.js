MyGame.objects.Missile = function (assets, graphics, magic, sounds, particles) {
    'use strict';
    let missiles = {};
    let count = 0;
    let size = magic.CELL_SIZE * .3; // The size of the hitbox for the missiles
    let maxSpeed = 1000 / 1000;
    let despawn = 2000;

    function render() {
        for (let idx in missiles) {
            let missile = missiles[idx];
            graphics.drawTexture(assets.missile, missile.center, missile.rotation, { x: size, y: size });
            //graphics.drawRectangle({center:{x:(missiles[idx].hitbox.xmin +missiles[idx].hitbox.xmax)/2,y:(missiles[idx].hitbox.ymin +missiles[idx].hitbox.ymax)/2}, size:{x:missiles[idx].hitbox.xmin - missiles[idx].hitbox.xmax, y:missiles[idx].hitbox.ymin - missiles[idx].hitbox.ymax}}, "red","red");
        }
    }

    function update(elapsedTime) {
        for (let idx in missiles) {
            let missile = missiles[idx];
            missile.lifetime += elapsedTime;
            let vel = magic.computeVelocity(missile.center, missile.target.center);
            let res = magic.computeRotation(vel);
            missile.velocity = vel;
            missile.rotation = res + Math.PI / 2;
            if (missile.moveSpeed < maxSpeed)
                missile.moveSpeed *= 1.06;
            missile.center.x += missile.velocity.x * missile.moveSpeed * elapsedTime;
            missile.center.y += missile.velocity.y * missile.moveSpeed * elapsedTime;
            particles.makeBoomTrail(missile.center, missile.velocity);
            magic.sethitbox(missile, { x: size, y: size })
            if (missile.center.x < 0 || missile.center.x > graphics.canvas.height || missile.center.y < 0 || missile.center.y > graphics.canvas.height) {
                deleteMissile(missile);
            }
            else if (missile.lifetime > despawn) {
                console.log(missile.center)
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
            if (enemy.id == missiles[idx].target.id) {
                missiles[idx].target = newEnemy;
            }
        }
    }

    // takes a target as an enemy, pos as a spawn point, and virus as a function to execute when the collision happens
    function createMissile(target, pos, virus, data, speed) {
        let vel = magic.computeVelocity(pos, target.center);
        let res = magic.computeRotation(vel);
        missiles[++count] = {
            id: count,
            velocity: vel,
            moveSpeed: speed,
            center: pos,
            virus: virus,
            data: data,
            target: target,
            rotation: res + Math.PI / 2,
            hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 },
            lifetime: 0
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