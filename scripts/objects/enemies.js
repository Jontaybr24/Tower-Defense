MyGame.objects.Enemies = function (assets, graphics, magic, paths) {
  'use strict';

  let enemies = [];
  let moveRate = .1;
  const ROTATION = 0;
  let threshold = 2;
  const BUFFER = 100 // time in ms for button presses to register after being held
  let timePassed = 0;

  function spawnEnemy(cname, spawn, end, ctype) {
    if (timePassed > BUFFER) {
      timePassed = 0;
      goal = magic.converter.pixelToGrid(end);
      let stringGoal = "x:" + String(goal.x) + "y:" + String(goal.y)
      let cpath = [...paths[stringGoal]];
      enemies.push({ name: cname, center: spawn, goal: { x: magic.CANVAS_SIZE, y: magic.CORDSIZE / 2 }, type: ctype, moveRate: moveRate, target: spawn, path: cpath })
    }
  }


  function update(elapsedTime) {
    timePassed += elapsedTime;
    for (let index in enemies) {

      let movevector = { x: enemies[index].target.x - enemies[index].center.x, y: enemies[index].target.y - enemies[index].center.y }
      let magnitude = Math.sqrt((movevector.x * movevector.x) + (movevector.y * movevector.y))

      if (magnitude < threshold) {
        enemies[index].target = magic.converter.gridToPixel(enemies[index].path[0]);
        //console.log(enemies[index].target)
        enemies[index].path.splice(0, 1);
      }
      else {
        enemies[index].center.x += (enemies[index].moveRate * elapsedTime * Math.sign(movevector.x))
        enemies[index].center.y += (enemies[index].moveRate * elapsedTime * Math.sign(movevector.y))
      }

      //checks if enimes have reached the goal
      if (enemies[index].center.x >= enemies[index].goal.x) {
        enemies.splice(index, 1);
      }
    }
  }

  function render() {
    for (let index in enemies) {
      graphics.drawTexture(assets.coin, enemies[index].center, ROTATION, { x: magic.CELL_SIZE, y: magic.CELL_SIZE });
    }
  }

  let api = {
    spawnEnemy: spawnEnemy,
    update: update,
    render: render,
  };

  return api;
}
