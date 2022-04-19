MyGame.objects.Particles = function (assets, graphics, magic) {
  'use strict';

  let sprites = [];

  function addSprite(sprite) {
    sprites.push({
      center: sprite.pos,    // The sprites position
      lifetime: 0,           // how long the sprites been alive 
      decay: sprite.decay,   // how long the sprite will be alive
      rotation: sprite.rot,  // the rotation of the sprite
      velocity: sprite.vel,  // the veloocity of the sprite
      size: sprite.size,     // how big to render the sprite
      image: sprite.image,
    })
  }

  function makeCoin(point) {
    addSprite({
      pos: point,
      decay: 500, // time in ms
      vel: { x: 0, y: -1000 / 1000 },
      size: { x: magic.CELL_SIZE * .4, y: magic.CELL_SIZE * .4 },
      image: assets.coin,
      rot: 0,
    });
  }

  function update(elapsedTime) {
    for (let effect in sprites) {
      sprites[effect].lifetime += elapsedTime;
      sprites[effect].center.x += sprites[effect].velocity.x;
      sprites[effect].center.y += sprites[effect].velocity.y;
      if (sprites[effect].lifetime > sprites[effect].decay) {
        sprites.splice(effect, 1);
      }
    }
  }

  function render() {
    for (let effect in sprites) {
      let particle = sprites[effect];
      graphics.drawTexture(particle.image, particle.center, particle.rotation, particle.size);
    }
  }

  let api = {
    addSprite: addSprite,
    update: update,
    makeCoin: makeCoin,
    render: render,
  };

  return api;
}
