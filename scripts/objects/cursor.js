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
        let coords = magic.converter.pixelToGrid(cursor.center);
        if (coords.x < 0 || coords.y < 0 || coords.x > magic.GRID_SIZE - 1 || coords.y > magic.GRID_SIZE - 1)
            hideCursor();

        if (coords.x == 0 || coords.y == 0 || coords.x == magic.GRID_SIZE - 1 || coords.y == magic.GRID_SIZE - 1)
            cursor.state = "blocked"
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

    function hideCursor() {
        cursor.center = {x: -500, y: -500}
    }

    let api = {
        update: update,
        render: render,
        setCursor: setCursor,
        isClear: isClear,
        blocked: blocked,
        hideCursor: hideCursor,
        get cursor() { return cursor },
    };

    return api;
}