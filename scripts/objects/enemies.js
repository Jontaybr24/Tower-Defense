
MyGame.objects.Enemies = function (assets, graphics, magic, Pathfinder, info, particles, bars, model, towers) {

  'use strict';

  let enemies = {};
  let count = 0; // the number for hte id of the enemies
  const ROTATION = 0;
  let threshold = 10;
  const BUFFER = 100 // time in ms for button presses to register after being held
  let timePassed = 0;
  let spawnPoints = magic.spawnPoints;

  let enemiesDictionary = {
    Spider: {
      name: "Spider",
      type: "ground",
      moveRate: 100/1000,
      health: 40,
      spec:{
        spriteSheet: assets.Spider,
        subIndex : {x: 0, y:0},
        subTextureWidth: {x: 32, y:32},
        spriteCount : 4,
        spriteTime: 70 }  // ms per frame
        
    },
    Drone: {
      name: "Drone",
      type: "flying",
      moveRate: 200/1000,
      health: 20,
      spec:{
        spriteSheet: assets.Drone,
        subIndex : {x: 0, y:0},
        subTextureWidth: {x: 32, y:32},
        spriteCount : 4,
        spriteTime: 60 }, 
      
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
    magic.sethitbox(enemy,{x: magic.CELL_SIZE, y:magic.CELL_SIZE})
    bars.newHealthbar(enemy);
    enemies[enemy.id] = enemy;

  }

  // function for taking damage returns true if the enemy died
  function takeHit(enemy, amount) {
    enemy.health -= amount;
    if (enemy.health <= 0) {
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
      enemies[index].velocity = magic.computeVelocity(enemies[index].center, enemies[index].target);
      enemies[index].rotation = magic.computeRotation(enemies[index].velocity);
      enemies[index].rotation -= Math.PI/2;
     
      let movevector = { x: enemies[index].target.x - enemies[index].center.x, y: enemies[index].target.y - enemies[index].center.y }
      let magnitude = Math.sqrt((movevector.x * movevector.x) + (movevector.y * movevector.y))
      
      if (magnitude < threshold) {
        if (enemies[index].path == null || enemies[index].path.length == 0) {
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
        enemies[index].center.x += (enemies[index].moveRate * elapsedTime * enemies[index].velocity.x)
        enemies[index].center.y += (enemies[index].moveRate * elapsedTime * enemies[index].velocity.y)
        
        //console.log(enemies[index])
        magic.sethitbox(enemies[index],{x: magic.CELL_SIZE, y:magic.CELL_SIZE})
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

      //graphics.drawRectangle({center:{x:(enemies[index].hitbox.xmin +enemies[index].hitbox.xmax)/2,y:(enemies[index].hitbox.ymin +enemies[index].hitbox.ymax)/2}, size:{x:enemies[index].hitbox.xmin - enemies[index].hitbox.xmax, y:enemies[index].hitbox.ymin - enemies[index].hitbox.ymax}}, "red","red");
    }
  }

  function clearAll(){
      for(let idx in enemies){
          kill(enemies[idx]);
      }
  }


  let api = {
    spawnEnemy: spawnEnemy,
    updatePath: updatePath,
    update: update,
    render: render,
    clearAll: clearAll,
    get enemies() { return enemies; },
    get length() { return Object.keys(enemies).length }
  };

  return api;
}
