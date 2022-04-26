MyGame.objects.Cursor = function (assets, graphics, magic) {
    'use strict';

    let cursor = {
        center: { x: 0, y: 0 },
        hitbox: { xmin: 0, xmax: 0, ymin: 0, ymax: 0 },
        state: "clear" // The state that the cursor should be rendered Clear: no building blocking, Blocked: something in the way, Off: don't show
    };
    let tower = null;


    function render() {
        let fillStyle = "rgba(0, 0, 0, 0)"
        let strokeStyle = "rgba(0, 0, 0, 0)"
        let radFill = "rgba(255, 255, 255, .25)";
        switch (cursor.state) {
            case "clear":
                fillStyle = "rgba(12, 170, 7, .5)"
                radFill = "rgba(0, 25, 0, .25)"
                strokeStyle = "rgba(0, 0, 0, 1)"
                break;
            case "blocked":
                radFill = "rgba(255, 0, 0, .25)"
                fillStyle = "rgba(255, 0, 0, .5)"
                strokeStyle = "rgba(0, 0, 0, 1)"
                break;
        }
        if (tower != null) {
            graphics.drawEllipse({ center: cursor.center, radius: tower.radius * magic.CELL_SIZE }, radFill, "black");
            tower.renderPreview(tower, cursor.center, 0, 3, { x: magic.CELL_SIZE, y: magic.CELL_SIZE });
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
        magic.sethitbox(cursor, { x: magic.CELL_SIZE, y: magic.CELL_SIZE })

    }

    function setCursor(point) {
        cursor.center = point;
    }

    function isClear() {
        return (cursor.state == "clear");
    }

    function blocked() {
        cursor.state = "blocked";
    }

    function hideCursor() {
        cursor.center = { x: -500, y: -500 }
    }

    function setPreview(newTower) {
        tower = newTower;
    }

    function loadCursor() {
        tower = null
    }

    let api = {
        update: update,
        render: render,
        setCursor: setCursor,
        isClear: isClear,
        blocked: blocked,
        hideCursor: hideCursor,
        setPreview: setPreview,
        loadCursor: loadCursor,
        get cursor() { return cursor },
        get tower() { return tower },
    };

    return api;
}