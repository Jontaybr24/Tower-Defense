MyGame.objects.Particles = function (assets, graphics, magic) {
  'use strict';

  let sprites = {};
  let count = 0;

  function addSprite(sprite) {
    sprites[count] = {
      id: count++,
      center: sprite.center,    // The sprites position
      lifetime: 0,           // how long the sprites been alive 
      decay: sprite.decay,   // how long the sprite will be alive
      velocity: sprite.velocity,  // the veloocity of the sprite
      size: sprite.size,     // how big to render the sprite
      color: sprite.color,
      speed: sprite.speed,
    }
  }



  function update(elapsedTime) {
    for (let idx in sprites) {
      let particle = sprites[idx];
      particle.lifetime += elapsedTime;
      particle.rotation = magic.computeRotation(particle.velocity);
      particle.center.x += particle.velocity.x * particle.speed * elapsedTime;
      particle.center.y += particle.velocity.y * particle.speed * elapsedTime;
      if (particle.lifetime > particle.decay) {
        delete sprites[particle.id];
      }
    }
  }

  function render() {
    for (let idx in sprites) {
      let particle = sprites[idx];
      graphics.drawRectangle({ center: particle.center, size: particle.size, rotation: particle.rotation }, particle.color, particle.color);
    }
  }

  function makeBoom(pos, amount, colors) {
    for (let i = 0; i < amount; i++) {
      let vel = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
      let size = { x: Math.random() * 4 + 2, y: Math.random() * 4 + 2 }
      let color = colors[Math.floor(Math.random() * colors.length)]
      addSprite({
        center: JSON.parse(JSON.stringify(pos)),
        velocity: vel,
        speed: (Math.random() * 50 + 50) / 1000,
        decay: Math.random() * 800 + 200, //time in ms
        color: color,
        size: size,
      });
    }
  }

  function ring(pos, radius, amount, colors) {
    for (let i = 0; i < (amount * radius); i++) {
      let vel = magic.computeFromRot((Math.random() * 360) * Math.PI / 180);
      let size = { x: Math.random() * 4 + 2, y: Math.random() * 4 + 2 }
      let color = colors[Math.floor(Math.random() * colors.length)]
      addSprite({
        center: JSON.parse(JSON.stringify(pos)),
        velocity: vel,
        speed: (Math.random() * 50 + 50) / 1000 * radius,
        decay: Math.random() * 800 + 200, //time in ms
        color: color,
        size: size,
      });
    }
  }

  let arcLength = Math.PI / 8;
  function trail(pos, amount, colors, velocity) {
    let rot = magic.computeRotation({ x: -velocity.x, y: -velocity.y })
    for (let i = 0; i < amount; i++) {
      let vel = magic.computeFromRot(rot + Math.random() * arcLength - arcLength / 2);
      let center = { x: pos.x + vel.x * magic.CELL_SIZE * .4, y: pos.y + vel.y * magic.CELL_SIZE * .4 };
      let size = { x: Math.random() * 4 + 2, y: Math.random() * 4 + 2 }
      let color = colors[Math.floor(Math.random() * colors.length)]
      addSprite({
        center: center,
        velocity: vel,
        speed: (Math.random() * 50 + 50) / 1000,
        decay: Math.random() * 400, //time in ms
        color: color,
        size: size,
      });
    }
  }  

  function makeExplosion(pos, pallet) {
    makeBoom(pos, 150, pallet)
  }

  function makeRing(pos, radius, pallet) {
    ring(pos, radius, 150, pallet)
  }

  function makeTrail(pos, vel, pallet, amount) {
    trail(pos, amount, pallet, vel);
  }

  let api = {
    addSprite: addSprite,
    update: update,
    render: render,
    makeExplosion: makeExplosion,
    makeRing: makeRing,
    makeTrail: makeTrail,
  };

  return api;
}
