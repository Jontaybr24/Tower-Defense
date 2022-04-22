MyGame.objects.Laser = function (assets, graphics, magic, sounds) {
    'use strict';
    let lasers = {};
    let count = 0;
    let size = magic.CELL_SIZE * .3; // The size of the hitbox for the lasers
    let speed = 800 / 1000; // speed in pixels per ms

    function render() {
        for (let idx in lasers) {
            let laser = lasers[idx];
            graphics.drawTexture(laser.image, laser.center, laser.rotation, { x: size, y: size });
        }
    }

    function update(elapsedTime) {
        for (let idx in lasers) {
            let laser = lasers[idx];
            laser.center.x += laser.velocity.x * laser.moveSpeed * elapsedTime;
            laser.center.y += laser.velocity.y * laser.moveSpeed * elapsedTime;
            laser.hitbox = {
                xmin: laser.center.x - size / 2,
                xmax: laser.center.x + size / 2,
                ymin: laser.center.y - size / 2,
                ymax: laser.center.y + size / 2,
            };
            if (laser.center.x < 0 || laser.center.x > graphics.canvas.height || laser.center.y < 0 || laser.center.y > graphics.canvas.height) {
                deleteLaser(laser);
            }
        }
    }

    function deleteLaser(laser) {
        delete lasers[laser.id];
    }

    function hitLaser(laser, enemy) {
        laser.virus(enemy, laser.data);
        deleteLaser(laser);
    }

    // takes a target as an enemy, pos as a spawn point, and virus as a function to execute when the collision happens
    function createLaser(target, pos, virus, data, image) {
        let vel = magic.computeVelocity(pos, target.center);
        let res = magic.computeRotation(vel);
        lasers[++count] = {
            id: count,
            velocity: vel,
            moveSpeed: speed,
            center: pos,
            virus: virus,
            image: image,
            data: data,
            target: target,
            rotation: res + Math.PI / 2,
        };
    }

    let api = {
        update: update,
        render: render,
        createLaser: createLaser,
        deleteLaser: deleteLaser,
        hitLaser: hitLaser,
        get lasers() { return lasers }
    };

    return api;
}