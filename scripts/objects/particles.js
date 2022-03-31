MyGame.objects.Particles = function (spec) {
    'use strict';
  
    let imageReady = false;
    let image = new Image();
  
    image.onload = function () {
      imageReady = true;
    };
    image.src = spec.imageSrc;
  
    let sprites = [];
  
    function addSprite(sprite) {
      sprites.push({
        center: sprite.pos,
        lifetime: 0,
        decay: sprite.decay,
        rotation: sprite.rot,
        speed: sprite.speed,
        subSize: spec.subSize,
      })
    }
  
    function update(elapsedTime){
      for(let effect in sprites){
        sprites[effect].lifetime += elapsedTime;
        if(sprites[effect].lifetime > spec.decay){
          sprites.splice(effect, 1);
        }
      }
    }
  
    let api = {
      addSprite: addSprite,
      update: update,
      get imageReady() { return imageReady; },
      get sprites() { return sprites; },
      get image() { return image; },
      get hitbox() { return spec.hitbox; },
      get subTexture() { return spec.subTexture; }
    };
  
    return api;
  }
  