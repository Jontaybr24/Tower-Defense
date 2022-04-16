MyGame.objects.Enemies = function (assets, graphics, magic) {
  'use strict';
  let target = {x:-100,y:800}
  let enemies = [];
  let moveRate = .1;
  const ROTATION = 0;
  let threshold = 1;

  function addSprite(cname, point, ctype) {
    enemies.push({name:cname, center:point, goal:{x:magic.CANVAS_SIZE, y:magic.CORDSIZE/2}, type:ctype, moveRate:moveRate})
  }


  function update(elapsedTime) {
    for(let index in enemies){
      
      let movevector = {x:target.x - enemies[index].center.x, y:target.y - enemies[index].center.y}
      let magnitude = Math.sqrt((movevector.x * movevector.x) + (movevector.y * movevector.y))
      
      if(magnitude < threshold){
        console.log("reached target")
      }
      else{
        enemies[index].center.x += (enemies[index].moveRate * elapsedTime * Math.sign(movevector.x))
        enemies[index].center.y += (enemies[index].moveRate * elapsedTime * Math.sign(movevector.y))
      }
      
      //checks if enimes have reached the goal
      if(enemies[index].center.x >= enemies[index].goal.x){
        enemies.splice(index, 1);
      }
    }
  }

  function render(){
    for (let index in enemies){
      graphics.drawTexture(assets.coin, enemies[index].center, ROTATION, { width: magic.CELL_SIZE, height: magic.CELL_SIZE});
    }
  }

  let api = {
    spawnEnemie: addSprite,
    update: update,
    render: render,
  };

  return api;
}
