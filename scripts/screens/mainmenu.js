MyGame.screens['main-menu'] = (function (game, sounds, assets) {
    'use strict';
    let soundManager = sounds.manager();

    function initialize() {
        //
        // Setup each of menu events for the screens
        document.getElementById('id-new-game').addEventListener(
            'click',
            function () { game.showScreen('level-select'); });

        document.getElementById('id-settings').addEventListener(
            'click',
            function () { game.showScreen('settings'); });

        document.getElementById('id-about').addEventListener(
            'click',
            function () { game.showScreen('about'); });

        document.getElementById('id-highscore').addEventListener(
            'click',
            function () { game.showScreen('highscores'); });
        document.getElementById('id-new-game').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
        document.getElementById('id-settings').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
        document.getElementById('id-about').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
        document.getElementById('id-highscore').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game, MyGame.sounds, MyGame.assets));
