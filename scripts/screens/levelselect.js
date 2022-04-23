MyGame.screens['level-select'] = (function (game, sounds, assets, levels) {
    'use strict';
    let soundManager = sounds.manager();

    function initialize() {
        document.getElementById('id-level-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
        document.getElementById('id-level-back').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
        let container = document.getElementById("level-grid");
        for (let level in levels) {
            let newDiv = document.createElement("div");
            newDiv.className = "grid-item";
            newDiv.innerHTML = level.replace("level", "");
            if (levels[level].unlocked) {
                newDiv.classList.add("unlocked");
                newDiv.addEventListener(
                    'click',
                    function () { game.showScreen('game-play', levels[level]); });
                newDiv.addEventListener(
                    "mouseenter",
                    function () { soundManager.play(assets.menu_hover); });
            }
            container.appendChild(newDiv);

        }
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game, MyGame.sounds, MyGame.assets, MyGame.levels));
