MyGame.objects.Menu = function (assets, graphics, magic) {
    'use strict';
    let currentTower = null;

    function render() {
        if(currentTower != null){
            graphics.drawEllipse({ center: currentTower.center, radius: currentTower.radius }, "rgba(0, 25, 0, .25)", "black");
        }
    }

    function update(elapsedTime) {
    }

    function setTower(tower){
        currentTower = tower;
    }


    let api = {
        update: update,
        render: render,
        setTower: setTower,
    };

    return api;
}