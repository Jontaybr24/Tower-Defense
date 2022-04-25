// --------------------------------------------------------------
//
// Renders an animated model based on a spritesheet.
//
// --------------------------------------------------------------
MyGame.render.AnimatedModel = function (spec, graphics) {
    'use strict';

    let animationTime = 0;
    
    let subImageIndex = {
        
        x: spec.subIndex.x,
        y: spec.subIndex.y,
    };

    

    //------------------------------------------------------------------
    //
    // Update the state of the animation
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        animationTime += elapsedTime;
        //
        // Check to see if we should update the animation frame
        if (animationTime >= spec.spriteTime) {
            //
            // When switching sprites, keep the leftover time because
            // it needs to be accounted for the next sprite animation frame.
            animationTime -= spec.spriteTime;
            nextSprite();
        }
    }

    function nextSprite() {
        /*
        subImageIndex.y++;
        if (subImageIndex.y >= spec.spriteCount.y + spec.subIndex.y)
            subImageIndex.y = spec.subIndex.y;
        if (subImageIndex.y == spec.subIndex.y) {
            subImageIndex.x++;
            if (subImageIndex.x >= spec.spriteCount.x + spec.subIndex.x)
                subImageIndex.x = spec.subIndex.x;
        }*/

        // When switching sprites, keep the leftover time because
            // it needs to be accounted for the next sprite animation frame.
            
            subImageIndex.x += 1;
            //
            // Wrap around from the last back to the first sprite as needed
            subImageIndex.x = subImageIndex.x % spec.spriteCount;
    }
    //------------------------------------------------------------------
    //
    // Render the specific sub-texture animation frame
    //
    //------------------------------------------------------------------
    function render(model) {
        
        graphics.drawSubTexture(spec.spriteSheet, { x: subImageIndex.x , y: model.suby  }, spec.subTextureWidth, model.center, model.rotation, model.subSize);
    }

    let api = {
        update: update,
        render: render,
        get xIndex() {return subImageIndex.x;}
    };

    return api;
};
