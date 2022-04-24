MyGame.objects.CoinFX = function (assets, graphics, magic) {
  'use strict';

  let coinFX = {};
  let index = 0;

  function update(elapsedTime) {
    for (let effect in coinFX) {
        coinFX[effect].lifetime += elapsedTime;
        coinFX[effect].center.x += coinFX[effect].velocity.x;
        coinFX[effect].center.y += coinFX[effect].velocity.y;
        if (coinFX[effect].lifetime > coinFX[effect].decay) {
            delete coinFX[effect];
        }
    }
  }

  function render() {
    for (let effect in coinFX) {
        let particle = coinFX[effect];
        if (particle.amount != 0) {
            graphics.drawTexture(particle.image, particle.center, particle.rotation, particle.size);
            graphics.drawText(particle.amount, {x: particle.center.x + 10, y: particle.center.y + 10}, particle.color, "32px Arial")
        }
    }
}

function makeCoin(point, amount) {
  if(amount !=0){
    let color = "green"
  if (amount< 0){
    color = "red"
  }
    coinFX[index++] = {
        center: point,    // The coinFX position
        lifetime: 0,           // how long the coinFX been alive 
        decay: 500,   // how long the sprite will be alive
        rotation: 0,  // the rotation of the sprite
        velocity: { x: 0, y: -1000 / 1000 },  // the veloocity of the sprite
        size: { x: magic.MENU_SIZE * .4, y: magic.MENU_SIZE * .4 },     // how big to render the sprite
        image: assets.coin,
        amount: Math.abs(amount),
        color: color,
    }
  }
}

  let api = {
    update: update,
    render: render,
    makeCoin: makeCoin,
  };

  return api;
}
