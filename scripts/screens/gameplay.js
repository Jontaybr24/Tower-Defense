MyGame.screens['game-play'] = (function (game, objects, assets, renderer, graphics, input, sounds, data) {
    'use strict';

    let lastTimeStamp = performance.now();

    let myKeyboard = input.Keyboard();
    let myMouse = input.Mouse();

    let soundManager = sounds.manager();

    let magic = objects.Magic(graphics);

    let myGameBoard = objects.Gameboard(assets, graphics, magic);
    let myParticles = objects.Particles(assets, graphics, magic);

    let myCursor = objects.Cursor(assets, graphics, magic);
    let myInfo = objects.Info(assets, graphics, magic, myCursor, soundManager);

    let myPathfinder = objects.Path(myGameBoard.board, magic)
    let myHealthbars = objects.Healthbars(graphics, magic);

    let myLasers = objects.Laser(assets, graphics, magic, soundManager);
    let myTowers = objects.Towers(assets, graphics, magic, myLasers);
    let myEnemies = objects.Enemies(assets, graphics, magic, myPathfinder, myInfo, myParticles, myHealthbars, renderer.AnimatedModel, myTowers);



    let myWaves = objects.Waves(myEnemies, graphics, magic, assets);
    let myUpgrades = objects.Menu(assets, graphics, magic, myTowers, myInfo, soundManager);



    function cursorCollision() {

        myCursor.blocked(!myGameBoard.checkCell(magic.pixelToGrid(myCursor.cursor.center)));

        for (let index in myEnemies.enemies) {
            if (magic.collision(myCursor.cursor.hitbox, myEnemies.enemies[index].hitbox)) {
                myCursor.blocked(true);
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
        for (let enemy in myEnemies.enemies) {
            for (let laser in myLasers.lasers) {
                if (myEnemies.enemies[enemy] !== undefined) {
                    if (magic.collision(myLasers.lasers[laser].hitbox, myEnemies.enemies[enemy].hitbox)) {
                        if (myLasers.lasers[laser].target.id == myEnemies.enemies[enemy].id) {
                            myLasers.hitLaser(myLasers.lasers[laser], myEnemies.enemies[enemy]);
                        }
                    }
                }
            }
        }
    }

    function collinsions() {
        enemiesInRadius();
        enemiesToLaser();
    }

    function loadLevel() {
        myGameBoard.genBoard();
        myWaves.loadWaves("temp");
        //myPathfinder.findPath({ x: 0, y: magic.CANVAS_SIZE / 2 }, { x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 }, false);
        myInfo.loadTowers(myTowers.towerDictionary);
    }

    function checkWin() {
        if (!myWaves.checkWaves()) {
            console.log("All waves complete");
        }
    }


    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
    }

    function update(elapsedTime) {
        collinsions();

        myWaves.update(elapsedTime);
        myParticles.update(elapsedTime);
        myEnemies.update(elapsedTime);
        myHealthbars.update(elapsedTime);
        myTowers.update(elapsedTime);

        myCursor.update(elapsedTime);
        myGameBoard.update(elapsedTime);
        myInfo.update(elapsedTime);
        myUpgrades.update(elapsedTime);
        myLasers.update(elapsedTime);

        checkWin();
        cursorCollision();
    }

    function render() {
        graphics.clear();
        myGameBoard.render();

        myTowers.render();
        myEnemies.render();
        myHealthbars.render();
        myLasers.render();
        myInfo.render();
        myUpgrades.render();
        if (myEnemies.length == 0)
            myWaves.render();
        myParticles.render();
    }

    function sellaTower() {
        let tower = myUpgrades.tower;
        if (tower != null) {
            let coords = magic.pixelToGrid(tower.center);
            let obj = myGameBoard.removeObject(coords);
            myTowers.deleteTower(obj);
            myInfo.addCoins(Math.floor(obj.cost * magic.SELL_PRICE));
            myUpgrades.setTower(null);
            myEnemies.updatePath();
        }
    }


    function setControls() {
        myKeyboard.register(data.controls.grid.key, myGameBoard.toggleGrid);
        myKeyboard.register(data.controls.upgrade1.key, function () {
            if (myInfo.coins >= myUpgrades.tower?.upgrades["cost"][0][0]) {
                myInfo.addCoins(-myTowers.upgrade(myUpgrades.tower, 0));
            }
        });
        myKeyboard.register(data.controls.upgrade2.key, function () {
            if (myInfo.coins >= myUpgrades.tower?.upgrades["cost"][1][0]) {
                myInfo.addCoins(-myTowers.upgrade(myUpgrades.tower, 1));
            }
        });
        myKeyboard.register(data.controls.upgrade3.key, function () {
            if (myInfo.coins >= myUpgrades.tower?.upgrades["cost"][2][0]) {
                myInfo.addCoins(-myTowers.upgrade(myUpgrades.tower, 2));
            }
        });
        myKeyboard.register(data.controls.sell.key, sellaTower);
        myKeyboard.register(data.controls.startWave.key, function () {
            //myPathfinder.groundPathfinding({ x: 0, y: magic.CANVAS_SIZE / 2 }, { x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 });
            //myEnemies.spawnEnemy("thing", { x: 0, y: magic.CANVAS_SIZE / 2 }, { x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 }, "ground")
            if (myEnemies.length == 0) {
                myWaves.nextWave();
                myInfo.plusWave();
            }
        });
        myMouse.register('mousedown', function (e) {
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
                    myInfo.addCoins(-myUpgrades.buyUpgrade());
                    if (myUpgrades.sellTower())
                        sellaTower()
                }
                if (e.ctrlKey) {
                    let obj = myGameBoard.removeObject(coords);
                    if (obj != null) {
                        myTowers.deleteTower(obj);
                        myInfo.addCoins(Math.floor(obj.cost * magic.SELL_PRICE));
                        myUpgrades.setTower(null);
                        myEnemies.updatePath();
                    }
                }
                else if (myInfo.placing) {
                    if (myCursor.isClear() && myGameBoard.checkCell(coords)) {
                        let tower = myTowers.getTower(myCursor.tower.name);
                        if (myInfo.hasFunds(tower.cost)) {
                            myInfo.addCoins(-tower.cost)
                            tower = myTowers.makeTower(pixelCoords, myCursor.tower.name);
                            myGameBoard.addObject(coords, tower);
                        }
                        myEnemies.updatePath();


                    }
                }
                else {
                    let tower = myGameBoard.getObject(coords);
                    if (tower?.type == "tower") {
                        myUpgrades.setTower(tower);
                    }
                }
            }
        });
        let lastGrid = null;
        graphics.canvas.addEventListener(
            'mousemove', function (e) {
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
        );
        graphics.canvas.addEventListener(
            'mouseleave', function (e) {
                myCursor.hideCursor();
            }
        );

    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        update(elapsedTime);
        processInput(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    function initialize() {
    }

    function run() {
        lastTimeStamp = performance.now();
        loadLevel();
        setControls();
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };

}(MyGame.game, MyGame.objects, MyGame.assets, MyGame.render, MyGame.graphics, MyGame.input, MyGame.sounds, MyGame.data));