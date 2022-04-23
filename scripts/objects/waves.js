MyGame.objects.Waves = function (enemies, graphics, magic, assets) {
    'use strict';
    let spawnRate = 1000 / 1.5 // time in ms for an enemy to spawn
    let timePassed = 0;

    // Waves in the format [Name, Amount, Location] ie ["Spider", 5, "N"]
    let waves = null;
    let waveData = { N: [], W: [], E: [], S: [] };
    let renderData = { N: {}, W: {}, E: {}, S: {} };
    let currentWave = null;

    let spawning = false;

    let boxSize = magic.CELL_SIZE;
    let nBox = { center: { x: graphics.canvas.height / 2, y: magic.CELL_SIZE / 2 }, size: { x: boxSize, y: boxSize }, hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }, selected: false };
    magic.sethitbox(nBox, nBox.size);
    let sBox = { center: { x: graphics.canvas.height / 2, y: graphics.canvas.height - magic.CELL_SIZE / 2 }, size: { x: boxSize, y: boxSize }, hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }, selected: false };
    magic.sethitbox(sBox, sBox.size);
    let eBox = { center: { x: graphics.canvas.height - magic.CELL_SIZE / 2, y: graphics.canvas.height / 2 }, size: { x: boxSize, y: boxSize }, hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }, selected: false };
    magic.sethitbox(eBox, eBox.size);
    let wBox = { center: { x: magic.CELL_SIZE / 2, y: graphics.canvas.height / 2 }, size: { x: boxSize, y: boxSize }, hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }, selected: false };
    magic.sethitbox(wBox, wBox.size);

    let prevSize = 200;
    let prevPadding = 25;
    let prevBox = { center: { x: 0, y: 0 }, size: { x: prevSize, y: 0 } }
    let mousePos = { x: graphics.canvas.height / 2, y: 0 };
    let mouseOffset = 40;


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
        if (!spawning) {
            if (length(renderData["N"]) != 0) {
                graphics.drawTexture(assets.playBtnHover, nBox.center, Math.PI / 2, nBox.size);
                if (nBox.selected) {
                    let y = (prevPadding) * (length(renderData["N"]) + 1);
                    prevBox.size.y = y;
                    prevBox.center.x = mousePos.x;
                    prevBox.center.y = mousePos.y + prevBox.size.y / 2 + mouseOffset;
                    graphics.drawRectangle(prevBox, "white", "black");
                    let offset = 0;
                    for (let i in renderData["N"]) {
                        y = mousePos.y + offset + prevPadding + mouseOffset;
                        graphics.drawText(i + ": " + renderData["N"][i], { x: prevBox.center.x, y: y }, "black", "20px Arial", true)
                        offset += prevPadding;
                    }
                }
            }
            if (length(renderData["W"]) != 0) {
                graphics.drawTexture(assets.playBtnHover, wBox.center, 0, wBox.size);
                if (wBox.selected) {
                    let y = (prevPadding) * (length(renderData["W"]) + 1);
                    prevBox.size.y = y;
                    prevBox.center.x = mousePos.x + prevBox.size.x / 2;;
                    prevBox.center.y = mousePos.y + prevBox.size.y / 2 + mouseOffset;
                    graphics.drawRectangle(prevBox, "white", "black");
                    let offset = 0;
                    for (let i in renderData["W"]) {
                        y = mousePos.y + offset + prevPadding + mouseOffset;
                        graphics.drawText(i + ": " + renderData["W"][i], { x: prevBox.center.x, y: y }, "black", "20px Arial", true)
                        offset += prevPadding;
                    }
                }
            }
            if (length(renderData["E"]) != 0) {
                graphics.drawTexture(assets.playBtnHover, eBox.center, Math.PI, eBox.size);
                if (eBox.selected) {
                    let y = (prevPadding) * (length(renderData["E"]) + 1);
                    prevBox.size.y = y;
                    prevBox.center.x = mousePos.x - prevBox.size.x / 2;
                    prevBox.center.y = mousePos.y + prevBox.size.y / 2 + mouseOffset;
                    graphics.drawRectangle(prevBox, "white", "black");
                    let offset = 0;
                    for (let i in renderData["E"]) {
                        y = mousePos.y + offset + prevPadding + mouseOffset;
                        graphics.drawText(i + ": " + renderData["E"][i], { x: prevBox.center.x, y: y }, "black", "20px Arial", true)
                        offset += prevPadding;
                    }
                }
            }
            if (length(renderData["S"]) != 0) {
                graphics.drawTexture(assets.playBtnHover, sBox.center, -Math.PI / 2, sBox.size);
                if (sBox.selected) {
                    let y = (prevPadding) * (length(renderData["S"]) + 1);
                    prevBox.size.y = y;
                    prevBox.center.x = mousePos.x;
                    prevBox.center.y = mousePos.y - prevBox.size.y / 2 - mouseOffset;
                    graphics.drawRectangle(prevBox, "white", "black");
                    let offset = 0;
                    for (let i in renderData["S"]) {
                        y = mousePos.y - offset - prevPadding - mouseOffset;
                        graphics.drawText(i + ": " + renderData["S"][i], { x: prevBox.center.x, y: y }, "black", "20px Arial", true)
                        offset += prevPadding;
                    }
                }
            }
        }
    }

    function length(obj) {
        return Object.keys(obj).length;
    }

    function checkHover(coords) {
        mousePos = coords;
        let point = { xmin: coords.x, xmax: coords.x, ymin: coords.y, ymax: coords.y }
        nBox.selected = magic.collision(point, nBox.hitbox);
        eBox.selected = magic.collision(point, eBox.hitbox);
        sBox.selected = magic.collision(point, sBox.hitbox);
        wBox.selected = magic.collision(point, wBox.hitbox);
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
            return spawning;
        return true;

    }

    function loadWaves(file) {
        waves = [
            [
                ["Spider", 20, "W"],
            ],
            [
                ["Drone", 1, "N"],
                ["Drone", 1, "E"],
                ["Drone", 1, "S"],
                ["Drone", 1, "W"],
                ["Spider", 1, "S"],
                ["Spider", 1, "E"],
                ["Spider", 1, "W"],
                ["Spider", 1, "N"],
            ],
            [
                ["Spider", 2, "S"],
                ["Drone", 2, "W"],
                ["Spider", 2, "E"],
            ],
            [
                ["Spider", 50, "N"],
                ["Drone", 50, "N"],
            ],
            [
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],
                ["Spider", 5, "N"],
                ["Drone", 5, "N"],

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
        checkHover: checkHover,
        get spawning() { return spawning; }
    };

    return api;
}