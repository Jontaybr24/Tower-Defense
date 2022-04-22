<<<<<<< HEAD
MyGame.objects.Enemies = function (assets, graphics, magic, Pathfinder, info, particles, bars, model) {
=======
MyGame.objects.Enemies = function (assets, graphics, magic, Pathfinder, info, particles, bars, towers) {
>>>>>>> 7a22bc3cdf0ce34adcc9d90a6db3ec9805f3db1b
  'use strict';

  let enemies = {};
  let count = 0; // the number for hte id of the enemies
  const ROTATION = 0;
  let threshold = 10;
  const BUFFER = 100 // time in ms for button presses to register after being held
  let timePassed = 0;
  let spawnPoints = magic.spawnPoints;

  let enemiesDictionary = {
    slime: {
      name: "slime",
      type: "ground",
      moveRate: 100/1000,
      health: 50,
      spec:{
        spriteSheet: assets.spider,
        subIndex : {x: 0, y:0},
        subTextureWidth: {x: 32, y:32},
        spriteCount : 4,
        spriteTime: 30 }  // ms per frame
        
    },
    runner: {
      name: "runner",
      type: "flying",
      moveRate: 400/1000,
      health: 50,
      spec:{
        spriteSheet: assets.drone,
        subIndex : {x: 0, y:0},
        subTextureWidth: {x: 32, y:32},
        spriteCount : 4,
        spriteTime: 140 }, 
      
    },
  };
  // location takes one of the options: N, E, S, W
  function spawnEnemy(name, location) {
    //if (timePassed > BUFFER) {
    timePassed = 0;
    let spawn = null;
    let end = null;
    switch (location) {
      case "E":
        spawn = spawnPoints.E;
        end = spawnPoints.W;
        break;
      case "S":
        spawn = spawnPoints.S;
        end = spawnPoints.N;
        break;
      case "W":
        spawn = spawnPoints.W;
        end = spawnPoints.E;
        break;
      default:
        spawn = spawnPoints.N;
        end = spawnPoints.S;
    }
    let enemy = JSON.parse(JSON.stringify(enemiesDictionary[name]));
    spawn = JSON.parse(JSON.stringify(spawn));
    end = JSON.parse(JSON.stringify(end));
    
    let cpath = Pathfinder.findPath(spawn, end, enemy.type)
    enemy.spec = enemiesDictionary[name].spec;
    enemy.target = spawn;
    enemy.center = spawn;
    enemy.rotation =0;
    enemy.goal = end;
    enemy.id = count++;
    enemy.takeHit = takeHit;
    enemy.path = cpath;
    enemy.rig = new model(enemy.spec,graphics)
    enemy.hitbox = {xmin:0,xmax:0,ymin:0,ymax:0} 
    magic.sethitbox(enemy)
    bars.newHealthbar(enemy);
    enemies[enemy.id] = enemy;

  }

  // function for taking damage returns true if the enemy died
  function takeHit(enemy, amount) {
    enemy.health -= amount;
    if (enemy.health < 0) {
      particles.makeCoin(enemy.center);
      info.addCoins(10)
      kill(enemy);
      return true;
    }
    return false;
  }
  function kill(enemy) {
    bars.removeBar(enemy.id);
    towers.removeTarget(enemy);
    delete enemies[enemy.id];
  }

  function update(elapsedTime) {
    timePassed += elapsedTime;
    for (let index in enemies) {
      enemies[index].rig.update(elapsedTime);
      let movevector = { x: enemies[index].target.x - enemies[index].center.x, y: enemies[index].target.y - enemies[index].center.y }
      let magnitude = Math.sqrt((movevector.x * movevector.x) + (movevector.y * movevector.y))

      if (magnitude < threshold) {
        if (enemies[index].path.length == 0) {
          info.loseLife(1);
          kill(enemies[index]);
        }
        else {
          enemies[index].target = magic.gridToPixel(enemies[index].path[0]);
          //console.log(enemies[index].target)
          enemies[index].path.splice(0, 1);
        }
      }
      else {
        enemies[index].center.x += (enemies[index].moveRate * elapsedTime * Math.sign(movevector.x))
        enemies[index].center.y += (enemies[index].moveRate * elapsedTime * Math.sign(movevector.y))
        //console.log(enemies[index])
        magic.sethitbox(enemies[index])
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
      enemies[index].rig.render({center:enemies[index].center, rotation:enemies[index].rotation,subSize:{x:magic.CELL_SIZE,y:magic.CELL_SIZE}});
    }
  }

  let api = {
    spawnEnemy: spawnEnemy,
    updatePath: updatePath,
    update: update,
    render: render,
    get enemies() { return enemies; },
    get length() { return Object.keys(enemies).length }
  };

  return api;
}
