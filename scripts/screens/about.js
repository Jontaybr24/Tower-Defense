MyGame.screens['about'] = (function (game, sounds, assets) {
    'use strict';
    let soundManager = sounds.manager();

    function initialize() {
        document.getElementById('id-about-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
        document.getElementById('id-about-back').addEventListener(
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
