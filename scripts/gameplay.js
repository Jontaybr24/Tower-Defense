MyGame.screens['game-play'] = (function (game, objects, renderer, graphics, input, sounds) {
    'use strict';

    let lastTimeStamp = performance.now();

    let myKeyboard = input.Keyboard();

    let soundManager = sounds.manager();

    // Checks to see if two boxes have collided
    function checkCollision(box1, box2) {
        let collision = !(
            box2.xmin > box1.xmax ||
            box2.xmax < box1.xmin ||
            box2.ymin > box1.ymax ||
            box2.ymax < box1.ymin);
        return collision;
    }
    function startGame() {
    }

    function endGame() {
    }

    function setControls() {
    }


    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
    }

    function render() {
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
        startGame();
        setControls();
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.sounds));