MyGame.screens['highscores'] = (function (game, sounds, assets, levels, data) {
    'use strict';
    let soundManager = sounds.manager();


    function showLevel(level) {
        let htmlNode = document.getElementById('highscore-text');
        htmlNode.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            htmlNode.innerHTML += data.score[level][i] + "<br>";
        }
        htmlNode = document.getElementById('level-tag');
        htmlNode.innerHTML = level.replace("level", "Level ");
    }

    function initialize() {
        document.getElementById('id-score-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
        document.getElementById('id-score-back').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
        let container = document.getElementById("score-grid");
        for (let level in levels) {
            let newDiv = document.createElement("div");
            newDiv.id = level;
            newDiv.className = "grid-item";
            newDiv.innerHTML = level.replace("level", "");
            newDiv.classList.add("unlocked");
            newDiv.addEventListener('click', function () {
                showLevel(level);
            });
            newDiv.addEventListener(
                "mouseenter",
                function () { soundManager.play(assets.menu_hover); });
            container.appendChild(newDiv);
        }
    }

    function run() {
        showLevel("level1");
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game, MyGame.sounds, MyGame.assets, MyGame.levels, MyGame.data));
