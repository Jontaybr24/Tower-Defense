MyGame.screens['game-play'] = (function (game, objects, assets, renderer, graphics, input, sounds, data) {
    'use strict';

    let lastTimeStamp = performance.now();

    let paused = false;
    let cancelNextRequest = true;
    let levelD = null;
    let score = 0;

    let myKeyboard = input.Keyboard();
    let myMouse = input.Mouse();

    let soundManager = sounds.manager();

    let magic = objects.Magic(graphics);

    let myGameBoard = objects.Gameboard(assets, graphics, magic);
    let myParticles = objects.Particles(assets, graphics, magic);
    let myCoins = objects.CoinFX(assets, graphics, magic);

    let myCursor = objects.Cursor(assets, graphics, magic);

    let myPathfinder = objects.Path(magic)
    let myHealthbars = objects.Healthbars(graphics, magic);
    let myInfo = objects.Info(assets, graphics, magic, myCursor, soundManager, myCoins);

    let myLasers = objects.Laser(assets, graphics, magic, soundManager, myParticles);
    let myMissiles = objects.Missile(assets, graphics, magic, soundManager, myParticles);
    let myBombs = objects.Bombs(assets, graphics, magic, soundManager, myParticles);
    let myTowers = objects.Towers(assets, graphics, magic, myLasers, soundManager, myMissiles, myParticles, myBombs);
    let myEnemies = objects.Enemies(assets, graphics, magic, myPathfinder, myInfo, myParticles, myHealthbars, renderer.AnimatedModel, myTowers, soundManager, myMissiles);
    let myWaves = objects.Waves(myEnemies, graphics, magic, assets, soundManager);
    myInfo.plusWave(myWaves);
    myBombs.getEnemies(myEnemies.enemies);

    let myUpgrades = objects.Menu(assets, graphics, magic, myTowers, myInfo, soundManager);

    function cursorCollision() {
        if (!myGameBoard.checkCell(magic.pixelToGrid(myCursor.cursor.center))) {
            myCursor.blocked();
        }
        for (let index in myEnemies.enemies) {
            if (magic.collision(myCursor.cursor.hitbox, myEnemies.enemies[index].hitbox)) {
                myCursor.blocked();
                break;
            }
        }
    }

    function enemiesInRadius() {
        for (let enemy in myEnemies.enemies) {
            for (let tower in myTowers.towers) {
                if (magic.magnitude(myTowers.towers[tower].center, myEnemies.enemies[enemy].center) < myTowers.towers[tower].radius) {
                    myTowers.addEnemy(myTowers.towers[tower], myEnemies.enemies[enemy])
                }
            }
        }
    }

    function enemiesToLaser() {
        for (let laser in myLasers.lasers) {
            for (let target in myLasers.lasers[laser].targets) {
                if (myLasers.lasers[laser] != undefined) {
                    if (magic.collision(myLasers.lasers[laser].hitbox, myLasers.lasers[laser].targets[target].hitbox)) {
                        myLasers.hitLaser(myLasers.lasers[laser], myLasers.lasers[laser].targets[target]);
                    }
                }
            }
        }
    }

    function enemiesToMissile() {
        for (let missile in myMissiles.missiles) {
            if (myMissiles.missiles[missile].target !== undefined)
                if (magic.collision(myMissiles.missiles[missile].hitbox, myMissiles.missiles[missile].target.hitbox))
                    myMissiles.hitMissile(myMissiles.missiles[missile], myMissiles.missiles[missile].target);
        }

    }

    function enemiesToBomb() {
        for (let enemy in myEnemies.enemies) {
            for (let bomb in myBombs.bombs) {
                if (myBombs.bombs[bomb] !== undefined && myEnemies.enemies[enemy] !== undefined)
                    if (magic.collision(myBombs.bombs[bomb].hitbox, myEnemies.enemies[enemy].hitbox)) {
                        myBombs.hitBomb(myBombs.bombs[bomb]);
                    }

            }
        }
    }

    function collinsions() {
        enemiesInRadius();
        enemiesToLaser();
        enemiesToMissile();
        enemiesToBomb();
    }

    // clears all data in objects and sets the data to the level parameters
    function loadLevel(level) {
        soundManager.play(assets.ice_cave, true);
        score = 0;
        hideMenu();
        hideMenu2();
        hideMenu3();
        levelD = level;
        magic.setGridSize(level.board.size);
        myLasers.loadLaser();
        myMissiles.loadMissile();
        myHealthbars.loadHP();
        myGameBoard.genBoard(level.board);
        myPathfinder.loadBoard(myGameBoard.board);
        myWaves.loadWaves(JSON.parse(JSON.stringify(level.waveData)));
        myTowers.loadTowers(level.towerCount);
        myCursor.loadCursor();
        myUpgrades = objects.Menu(assets, graphics, magic, myTowers, myInfo, soundManager);
        myInfo.loadTowers(myTowers.towerDictionary);
        myInfo.loadInfo(level.info);
        myEnemies.clearAll();
    }

    function checkWin() {
        if (!myWaves.checkWaves() && myEnemies.length == 0) {
            showMenu3();
        }
    }

    function checkLoss() {
        if (myInfo.lives <= 0) {
            showMenu2();
        }
    }

    function togglePause() {
        if (!paused)
            showMenu();
        else
            hideMenu();
    }

    function hideMenu() {
        paused = false;
        myWaves.paused = false;
        document.getElementById('pause-menu').style.display = "none";
        soundManager.playAll();
    }
    function showMenu() {
        paused = true;
        document.getElementById('pause-menu').style.display = "block";
        soundManager.pauseAll();
    }

    function hideMenu2() {
        paused = false;
        document.getElementById('death-menu').style.display = "none";
        soundManager.playAll();
    }
    function showMenu2() {
        setScore()
        paused = true;
        document.getElementById('death-menu').style.display = "block";
        soundManager.pauseAll();
    }

    function hideMenu3() {
        paused = false;
        document.getElementById('win-menu').style.display = "none";
        soundManager.playAll();
    }
    function showMenu3() {
        setScore()
        paused = true;
        document.getElementById('win-menu').style.display = "block";
        soundManager.pauseAll();
    }

    function setScore() {
        score += myTowers.getTowerValue();
        score += myEnemies.score;
        let scores = data.score[levelD.id];
        let currScore = score;
        for (let i in scores) {
            if (currScore > scores[i]) {
                let temp = scores[i];
                scores[i] = currScore;
                currScore = temp;
            }
        }
        data.score[levelD] = scores;
        localStorage['data'] = JSON.stringify(data);
    }

    function endGame(menu) {
        cancelNextRequest = true;
        if (menu == "main")
            game.showScreen('main-menu');
        else
            game.showScreen('level-select');
        soundManager.clearAll();
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
    }

    function update(elapsedTime) {
        collinsions();
        myWaves.update(elapsedTime);
        if (myWaves.paused) {
            togglePause();
        }
        myParticles.update(elapsedTime);
        myCoins.update(elapsedTime);
        myEnemies.update(elapsedTime);
        myHealthbars.update(elapsedTime);
        myTowers.update(elapsedTime);
        myCursor.update(elapsedTime);
        myGameBoard.update(elapsedTime);
        myInfo.update(elapsedTime);
        myUpgrades.update(elapsedTime);
        myLasers.update(elapsedTime);
        myMissiles.update(elapsedTime);
        myBombs.update(elapsedTime);

        checkWin();
        checkLoss();
        cursorCollision();
    }

    function render() {
        graphics.clear();
        myGameBoard.render();

        myTowers.render();
        myEnemies.render();
        myHealthbars.render();
        myLasers.render();
        myMissiles.render();
        myBombs.render();
        myInfo.render();
        myUpgrades.render();
        myWaves.render();
        myParticles.render();
        myCoins.render();
    }

    function sellaTower() {
        if (!paused) {
            let tower = myUpgrades.tower;
            if (tower != null) {
                let coords = magic.pixelToGrid(tower.center);
                let obj = myGameBoard.removeObject(coords);
                myTowers.deleteTower(obj);
                myInfo.addCoins(Math.floor(obj.cost * magic.SELL_PRICE), tower.center);
                myUpgrades.setTower(null);
                myEnemies.updatePath();
                soundManager.play(assets.sell);
            }
        }
    }

    function setControls() {
        myKeyboard.register("Escape", togglePause);
        myKeyboard.register(data.controls.grid.key, myGameBoard.toggleGrid);
        myKeyboard.register(data.controls.upgrade1.key, function () {
            if (!paused) {
                if (myInfo.coins >= myUpgrades.tower?.upgrades["cost"][0][0]) {
                    myInfo.addCoins(-myTowers.upgrade(myUpgrades.tower, 0), myUpgrades.tower.center);
                }
            }
        });
        myKeyboard.register(data.controls.upgrade2.key, function () {
            if (!paused) {
                if (myInfo.coins >= myUpgrades.tower?.upgrades["cost"][1][0]) {
                    myInfo.addCoins(-myTowers.upgrade(myUpgrades.tower, 1), myUpgrades.tower.center);
                }
            }
        });
        myKeyboard.register(data.controls.upgrade3.key, function () {
            if (!paused) {
                if (myInfo.coins >= myUpgrades.tower?.upgrades["cost"][2][0]) {
                    myInfo.addCoins(-myTowers.upgrade(myUpgrades.tower, 2), myUpgrades.tower.center);
                }
            }
        });
        myKeyboard.register(data.controls.path.key, function () {
            if (!paused) {
                myWaves.togglePath();
            }
        });
        myKeyboard.register(data.controls.sell.key, sellaTower);
        myKeyboard.register(data.controls.startWave.key, myWaves.nextWave);

    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        if (!paused) {
            update(elapsedTime);
        }
        processInput(elapsedTime);
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        document.getElementById('id-pause-back').addEventListener(
            'click',
            function () {
                endGame("back");
            });
        document.getElementById('id-pause-main').addEventListener(
            'click',
            function () {
                endGame("main");
            });
        document.getElementById('id-pause-back').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
        document.getElementById('id-pause-main').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
        document.getElementById('id-resume').addEventListener(
            'click',
            function () { hideMenu(); });
        document.getElementById('id-resume').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });

        document.getElementById('id-death-back').addEventListener(
            'click',
            function () {
                endGame("main");
            });
        document.getElementById('id-death-back').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
        document.getElementById('id-retry').addEventListener(
            'click',
            function () { loadLevel(levelD); });
        document.getElementById('id-retry').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });

        document.getElementById('id-win-back').addEventListener(
            'click',
            function () { endGame("back"); });
        document.getElementById('id-win-back').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
        document.getElementById('id-win-main').addEventListener(
            'click',
            function () { endGame("main"); });
        document.getElementById('id-win-main').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
        myMouse.register('mousedown', function (e) {
            if (!paused) {
                if (e.button == 2) {
                    myInfo.cancelTower();
                    myUpgrades.setTower(null);
                }
                else {
                    let coords = magic.mouseToGrid({ x: e.clientX, y: e.clientY })
                    let pixelCoords = magic.gridToPixel(coords);

                    if (coords.x < magic.GRID_SIZE - 1 && coords.y < magic.GRID_SIZE - 1) {
                        myUpgrades.setTower(null);
                    }

                    if (coords.x >= magic.GRID_SIZE) {
                        myInfo.checkBuy();
                        myInfo.addCoins(-myUpgrades.buyUpgrade(), pixelCoords);
                        if (myUpgrades.sellTower())
                            sellaTower();
                        myWaves.checkPress();
                    }
                    if (e.ctrlKey) {
                        if (coords.x < magic.GRID_SIZE - 1) {
                            let obj = myGameBoard.removeObject(coords);
                            if (obj != null) {
                                myTowers.deleteTower(obj);
                                myInfo.addCoins(Math.floor(obj.cost * magic.SELL_PRICE), obj.center);
                                myUpgrades.setTower(null);
                                myEnemies.updatePath();
                                soundManager.play(assets.sell);
                            }
                        }
                    }
                    else if (myInfo.placing) {
                        if (myCursor.isClear() && myGameBoard.checkCell(coords)) {
                            let tower = myTowers.getTower(myCursor.tower.name);
                            if (myInfo.hasFunds(tower.cost)) {
                                myInfo.addCoins(-tower.cost, pixelCoords)
                                tower = myTowers.makeTower(pixelCoords, myCursor.tower.name);
                                myGameBoard.addObject(coords, tower);
                            }
                            myEnemies.updatePath();
                        }
                        else if (!myCursor.isClear() && coords.x < magic.GRID_SIZE) {
                            soundManager.play(assets.deny);
                        }
                    }
                    else {
                        let tower = myGameBoard.getObject(coords);
                        if (tower?.type == "tower") {
                            myUpgrades.setTower(tower);
                        }
                    }
                }
            }
        });
        let lastGrid = null;
        graphics.canvas.addEventListener(
            'mousemove', function (e) {
                if (!paused) {
                    let coords = magic.mouseToGrid({ x: e.clientX, y: e.clientY })

                    let pixelCoords = magic.gridToPixel(coords);
                    let moreCoords = magic.mouseToPixel({ x: e.clientX, y: e.clientY })
                    myInfo.checkHover(moreCoords);
                    myUpgrades.checkHover(moreCoords);
                    myWaves.checkHover(moreCoords);
                    myCursor.setCursor(pixelCoords);
                    if (myInfo.placing) {
                        if ((coords.x < magic.GRID_SIZE && coords.y < magic.GRID_SIZE)) {
                            if (!(coords.x <= 0 || coords.y <= 0)) {
                                if (lastGrid == null) {
                                    if (myGameBoard.checkCell(coords)) {
                                        myGameBoard.addObject(coords, "Cursor")
                                        if (myPathfinder.findPath(magic.spawnPoints.W, magic.spawnPoints.E, "Cursor") != null && myPathfinder.findPath(magic.spawnPoints.N, magic.spawnPoints.S, "Cursor") != null) {
                                            myGameBoard.removeObject(coords)
                                        }
                                    }
                                    lastGrid = coords;
                                }
                                if (lastGrid != null && (lastGrid.x != coords.x || lastGrid.y != coords.y)) {
                                    if (myGameBoard.board[lastGrid.x][lastGrid.y].object == "Cursor") {
                                        myGameBoard.removeObject(lastGrid)
                                    }
                                    if (myGameBoard.checkCell(coords)) {
                                        myGameBoard.addObject(coords, "Cursor")
                                        if (myPathfinder.findPath(magic.spawnPoints.W, magic.spawnPoints.E, "Cursor") != null && myPathfinder.findPath(magic.spawnPoints.N, magic.spawnPoints.S, "Cursor") != null) {
                                            myGameBoard.removeObject(coords)
                                        }
                                    }
                                    lastGrid = coords;
                                }
                            }
                        }
                    }
                }
            }
        );
        graphics.canvas.addEventListener(
            'mouseleave', function (e) {
                if (!paused) {
                    myCursor.hideCursor();
                }
            }
        );
    }

    function run(level) {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        loadLevel(level);
        setControls();
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };

}(MyGame.game, MyGame.objects, MyGame.assets, MyGame.render, MyGame.graphics, MyGame.input, MyGame.sounds, MyGame.data));