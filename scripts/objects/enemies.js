MyGame.objects.Enemies = function (assets, graphics, magic, Pathfinder) {
  'use strict';

  let enemies = {};
  let count = 0; // the number for hte id of the enemies
  let moveRate = .1;
  const ROTATION = 0;
  let threshold = 2;
  const BUFFER = 100 // time in ms for button presses to register after being held
  let timePassed = 0;

  function spawnEnemy(cname, spawn, end, ctype) {
    if (timePassed > BUFFER) {
      timePassed = 0;

      let cpath = Pathfinder.findPath(spawn, end, ctype)
      let newEnemy = {
        name: cname,
        center: spawn,
        goal: end,
        type: ctype,
        moveRate: moveRate,
        target: spawn,
        path: cpath,
        health: 100,
        id: count++,
        kill: kill,
      };
      enemies[newEnemy.id] = newEnemy;
    }
  }

  // function for taking damage returns true if the enemy died
  function kill(enemy) {
    delete enemies[enemy.id];
  }


  function update(elapsedTime) {
    timePassed += elapsedTime;
    for (let index in enemies) {

      let movevector = { x: enemies[index].target.x - enemies[index].center.x, y: enemies[index].target.y - enemies[index].center.y }
      let magnitude = Math.sqrt((movevector.x * movevector.x) + (movevector.y * movevector.y))

      if (magnitude < threshold) {
        if (enemies[index].path.length == 0) {
          delete enemies[index];
        }
        else {
          enemies[index].target = magic.converter.gridToPixel(enemies[index].path[0]);
          //console.log(enemies[index].target)
          enemies[index].path.splice(0, 1);
        }
      }
      else {
        enemies[index].center.x += (enemies[index].moveRate * elapsedTime * Math.sign(movevector.x))
        enemies[index].center.y += (enemies[index].moveRate * elapsedTime * Math.sign(movevector.y))
      }
    }
  }

  function updatePath() {
    for (let index in enemies) {
      enemies[index].path = Pathfinder.findPath(enemies[index].center, enemies[index].goal, enemies[index].type)
    }
  }
  function render() {
    for (let index in enemies) {
      graphics.drawTexture(assets.coin, enemies[index].center, ROTATION, { x: magic.CELL_SIZE, y: magic.CELL_SIZE });
    }
  }

  let api = {
    spawnEnemy: spawnEnemy,
    updatePath: updatePath,
    update: update,
    render: render,
    get enemies() { return enemies; },
  };

  return api;
}
