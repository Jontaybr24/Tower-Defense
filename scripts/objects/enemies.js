
MyGame.objects.Enemies = function (assets, graphics, magic, Pathfinder, info, particles, bars, model, towers, sounds, missiles) {

  'use strict';

  let enemies = {};
  let wisps = {};
  let count = 0; // the number for hte id of the enemies
  let threshold = 10;
  let timePassed = 0;
  let score = 0;


  let enemiesDictionary = {
    Cube: {
      name: "Cube",
      type: "ground",
      moveRate: 300 / 1000,
      health: 1000,
      worth: 500,
      spec: {
        spriteSheet: assets.Cube,
        subIndex: { x: 0, y: 0 },
        subTextureWidth: { x: 32, y: 32 },
        spriteCount: 11,
        spriteTime: 100
      }  // ms per frame

    },
    Spider: {
      name: "Spider",
      type: "ground",
      moveRate: 100 / 1000,
      health: 20,
      worth: 5,
      spec: {
        spriteSheet: assets.Spider,
        subIndex: { x: 0, y: 0 },
        subTextureWidth: { x: 32, y: 32 },
        spriteCount: 4,
        spriteTime: 70
      }  // ms per frame

    },
    Drone: {
      name: "Drone",
      type: "flying",
      moveRate: 200 / 1000,
      health: 20,
      worth: 50,
      spec: {
        spriteSheet: assets.Drone,
        subIndex: { x: 0, y: 0 },
        subTextureWidth: { x: 32, y: 32 },
        spriteCount: 4,
        spriteTime: 60
      },

    },
    Wisp: {
      name: "Wisp",
      type: "ground",
      moveRate: 500 / 1000,
      health: 100000,
      worth: 0,
      spec: {
        spriteSheet: assets.Wisp,
        subIndex: { x: 0, y: 0 },
        subTextureWidth: { x: 32, y: 32 },
        spriteCount: 1,
        spriteTime: 100
      }  // ms per frame

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
        spawn = magic.spawnPoints.E;
        end = magic.spawnPoints.W;
        break;
      case "S":
        spawn = magic.spawnPoints.S;
        end = magic.spawnPoints.N;
        break;
      case "W":
        spawn = magic.spawnPoints.W;
        end = magic.spawnPoints.E;
        break;
      default:
        spawn = magic.spawnPoints.N;
        end = magic.spawnPoints.S;
    }
    let enemy = JSON.parse(JSON.stringify(enemiesDictionary[name]));
    spawn = JSON.parse(JSON.stringify(spawn));
    end = JSON.parse(JSON.stringify(end));
    //console.log(spawn, end);

    let cpath = Pathfinder.findPath(spawn, end, enemy.type)
    enemy.spec = enemiesDictionary[name].spec;
    enemy.target = spawn;
    enemy.center = spawn;
    enemy.rotation = 0;
    enemy.goal = end;
    enemy.id = count++;
    enemy.takeHit = takeHit;
    enemy.setStatus = setStatus;
    enemy.wince = 0;
    enemy.status = { ice: 0, poison: { timeRemaing: 0, interval: 0, timeHit: 0, dmg: 0 } }
    enemy.path = cpath;
    enemy.rig = new model(enemy.spec, graphics)
    enemy.hitbox = { xmin: 0, xmax: 0, ymin: 0, ymax: 0 }
    magic.sethitbox(enemy, { x: magic.CELL_SIZE, y: magic.CELL_SIZE })
    bars.newHealthbar(enemy);
    if (name == "Wisp") {
      wisps[enemy.id] = enemy;
    }
    else
      enemies[enemy.id] = enemy;

  }

  function setStatus(enemy, status) {
    if (status.type == "ice") {
      enemy.status.ice = status.time
    }
    if (status.type == "poison") {
      enemy.status.poison.timeRemaing = status.time;
      enemy.status.poison.interval = status.interval;
      enemy.status.poison.dmg = status.dmg;
    }
  }

  // function for taking damage returns true if the enemy died
  function takeHit(enemy, amount) {
    enemy.health -= amount;

    enemy.spec.subIndex.y = 3;
    enemy.wince = 15;

    if (enemy.health <= 0) {
      info.addCoins(enemy.worth, enemy.center);
      score += enemy.worth;
      sounds.play(assets.death);

      kill(enemy);
      return true;
    }
    return false;
  }
  function kill(enemy) {
    let keys = Object.keys(enemies);
    let newEnemy = keys[Math.floor(keys.length * Math.random())]
    missiles.newTarget(enemy, enemies[newEnemy]);
    bars.removeBar(enemy.id);
    towers.removeTarget(enemy);
    delete enemies[enemy.id];
  }

  function killWisp(wisp) {
    delete wisps[wisp.id];
  }
  function update(elapsedTime) {
    for (let index in wisps) {
      wisps[index].rig.update(elapsedTime);
      wisps[index].velocity = magic.computeVelocity(wisps[index].center, wisps[index].target);
      wisps[index].rotation = magic.computeRotation(wisps[index].velocity);
      wisps[index].rotation -= Math.PI / 2;
      let movevector = { x: wisps[index].target.x - wisps[index].center.x, y: wisps[index].target.y - wisps[index].center.y }
      let magnitude = Math.sqrt((movevector.x * movevector.x) + (movevector.y * movevector.y))

      if (magnitude < threshold) {
        if (wisps[index].path == null || wisps[index].path.length == 0) {
          killWisp(wisps[index]);
        }
        else {
          wisps[index].target = magic.gridToPixel(wisps[index].path[0]);

          wisps[index].path.splice(0, 1);
        }
      }
      else {
        wisps[index].center.x += (wisps[index].moveRate * elapsedTime * wisps[index].velocity.x)
        wisps[index].center.y += (wisps[index].moveRate * elapsedTime * wisps[index].velocity.y)
      }
    }




    timePassed += elapsedTime;
    for (let index in enemies) {
      if (enemies[index].status.poison.timeRemaing > 0) {
        enemies[index].status.poison.timeRemaing -= elapsedTime
        enemies[index].status.poison.timeHit += elapsedTime
        enemies[index].spec.subIndex.y = 2;
      }
      if (enemies[index].status.ice > 0) {
        enemies[index].status.ice -= elapsedTime
        enemies[index].spec.subIndex.y = 1;
      }
      if (!(enemies[index].status.ice > 0) && !(enemies[index].status.poison.timeRemaing > 0) && (enemies[index].wince < 0)) {
        enemies[index].spec.subIndex.y = 0;
      }
      enemies[index].wince -= elapsedTime
      //console.log(enemies[index].status);
      enemies[index].rig.update(elapsedTime);
      enemies[index].velocity = magic.computeVelocity(enemies[index].center, enemies[index].target);
      enemies[index].rotation = magic.computeRotation(enemies[index].velocity);
      enemies[index].rotation -= Math.PI / 2;

      let movevector = { x: enemies[index].target.x - enemies[index].center.x, y: enemies[index].target.y - enemies[index].center.y }
      let magnitude = Math.sqrt((movevector.x * movevector.x) + (movevector.y * movevector.y))

      if (magnitude < threshold) {
        if (enemies[index].path == null || enemies[index].path.length == 0) {
          if (!(enemies[index].name == "Wisp"))
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
        if (!(enemies[index].status.ice > 0)) {
          if ((enemies[index].name != "Cube" || enemies[index].name == "Cube" && [9, 10, 11].includes(enemies[index].rig.xIndex))) {
            enemies[index].center.x += (enemies[index].moveRate * elapsedTime * enemies[index].velocity.x)
            enemies[index].center.y += (enemies[index].moveRate * elapsedTime * enemies[index].velocity.y)
          }
        }
        //console.log(enemies[index])
        magic.sethitbox(enemies[index], { x: magic.CELL_SIZE, y: magic.CELL_SIZE })
        if (enemies[index].status.poison.timeHit > enemies[index].status.poison.interval) {
          enemies[index].status.poison.timeHit = 0
          enemies[index].takeHit(enemies[index], enemies[index].status.poison.dmg)
        }
      }

    }

  }

  function updatePath() {
    for (let index in wisps) {
      wisps[index].path = Pathfinder.findPath(wisps[index].center, wisps[index].goal, wisps[index].type)
    }
    for (let index in enemies) {
      enemies[index].path = Pathfinder.findPath(enemies[index].center, enemies[index].goal, enemies[index].type)
    }
  }
  function render() {
    for (let index in wisps) {
      wisps[index].rig.render({ center: wisps[index].center, rotation: wisps[index].rotation, subSize: { x: magic.CELL_SIZE, y: magic.CELL_SIZE }, suby: 0 });
    }
    for (let index in enemies) {
      enemies[index].rig.render({ center: enemies[index].center, rotation: enemies[index].rotation, subSize: { x: magic.CELL_SIZE, y: magic.CELL_SIZE }, suby: enemies[index].spec.subIndex.y });

      //graphics.drawRectangle({center:{x:(enemies[index].hitbox.xmin +enemies[index].hitbox.xmax)/2,y:(enemies[index].hitbox.ymin +enemies[index].hitbox.ymax)/2}, size:{x:enemies[index].hitbox.xmin - enemies[index].hitbox.xmax, y:enemies[index].hitbox.ymin - enemies[index].hitbox.ymax}}, "red","red");
    }
  }

  function clearAll() {
    score = 0;
    for (let idx in enemies) {
      kill(enemies[idx]);
    }
  }

  function clearWisps() {
    for (let idx in wisps) {
      killWisp(wisps[idx]);
    }
  }

  let api = {
    spawnEnemy: spawnEnemy,
    updatePath: updatePath,
    update: update,
    render: render,
    clearAll: clearAll,
    clearWisps: clearWisps,
    get enemies() { return enemies; },
    get length() { return Object.keys(enemies).length },
    get score() { return score; }
  };

  return api;
}
