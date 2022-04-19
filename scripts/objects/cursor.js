MyGame.objects.Cursor = function (assets, graphics, magic) {
    'use strict';

    let cursor = {
        center: { x: 0, y: 0 },
        state: "clear" // The state that the cursor should be rendered Clear: no building blocking, Blocked: something in the way, Off: don't show
    };
    let tower = null;


    function render() {
        let fillStyle = "rgba(0, 0, 0, 0)"
        let strokeStyle = "rgba(0, 0, 0, 0)"
        let radFill = "rgba(255, 255, 255, .25)";
        switch (cursor.state) {
            case "clear":
                fillStyle = "rgba(237, 230, 12, .5)"
                radFill = "rgba(255, 255, 255, .25)"
                strokeStyle = "rgba(0, 0, 0, 1)"
                break;
            case "blocked":
                radFill = "rgba(255, 0, 0, .25)"
                fillStyle = "rgba(255, 0, 0, .5)"
                strokeStyle = "rgba(0, 0, 0, 1)"
                break;
        }
        if (tower != null) {
            graphics.drawEllipse({ center: cursor.center, radius: tower.radius }, radFill, "black")
            graphics.drawTexture(tower.preview, cursor.center, 0, { x: magic.CELL_SIZE, y: magic.CELL_SIZE })
        }
        graphics.drawRectangle({ center: cursor.center, size: { x: magic.CELL_SIZE, y: magic.CELL_SIZE }, rotation: 0 }, fillStyle, strokeStyle);

    }

    function update(elapsedTime) {
        cursor.state = "clear"
        let coords = magic.pixelToGrid(cursor.center);
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

    function blocked(status) {
        if (status)
            cursor.state = "blocked";

    }

    function hideCursor() {
        cursor.center = { x: -500, y: -500 }
    }

    function setPreview(newTower) {
        tower = newTower;
    }

    let api = {
        update: update,
        render: render,
        setCursor: setCursor,
        isClear: isClear,
        blocked: blocked,
        hideCursor: hideCursor,
        setPreview: setPreview,
        get cursor() { return cursor },
        get tower() { return tower },
    };

    return api;
}