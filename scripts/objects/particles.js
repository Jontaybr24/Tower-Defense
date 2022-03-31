MyGame.objects.Particles = function (spec) {
    'use strict';
  
    let imageReady = false;
    let image = new Image();
  
    image.onload = function () {
      imageReady = true;
    };
    image.src = spec.imageSrc;
  
    let sprites = [];
    let colorIndex = { x: 0, y: 0 };
  
    function addSprite(pos) {
      sprites.push({
        center: pos,
        lifetime: 0,
        rotation: 0,
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
      get index() { return { x: spec.index.x + colorIndex.x, y: spec.index.y + colorIndex.y }; },
      get hitbox() { return spec.hitbox; },
      get subTexture() { return spec.subTexture; }
    };
  
    return api;
  }
  