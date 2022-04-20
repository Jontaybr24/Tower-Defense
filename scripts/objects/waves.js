MyGame.objects.Waves = function (enemies, magic) {
    'use strict';
    let spawnRate = 1000 / 1.5 // time in ms for an enemy to spawn
    let timePassed = 0;

    // Waves in the format [Name, Amount, Location] ie ["Slime", 5, "N"]
    let waves = null;
    let waveData = { N: [], W: [], E: [], S: [] };
    let renderData = { N: {}, W: {}, E: {}, S: {} };
    let currentWave = null;

    let spawning = false;


    function update(elapsedTime) {
        timePassed += elapsedTime;
        if (timePassed > spawnRate && spawning) {
            for (let loc in waveData) {
                if (waveData[loc].length > 0) {
                    enemies.spawnEnemy(waveData[loc][0], loc, "ground");
                    waveData[loc].shift();
                    timePassed = 0;
                }
            }
        }
        if (checkWaveDone()) {
            spawning = false;
        }
    }

    function render() {
        //console.log(renderData);
    }

    // returns true if the wave is done
    function checkWaveDone() {
        let res = true;
        for (let loc in waveData) {
            if (waveData[loc].length != 0)
                res = false;
        }
        return res;
    }

    function checkWaves() {
        if (waves.length == 0)
            return false;
        return true;

    }

    function loadWaves(file) {
        waves = [
            [
                ["slime", 2, "W"],
                ["slime", 2, "N"],
            ],
            [
                ["slime", 2, "S"],
                ["runner", 2, "W"],
                ["slime", 2, "E"],
            ],
            [
                ["slime", 5, "N"],
                ["runner", 5, "N"],
            ],
            [
                ["slime", 5, "N"],
                ["runner", 5, "N"],
            ],
            [
                ["slime", 5, "N"],
                ["runner", 5, "N"],
            ],
            [
                ["slime", 5, "N"],
                ["runner", 5, "N"],
            ],
            [
                ["slime", 5, "N"],
                ["runner", 5, "N"],
            ],
            [
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
                ["slime", 5, "N"],
                ["runner", 5, "N"],
            ],
        ];
        previewWave();
    }

    function previewWave() {
        currentWave = waves[0];
        renderData = { N: {}, W: {}, E: {}, S: {}, };
        for (let i in currentWave) {
            if (currentWave[i][0] in renderData[currentWave[i][2]]) {
                renderData[currentWave[i][2]][currentWave[i][0]] += currentWave[i][1];
            }
            else {
                renderData[currentWave[i][2]][currentWave[i][0]] = currentWave[i][1];
            }
        }
    }

    function nextWave() {
        if (!spawning) {
            spawning = true;
            for (let enemy in currentWave) {
                for (let i = 0; i < currentWave[enemy][1]; i++) {
                    waveData[currentWave[enemy][2]].push(currentWave[enemy][0]);
                }
            }
            waves.shift();
            previewWave();
        }
    }

    let api = {
        update: update,
        render: render,
        loadWaves: loadWaves,
        nextWave: nextWave,
        checkWaves: checkWaves,
    };

    return api;
}