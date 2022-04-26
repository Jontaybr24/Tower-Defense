MyGame.screens['settings'] = (function (game, sounds, data, assets) {
    'use strict';

    let soundManager = sounds.manager();

    let table = document.getElementById('controls');
    let index = 0;

    function setControl(id, key) {
        console.log(id, key);
        if (key != 'Escape') {
            let node = document.getElementById(id);
            if (key == ' ')
                node.innerHTML = 'Space';
            else
                node.innerHTML = key;
            for (let control in data.controls) {
                if (data.controls[control].label == id) {
                    data.controls[control].key = key;
                }
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

    function updateSelections() {
        document.getElementById('grid').checked = data.toggleGrid;
        document.getElementById('path').checked = data.togglePath;
        document.getElementById('volume').value = data.volume * 100;
    }

    localStorage['data'] = JSON.stringify(data);

    function initialize() {

        document.getElementById('volume').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });

        document.getElementById('volume').addEventListener(
            "input",
            function (e) {
                data.volume = document.getElementById('volume').value / 100;
                localStorage['data'] = JSON.stringify(data);
            });
        document.getElementById('grid-box').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });

        document.getElementById('grid-box').addEventListener(
            "click",
            function () {
                data.toggleGrid = document.getElementById('grid').checked;
                localStorage['data'] = JSON.stringify(data);
            });
        document.getElementById('path-box').addEventListener(
            "click",
            function () {
                data.togglePath = document.getElementById('path').checked;
                localStorage['data'] = JSON.stringify(data);
            });

        document.getElementById('volume').addEventListener(
            "input",
            function (e) {
                data.volume = document.getElementById('volume').value / 100;
                localStorage['data'] = JSON.stringify(data);
            });

        document.getElementById('id-settings-back').addEventListener(
            'click',
            function () { game.showScreen('main-menu'); });
        document.getElementById('id-settings-back').addEventListener(
            "mouseenter",
            function () { soundManager.play(assets.menu_hover); });

        for (let control in data.controls) {
            let label = data.controls[control].label;
            let key = data.controls[control].key;
            if (key == ' ')
                key = 'Space';
            let row = table.insertRow(index++);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);

            cell1.innerHTML = label;
            cell2.innerHTML = key;
            cell2.id = label;
            row.id = label + '-row';
            row.addEventListener(
                'click',
                function () { select(label); });
            document.getElementById(label + '-row').addEventListener(
                "mouseenter",
                function () { soundManager.play(assets.menu_hover); });
        }
    }

    function run() {
        deselect();
        updateSelections();
    }

    return {
        initialize: initialize,
        run: run
    };

}(MyGame.game, MyGame.sounds, MyGame.data, MyGame.assets));