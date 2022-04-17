MyGame.objects.Cursor = function (assets, graphics, magic) {
    'use strict';

    let cursor = {
        center: { x: 0, y: 0 },
        state: "clear" // The state that the cursor should be rendered Clear: no building blocking, Blocked: something in the way, Off: don't show
    };


    function render() {
        let fillStyle = "rgba(0, 0, 0, 0)"
        let strokeStyle = "rgba(0, 0, 0, 0)"
        switch (cursor.state) {
            case "clear":
                fillStyle = "rgba(237, 230, 12, .5)"
                strokeStyle = "rgba(0, 0, 0, 1)"
                break;
            case "blocked":
                fillStyle = "rgba(255, 0, 0, .5)"
                strokeStyle = "rgba(0, 0, 0, 1)"
                break;
        }
        graphics.drawRectangle({ center: cursor.center, size: { x: magic.CELL_SIZE, y: magic.CELL_SIZE }, rotation: 0 }, fillStyle, strokeStyle)
    }

    function update(elapsedTime) {
        cursor.state = "clear"
    }

    function setCursor(point) {
        cursor.center = point
    }

    function isClear() {
        return (cursor.state == "clear")
    }

    function blocked() {
        cursor.state = "blocked";
    }

    let api = {
        update: update,
        render: render,
        setCursor: setCursor,
        isClear: isClear,
        blocked: blocked,
        get cursor() {return cursor},
    };

    return api;
}