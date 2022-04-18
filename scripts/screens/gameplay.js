MyGame.screens['game-play'] = (function (game, objects, assets, renderer, graphics, input, sounds, data) {
    'use strict';

    let lastTimeStamp = performance.now();

    let myKeyboard = input.Keyboard();
    let myMouse = input.Mouse();

    let soundManager = sounds.manager();

    const GRID_SIZE = 17;
    const CELL_SIZE = graphics.canvas.height / GRID_SIZE;
    const X_OFFSET = graphics.canvas.width - graphics.canvas.height;

    let converter = {
        gridToPixel: function (point) {
            let x = (parseInt(point.x) + .5) * CELL_SIZE;
            let y = (parseInt(point.y) + .5) * CELL_SIZE;
            return { x: x, y: y };
        },
        pixelToGrid: function (point) {
            let x = Math.floor(((point.x) / graphics.canvas.height) * GRID_SIZE);
            let y = Math.floor(((point.y) / graphics.canvas.height) * GRID_SIZE);
            return { x: x, y: y };
        },
        mouseToGrid: function (point) {
            let rect = graphics.canvas.getBoundingClientRect();
            let x = Math.floor(((point.x - rect.x) / rect.height) * GRID_SIZE);
            let y = Math.floor(((point.y - rect.y) / rect.height) * GRID_SIZE);
            return { x: x, y: y };
        }
    };

    let magic = {
        GRID_SIZE: GRID_SIZE, // how many cells are in the grid 
        CELL_SIZE: CELL_SIZE, // how big each cell is in pixels
        X_OFFSET: X_OFFSET, //gap on the right where menu is 
        RPS: Math.PI / 500, // 1 Rotation per second
        CANVAS_SIZE: graphics.canvas.height,
        converter: converter,
    }

    let myGameBoard = objects.Gameboard(assets, graphics, magic);
    let myParticles = objects.Particles(assets, graphics, magic);

    let myCursor = objects.Cursor(assets, graphics, magic);
    let myInfo = objects.Info(assets, graphics, magic, myCursor);

    let myPathfinder = objects.Path(myGameBoard.board, magic)
    let myEnemies = objects.Enemies(assets, graphics, magic, myPathfinder.paths);

    let myTowers = objects.Towers(assets, graphics, magic);


    // Checks to see if two boxes have collided
    function checkCollision(box1, box2) {
        let collision = !(
            box2.xmin > box1.xmax ||
            box2.xmax < box1.xmin ||
            box2.ymin > box1.ymax ||
            box2.ymax < box1.ymin);
        return collision;
    }

    function cursorCollision() {
        if (!myGameBoard.checkCell(converter.pixelToGrid(myCursor.cursor.center)))
            return true;
        return false;
    }

    function loadLevel() {
        myGameBoard.genBoard();
        myPathfinder.Pathfinding({ x: 0, y: magic.CANVAS_SIZE / 2 }, { x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 }, false);
        myInfo.loadTowers(myTowers.towerDictionary);
    }


    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
    }

    function update(elapsedTime) {

        myParticles.update(elapsedTime);
        myEnemies.update(elapsedTime);
        myTowers.update(elapsedTime);

        myCursor.update(elapsedTime);
        myGameBoard.update(elapsedTime);
        if (cursorCollision())
            myCursor.blocked();
        myInfo.update(elapsedTime);
    }

    function render() {
        graphics.clear();
        myGameBoard.render();
        myParticles.render();

        myTowers.render();
        myEnemies.render();
        myInfo.render();
    }

    function setControls() {
        myKeyboard.register(data.controls.grid.key, myGameBoard.toggleGrid);
        myKeyboard.register(data.controls.spawnEnemy.key, function () {
            //myPathfinder.groundPathfinding({ x: 0, y: magic.CANVAS_SIZE / 2 }, { x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 });
            myEnemies.spawnEnemy("thing", { x: 0, y: magic.CANVAS_SIZE / 2 }, { x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 }, "ground")
        });
        myKeyboard.register(data.controls.testKey2.key, function () {
            myInfo.buyTower("turret");
        });
        myMouse.register('mousedown', function (e) {
            let coords = converter.mouseToGrid({ x: e.clientX, y: e.clientY })
            let pixelCoords = converter.gridToPixel(coords);
            if (e.ctrlKey) {
                let obj = myGameBoard.removeObject(coords);
                if (obj != null) {
                    myTowers.deleteTower(obj);
                    myInfo.addCoins(Math.floor(obj.cost * .99));
                    myPathfinder.Pathfinding({ x: 0, y: magic.CANVAS_SIZE / 2 }, { x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 }, false);
                }

            }
            if (myInfo.placing && !e.ctrlKey) {
                if (myCursor.isClear() && myGameBoard.checkCell(coords)) {
                    let tower = myTowers.getTower("turret");
                    if (myInfo.hasFunds(tower.cost)) {
                        myInfo.addCoins(-tower.cost)
                        tower = myTowers.makeTower(pixelCoords, "turret");
                        myGameBoard.addObject(coords, tower);
                        myPathfinder.Pathfinding({ x: 0, y: magic.CANVAS_SIZE / 2 }, { x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 }, false);
                    }
                    //myEnemies.spawnEnemy("thing", { x: 0, y: magic.CANVAS_SIZE / 2 },{ x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 }, "ground")
                    //myParticles.makeCoin(converter.gridToPixel(coords));
                    //myInfo.addCoins(10);

                }
            }
        });
        let lastGrid = null;
        graphics.canvas.addEventListener(
            'mousemove', function (e) {
                let coords = converter.mouseToGrid({ x: e.clientX, y: e.clientY })
                //console.log(coords)
                let pixelCoords = converter.gridToPixel(coords);
                myCursor.setCursor(pixelCoords);
                // add pathfinding thing here
                if ((coords.x < GRID_SIZE && coords.y < GRID_SIZE)) {
                    if (!(coords.x <= 0 || coords.y <= 0)) {
                        if (lastGrid != null && (lastGrid.x != coords.x || lastGrid.y != coords.y)) {
                            if (myGameBoard.board[lastGrid.x][lastGrid.y].object == "Cursor") {
                                myGameBoard.removeObject(lastGrid)
                            }

                        }
                        if (myGameBoard.checkCell(coords)) {
                            myGameBoard.addObject(coords, "Cursor")
                            console.log(myPathfinder.Pathfinding({ x: 0, y: magic.CANVAS_SIZE / 2 }, { x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 }, false))
                            if (myPathfinder.Pathfinding({ x: 0, y: magic.CANVAS_SIZE / 2 }, { x: magic.CANVAS_SIZE, y: magic.CANVAS_SIZE / 2 }, false)) {
                                myGameBoard.removeObject(coords)
                            }
                        }
                        lastGrid = coords;
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