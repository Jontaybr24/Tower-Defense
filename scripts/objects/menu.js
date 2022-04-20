MyGame.objects.Menu = function (assets, graphics, magic) {
    'use strict';
    let tower = null;

    function render() {
        if(tower != null){
            graphics.drawEllipse({ center: tower.center, radius: tower.radius }, "rgba(0, 25, 0, .25)", "black");
            /*
            console.log(Math.floor(tower.radius / magic.CELL_SIZE));
            console.log(tower.name);
            console.log(tower.damage);*/
            console.log(tower.path);
        }
    }

    function update(elapsedTime) {
    }

    function setTower(obj){
        tower = obj;
    }

    let api = {
        update: update,
        render: render,
        setTower: setTower,
        get tower() {return tower;},
    };

    return api;
}