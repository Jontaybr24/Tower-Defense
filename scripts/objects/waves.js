MyGame.objects.Waves = function (enemies, magic) {
    'use strict';
    let spawnRate = 1000 / 1.5 // time in ms for an enemy to spawn
    let timePassed = 0;

    // Waves in the format [Name, Amount, Location] ie ["Slime", 5, "N"]
    let waves = [
        [
            ["thing", 2, "N"],
            ["thing2", 2, "N"],
        ],
        [
            ["thing", 5, "N"],
            ["thing2", 5, "N"],
        ],
    ]
    let waveData = {
        N: [],
        W: [],
        E: [],
        S: [],
    };
    let spawning = false;


    function update(elapsedTime) {
        timePassed += elapsedTime;
        if (timePassed > spawnRate && spawning) {
            for (let loc in waveData) {
                if (waveData[loc].length > 0) {
                    enemies.spawnEnemy(waveData[0], loc, "ground");
                    waveData[loc].shift();
                    timePassed = 0;
                }
            }
        }
        if (checkWaveDone()) {
            spawning = false;
        }
    }

    // returns true if the wave is done
    function checkWaveDone(){
        let res = true;
        for(let loc in waveData){
            if(waveData[loc].length != 0)
                res = false;
        }
        return res;
    }

    function checkWaves(){
        if (waves.length == 0)
            return false;
        return true;

    }

    function loadWaves(file) {
    }

    function nextWave() {
        if (!spawning) {
            let currentWave = waves[0];
            spawning = true;
            for (let enemy in currentWave) {
                for (let i = 0; i < currentWave[enemy][1]; i++) {
                    waveData[currentWave[enemy][2]].push(currentWave[enemy][0]);
                }
            }
            waves.shift();
        }
    }

    let api = {
        update: update,
        loadWaves: loadWaves,
        nextWave: nextWave,
        checkWaves: checkWaves,
    };

    return api;
}