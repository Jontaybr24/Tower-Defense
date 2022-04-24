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

  function makeRing(pos, amount, colors) {
    for (let i = 0; i < amount; i++) {
      let x = Math.random() * 2 - 1;
      let sign = Math.sign(Math.random() - .5)
      let y = Math.sqrt(1 - x * x) * sign;
      let vel = { x: x, y: y };
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

  function makeTrail(pos, amount, colors, velocity) {
    for (let i = 0; i < amount; i++) {
      let x = -velocity.x + (Math.random() * .5) - .375; 
      let y = -velocity.y + (Math.random() * .5) - .375;
      let vel = {x: x, y: y};
      let size = { x: Math.random() * 4 + 2, y: Math.random() * 4 + 2 }
      let color = colors[Math.floor(Math.random() * colors.length)]
      addSprite({
        center: JSON.parse(JSON.stringify(pos)),
        velocity: vel,
        speed: (Math.random() * 50 + 50) / 1000,
        decay: Math.random() * 400, //time in ms
        color: color,
        size: size,
      });
    }
  }

  let firePallet = [
    "#c44910",
    "#ff5b0f",
    "#545454",
    "#ed7300",
    "#ff8c21"
  ];

  let smokePallet = [
    "#c44910",
    "#ff5b0f",
    "#545454",
    "#ff8c21",
    "#454545",
    "#38312b",
    "#1c1c1c"
  ];

  let icePallet = [
    "#0586ff",
    "#b0d9ff",
    "#5890c4",
    "#5cb0ff"
  ];

  let acidPallet = [
    "#0cfa00",
    "#079400",
    "#58db2c",
    "#53bf00"
  ]

  function makeExplosion(pos) {
    makeBoom(pos, 150, firePallet)
  }

  function makeAcidExplosion(pos) {
    makeBoom(pos, 150, acidPallet)
  }

  function makeFireRing(pos) {
    makeRing(pos, 150, firePallet)
  }

  function makeIceRing(pos) {
    makeRing(pos, 150, icePallet)
  }

  function makeAcidRing(pos) {
    makeRing(pos, 150, acidPallet)
  }

  function makeBoomTrail(pos, vel) {
    makeTrail(pos, 15, smokePallet, vel);
  }

  let api = {
    addSprite: addSprite,
    update: update,
    render: render,
    makeExplosion: makeExplosion,
    makeFireRing: makeFireRing,
    makeIceRing: makeIceRing,
    makeAcidRing: makeAcidRing,
    makeAcidExplosion: makeAcidExplosion,
    makeBoomTrail: makeBoomTrail,
  };

  return api;
}
