MyGame.objects.Waves = function (enemies, magic) {
    'use strict';
    let spawnRate = 1000 / 1.5 // time in ms for an enemy to spawn
    let timePassed = 0;
    let waves = [
        [
            ["thing", 5],
            ["thing2", 5],
        ],
        [
            ["thing", 15],
            ["thing2", 15],
        ],
    ]
    let waveData = [];
    let spawning = false;


    function update(elapsedTime) {
        timePassed += elapsedTime;
        if (timePassed > spawnRate && spawning) {
            if (waveData.length > 0) {
                enemies.spawnEnemy(waveData[0], { x: magic.CANVAS_SIZE / 2, y: 0 }, { x: magic.CANVAS_SIZE / 2, y: magic.CANVAS_SIZE }, "ground")
                waveData.shift();
                timePassed = 0;
            }
            else {
                spawning = false;
            }
        }
    }

    function loadWaves(file) {
    }

    function nextWave() {
        if (!spawning) {
            let currentWave = waves[0];
            spawning = true;
            for (let enemy in currentWave) {
                for (let i = 0; i < currentWave[enemy][1]; i++) {
                    waveData.push(currentWave[enemy][0]);
                }
            }
            waves.shift();
        }
    }

    let api = {
        update: update,
        loadWaves: loadWaves,
        nextWave: nextWave,
    };

    return api;
}