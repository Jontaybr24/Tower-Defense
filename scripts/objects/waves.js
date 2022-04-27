MyGame.objects.Waves = function (enemies, graphics, magic, assets, sounds) {
    'use strict';
    let spawnRate = 0
    let timePassed = 0;
    let waveCount = 0;

    // Waves in the format [Name, Amount, Location] ie ["Spider", 5, "N"]
    let waves = null;
    let waveData = { N: [], W: [], E: [], S: [] };
    let renderData = { N: {}, W: {}, E: {}, S: {} };
    let currentWave = null;
    let pathOn = MyGame.data.togglePath;
    let pathTimer = 3000;
    let wispsClear = true;

    let paused = false;
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

    let prevSize = 150;
    let prevPadding = 25;
    let text = "";
    let prevText = "20px Arial";
    let prevStyle = "black";
    let pBoxStyle = "rgba(125, 152, 201, .5)";
    let prevBox = { center: { x: 0, y: 0 }, size: { x: prevSize, y: 0 } }
    let mousePos = { x: graphics.canvas.height / 2, y: 0 };
    let mouseOffset = 40;
    let button = { center: { x: graphics.canvas.height + magic.X_OFFSET * .25, y: graphics.canvas.height - 50 }, size: { x: magic.MENU_SIZE, y: magic.MENU_SIZE }, hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }, selected: false }
    magic.sethitbox(button, button.size);

    function update(elapsedTime) {
        if (pathOn) {
            if (isWaveDone()) {
                if (pathTimer < 0) {
                    pathTimer = 3000
                    if(enemies.wlength == 0){
                    if((length(renderData["N"]) != 0) )
                        enemies.spawnEnemy("Wisp", "N");
                    if((length(renderData["S"]) != 0) )
                        enemies.spawnEnemy("Wisp", "S");
                    if((length(renderData["W"]) != 0) )
                        enemies.spawnEnemy("Wisp", "W");
                    if((length(renderData["E"]) != 0) )
                        enemies.spawnEnemy("Wisp", "E");    
                    }
                    wispsClear = false;
                }
            }
            else{
                if(!wispsClear){
                    enemies.clearWisps();
                    wispsClear = true
                }
            }
        }
        pathTimer -= elapsedTime;
        timePassed += elapsedTime;
        if (timePassed > spawnRate && spawning) {
            for (let loc in waveData) {
                if (waveData[loc].length > 0) {
                    enemies.spawnEnemy(waveData[loc][0], loc);
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
        if (!spawning && enemies.length == 0) {
            let string = ""
            if (length(renderData["N"]) != 0) {
                if (nBox.selected) {
                    let y = (prevPadding) * (length(renderData["N"]) + 1);
                    prevBox.size.y = y;
                    prevBox.center.x = mousePos.x;
                    prevBox.center.y = mousePos.y + prevBox.size.y / 2 + mouseOffset;
                    for (let i in renderData["N"]) {
                        let newString = i + ": " + renderData["N"][i] + "\n"
                        string = string + newString;
                    }
                    graphics.drawTexture(assets.waveHover, nBox.center, Math.PI / 2, nBox.size);
                    graphics.drawRectangle(prevBox, pBoxStyle, "black");
                    graphics.drawText(string, { x: prevBox.center.x, y: prevBox.center.y - prevBox.size.y / 2 + prevPadding * 1.2 }, prevStyle, prevText, true, prevPadding)
                }
                else {
                    graphics.drawTexture(assets.wave, nBox.center, Math.PI / 2, nBox.size);
                }
            }
            if (length(renderData["W"]) != 0) {
                if (wBox.selected) {
                    let y = (prevPadding) * (length(renderData["W"]) + 1);
                    prevBox.size.y = y;
                    prevBox.center.x = mousePos.x + prevBox.size.x / 2;;
                    prevBox.center.y = mousePos.y + prevBox.size.y / 2 + mouseOffset;
                    for (let i in renderData["W"]) {
                        let newString = i + ": " + renderData["W"][i] + "\n"
                        string = string + newString;
                    }
                    graphics.drawTexture(assets.waveHover, wBox.center, 0, wBox.size);
                    graphics.drawRectangle(prevBox, pBoxStyle, "black");
                    graphics.drawText(string, { x: prevBox.center.x, y: prevBox.center.y - prevBox.size.y / 2 + prevPadding * 1.2 }, prevStyle, prevText, true, prevPadding)
                }
                else {
                    graphics.drawTexture(assets.wave, wBox.center, 0, wBox.size);
                }
            }
            if (length(renderData["E"]) != 0) {
                if (eBox.selected) {
                    let y = (prevPadding) * (length(renderData["E"]) + 1);
                    prevBox.size.y = y;
                    prevBox.center.x = mousePos.x - prevBox.size.x / 2;
                    prevBox.center.y = mousePos.y + prevBox.size.y / 2 + mouseOffset;
                    for (let i in renderData["E"]) {
                        let newString = i + ": " + renderData["E"][i] + "\n";
                        string = string + newString;
                    }
                    graphics.drawRectangle(prevBox, pBoxStyle, "black");
                    graphics.drawTexture(assets.waveHover, eBox.center, Math.PI, eBox.size);
                    graphics.drawText(string, { x: prevBox.center.x, y: prevBox.center.y - prevBox.size.y / 2 + prevPadding * 1.2 }, prevStyle, prevText, true, prevPadding)
                }
                else {
                    graphics.drawTexture(assets.wave, eBox.center, Math.PI, eBox.size);
                }
            }
            if (length(renderData["S"]) != 0) {
                if (sBox.selected) {
                    let y = (prevPadding) * (parseInt(length(renderData["S"]) + 1));
                    prevBox.size.y = y;
                    prevBox.center.x = mousePos.x;
                    prevBox.center.y = mousePos.y - prevBox.size.y / 2 - mouseOffset;
                    for (let i in renderData["S"]) {
                        let newString = i + ": " + renderData["S"][i] + "\n";
                        string = string + newString;
                    }
                    graphics.drawTexture(assets.waveHover, sBox.center, -Math.PI / 2, sBox.size);
                    graphics.drawRectangle(prevBox, pBoxStyle, "black");
                    graphics.drawText(string, { x: prevBox.center.x, y: prevBox.center.y - prevBox.size.y / 2 + prevPadding * 1.2 }, prevStyle, prevText, true, prevPadding)
                }
                else {
                    graphics.drawTexture(assets.wave, sBox.center, -Math.PI / 2, sBox.size);
                }
            }
            text = "Start\nWave";
            if (button.selected) {
                graphics.drawTexture(assets.playBtnHover, button.center, 0, button.size);
            }
            else {
                graphics.drawTexture(assets.playBtn, button.center, 0, button.size);
            }
        }
        else {
            text = "Pause\nGame";
            if (button.selected) {
                graphics.drawTexture(assets.pauseBtnHover, button.center, 0, button.size);
            }
            else {
                graphics.drawTexture(assets.pauseBtn, button.center, 0, button.size);
            }
        }
        graphics.drawText(text, { x: button.center.x + button.size.x + 20, y: button.center.y }, "white", "20px Arial", true, 20);
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
        if (!button.selected && magic.collision(point, button.hitbox))
            sounds.play(assets.menu_hover);
        button.selected = magic.collision(point, button.hitbox);
    }

    function checkPress() {
        if (button.selected) {
            if (!spawning && enemies.length == 0)
                nextWave();
            else{
                paused = true;
            }
        }
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

    function isWaveDone() {
        if (!(spawning) && enemies.length == 0) {
            return true
        }
        else
            return false
    }

    function checkWaves() {
        if (waves.length == 0)
            return spawning;
        return true;

    }

    function loadWaves(data) {
        pathOn = MyGame.data.togglePath;
        spawnRate = 1000 / 1.5 // time in ms for an enemy to spawn
        spawning = false;
        waveCount = 0;
        waveData = { N: [], W: [], E: [], S: [] };
        currentWave = null;
        boxSize = magic.CELL_SIZE;
        nBox = { center: { x: graphics.canvas.height / 2, y: magic.CELL_SIZE / 2 }, size: { x: boxSize, y: boxSize }, hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }, selected: false };
        magic.sethitbox(nBox, nBox.size);
        sBox = { center: { x: graphics.canvas.height / 2, y: graphics.canvas.height - magic.CELL_SIZE / 2 }, size: { x: boxSize, y: boxSize }, hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }, selected: false };
        magic.sethitbox(sBox, sBox.size);
        eBox = { center: { x: graphics.canvas.height - magic.CELL_SIZE / 2, y: graphics.canvas.height / 2 }, size: { x: boxSize, y: boxSize }, hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }, selected: false };
        magic.sethitbox(eBox, eBox.size);
        wBox = { center: { x: magic.CELL_SIZE / 2, y: graphics.canvas.height / 2 }, size: { x: boxSize, y: boxSize }, hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }, selected: false };
        magic.sethitbox(wBox, wBox.size);
        waves = data;
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
        if (!spawning && enemies.length == 0) {
            waveCount++;
            spawnRate *= .95; // enemies spawn 5% faster each wave
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

    function togglePath() {
        pathOn = !pathOn;
        MyGame.data.togglePath = pathOn;
        localStorage['data'] = JSON.stringify(MyGame.data);
    }

    let api = {
        update: update,
        render: render,
        loadWaves: loadWaves,
        nextWave: nextWave,
        checkWaves: checkWaves,
        checkHover: checkHover,
        checkPress: checkPress,
        isWaveDone: isWaveDone,
        togglePath: togglePath,
        set paused(val) {paused = val}, 
        get paused() {return paused},
        get spawning() { return spawning; },
        get waveCount() { return waveCount; },
    };

    return api;
}