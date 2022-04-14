MyGame.screens['settings'] = (function (game, sounds, data) {
    'use strict';

    console.log(data)

    let soundManager = sounds.manager();
    let node = document.getElementById('move-up');
    if (data.controls.up == ' ')
        node.innerHTML = 'Space';
    else
        node.innerHTML = data.controls.up;
    node = document.getElementById('move-down');
    if (data.controls.down == ' ')
        node.innerHTML = 'Space';
    else
        node.innerHTML = data.controls.down;
    node = document.getElementById('move-left');
    if (data.controls.left == ' ')
        node.innerHTML = 'Space';
    else
        node.innerHTML = data.controls.left;
    node = document.getElementById('move-right');
    if (data.controls.right == ' ')
        node.innerHTML = 'Space';
    else
        node.innerHTML = data.controls.right;
    node = document.getElementById('fire');
    if (data.controls.fire == ' ')
        node.innerHTML = 'Space';
    else
        node.innerHTML = data.controls.fire;

    function setControl(id, key) {
        if (key != 'Escape') {
            let node = document.getElementById(id);
            if (key == ' ')
                node.innerHTML = 'Space';
            else
                node.innerHTML = key;
            switch (id) {
                case 'move-right':
                    data.controls.right = key;
                    break;
                case 'move-left':
                    data.controls.left = key;
                    break;
                case 'move-up':
                    data.controls.up = key;
                    break;
                case 'move-down':
                    data.controls.down = key;
                    break;
                case 'move-fire':
                    data.controls.fire = key;
                    break;
            }
            localStorage['data'] = JSON.stringify(data);
        }
    }

    function keyPress(e) {
        let active = document.getElementsByClassName('selected');
        if (active.length == 1)
            setControl(active[0].id, e.key);
        deselect();
    }

    function select(id) {
        deselect();
        window.addEventListener('keyup', keyPress);
        let node = document.getElementById(id);
        node.classList.add('selected');
    }

    function deselect() {
        window.removeEventListener('keyup', keyPress);
        let active = document.getElementsByClassName('selected');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('selected');
        }
    }

    localStorage['data'] = JSON.stringify(data);

    function initialize() {

        document.getElementById('id-settings-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
        document.getElementById('up-row').addEventListener(
            'click',
            function () { select('move-up'); });
        document.getElementById('down-row').addEventListener(
            'click',
            function () { select('move-down'); });
        document.getElementById('left-row').addEventListener(
            'click',
            function () { select('move-left'); });
        document.getElementById('right-row').addEventListener(
            'click',
            function () { select('move-right'); });
        document.getElementById('fire-row').addEventListener(
            'click',
            function () { select('fire'); });


        document.getElementById('up-row').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('down-row').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('right-row').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('left-row').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('fire-row').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
        document.getElementById('id-settings-back').addEventListener(
            "mouseenter",
            function () { soundManager.play("soundFX/menu-hover.wav"); });
    }

    function run() {
        deselect();
    }

    return {
        initialize: initialize,
        run: run
    };

}(MyGame.game, MyGame.sounds, MyGame.data));