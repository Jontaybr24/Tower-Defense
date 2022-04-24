MyGame.objects.Missile = function (assets, graphics, magic, sounds, particles) {
    'use strict';
    let missiles = {};
    let count = 0;
    let size = magic.CELL_SIZE * .3; // The size of the hitbox for the missiles

    function render() {
        for (let idx in missiles) {
            let missile = missiles[idx];
            graphics.drawTexture(assets.laser_basic, missile.center, missile.rotation, { x: size, y: size });
            //graphics.drawRectangle({center:{x:(missiles[idx].hitbox.xmin +missiles[idx].hitbox.xmax)/2,y:(missiles[idx].hitbox.ymin +missiles[idx].hitbox.ymax)/2}, size:{x:missiles[idx].hitbox.xmin - missiles[idx].hitbox.xmax, y:missiles[idx].hitbox.ymin - missiles[idx].hitbox.ymax}}, "red","red");
        }
    }

    function update(elapsedTime) {
        for (let idx in missiles) {
            let missile = missiles[idx];
            let vel = magic.computeVelocity(missile.center, missile.target.center);
            let res = magic.computeRotation(vel);
            missile.velocity = vel;
            missile.rotation = res + Math.PI / 2;
            missile.moveSpeed *= 1.05;
            missile.center.x += missile.velocity.x * missile.moveSpeed * elapsedTime;
            missile.center.y += missile.velocity.y * missile.moveSpeed * elapsedTime;
            particles.makeBoomTrail(missile.center, missile.velocity);
            magic.sethitbox(missile,{x: size, y:size})
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
            hitbox:{xmin:0,xmax:0,ymin:0,ymax:0}
        };
        
    }
    function loadMissile(){
        missiles = {};
        size = magic.CELL_SIZE * .3; // The size of the hitbox for the missiles
    }

    let api = {
        update: update,
        render: render,
        createMissile: createMissile,
        deleteMissile: deleteMissile,
        hitMissile: hitMissile,
        loadMissile: loadMissile,
        get missiles() { return missiles }
    };

    return api;
}