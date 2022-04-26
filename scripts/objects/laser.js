MyGame.objects.Laser = function (assets, graphics, magic, sounds, particles) {
    'use strict';
    let lasers = {};
    let count = 0;
    let size = magic.CELL_SIZE * .3; // The size of the hitbox for the lasers
    let speed = 800 / 1000; // speed in pixels per ms

    function render() {
        for (let idx in lasers) {
            let laser = lasers[idx];
            graphics.drawTexture(laser.image, laser.center, laser.rotation, { x: size, y: size });
            //graphics.drawRectangle({center:{x:(lasers[idx].hitbox.xmin +lasers[idx].hitbox.xmax)/2,y:(lasers[idx].hitbox.ymin +lasers[idx].hitbox.ymax)/2}, size:{x:lasers[idx].hitbox.xmin - lasers[idx].hitbox.xmax, y:lasers[idx].hitbox.ymin - lasers[idx].hitbox.ymax}}, "red","red");
        }
    }

    function update(elapsedTime) {
        for (let idx in lasers) {
            let laser = lasers[idx];
            laser.center.x += laser.velocity.x * laser.moveSpeed * elapsedTime;
            laser.center.y += laser.velocity.y * laser.moveSpeed * elapsedTime;
            magic.sethitbox(laser,{x: size, y:size})
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
    function createLaser(vel, targets, pos, virus, data, image) {
        sounds.play(assets.fire);
        let res = magic.computeRotation(vel);
        lasers[++count] = {
            id: count,
            velocity: vel,
            moveSpeed: speed,
            center: pos,
            virus: virus,
            image: image,
            data: data,
            targets: targets,
            rotation: res + Math.PI / 2,
            hitbox:{xmin:0,xmax:0,ymin:0,ymax:0}
        };
        
    }
    function loadLaser(){
        lasers = {};
        size = magic.CELL_SIZE * .3; // The size of the hitbox for the lasers
    }

    let api = {
        update: update,
        render: render,
        createLaser: createLaser,
        deleteLaser: deleteLaser,
        hitLaser: hitLaser,
        loadLaser: loadLaser,
        get lasers() { return lasers }
    };

    return api;
}