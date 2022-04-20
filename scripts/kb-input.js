MyGame.input.Keyboard = function () {
    let that = {
        keys: {},
        handlers: {},
        keyRelease:keyRelease
    };

    function keyPress(e) {
        
        if(!(e.key in that.keys)){
            
            that.keys[e.key] = true;
        }
        
    }

    function keyRelease(e) {
        
        delete that.keys[e.key];
    }

    that.update = function (elapsedTime) {
        //console.log(that.keys)
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (that.handlers[key]) {
                    
                    if(that.keys[key]){
                        that.handlers[key](elapsedTime);
                        that.keys[key] = false;
                    }
                }
            }
        }
    };

    that.register = function (key, handler) {
        that.handlers[key] = handler;
    };
    that.clear = function () {
        that.handlers= {};
    };

    window.addEventListener('keydown',  keyPress);
    window.addEventListener('keyup', keyRelease);

    return that;
};
