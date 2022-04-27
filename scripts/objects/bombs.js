MyGame.objects.Bombs = function (assets, graphics, magic, sounds, particles) {
    'use strict';
    let bombs = {};
    let count = 0;
    let enemies = null;

    function render() {
        for (let idx in bombs) {
            let bomb = bombs[idx];
            graphics.drawTexture(bomb.image, bomb.center, bomb.rotation, bomb.size);
            //graphics.drawRectangle({center:{x:(bombs[idx].hitbox.xmin +bombs[idx].hitbox.xmax)/2,y:(bombs[idx].hitbox.ymin +bombs[idx].hitbox.ymax)/2}, size:{x:bombs[idx].hitbox.xmin - bombs[idx].hitbox.xmax, y:bombs[idx].hitbox.ymin - bombs[idx].hitbox.ymax}}, "red","red");
        }
    }

    function update(elapsedTime) {
        for (let idx in bombs) {
            let bomb = bombs[idx];
            bomb.moveSpeed *= .99;
            bomb.center.x += bomb.velocity.x * bomb.moveSpeed * elapsedTime;
            bomb.center.y += bomb.velocity.y * bomb.moveSpeed * elapsedTime;
            magic.sethitbox(bomb, bomb.size);
            particles.makeTrail(bomb.center, bomb.velocity, magic.pallets.smoke, 1);
            if (bomb.center.x < 0 || bomb.center.x > graphics.canvas.height || bomb.center.y < 0 || bomb.center.y > graphics.canvas.height || Math.floor(bomb.moveSpeed * 10) == 0) {
                hitBomb(bomb);
            }
        }
    }

    function deleteBomb(bomb) {
        delete bombs[bomb.id];
    }

    function hitBomb(bomb) {
        
        for (let enemy in enemies) {
            if (enemies[enemy] != undefined) {
                let vector = { x: bomb.center.x - enemies[enemy].center.x, y: bomb.center.y - enemies[enemy].center.y }
                let magnitude = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
                if (magnitude <= bomb.radius){
                    if(enemies[enemy].type != "flying"){
                        bomb.virus(enemies[enemy], bomb.data);
                    }
                }
            }
        }
        bomb.sideEffect(bomb, bomb.data);
        deleteBomb(bomb);
    }

    function createBomb(vel, pos, virus, sideEffect, data, image, size, radius, speed) {
        let res = magic.computeRotation(vel);
        let mSpeed =  Math.random() * (speed / 4) + speed * 3 / 4;
        bombs[++count] = {
            id: count,
            velocity: vel,
            moveSpeed: mSpeed,
            center: pos,
            virus: virus,
            sideEffect: sideEffect,
            image: image,
            data: data,
            size: size,
            radius: radius,
            rotation: res + Math.PI / 2,
            hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }
        };

    }

    function loadBomb() {
        bombs = {};
    }

    function getEnemies(list) {
        enemies = list;
    }

    let api = {
        update: update,
        render: render,
        createBomb: createBomb,
        deleteBomb: deleteBomb,
        hitBomb: hitBomb,
        loadBomb: loadBomb,
        getEnemies: getEnemies,
        get bombs() { return bombs }
    };

    return api;
}