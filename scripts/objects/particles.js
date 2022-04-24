MyGame.objects.Particles = function (assets, graphics, magic) {
  'use strict';

  let sprites = {};

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

  

  function update(elapsedTime) {
  }

  function render() {
  }

  let api = {
    addSprite: addSprite,
    update: update,
    render: render,
  };

  return api;
}
