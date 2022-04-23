MyGame.graphics = (function () {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { x: , y: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x, size.y);

        context.restore();
        //drawRectangle({center:center, size:{x:10,y:10}}, "black","black");
    }

    function drawSubTexture(image, index, subTexture, center, rotation, size) {

        context.save();
        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);


        //
        // Pick the selected sprite from the sprite sheet to render
        //console.log(subTexture.x * index.x, subTexture.x * index.y)
        context.drawImage(
            image,
            subTexture.x * index.x, subTexture.x * index.y,      // Which sub-texture to pick out
            subTexture.x, subTexture.y,   // The size of the sub-texture
            center.x - size.y / 2,           // Where to draw the sub-texture
            center.y - size.y / 2,
            size.x, size.y);

        context.restore();
        //drawRectangle({center:center, size:{x:10,y:10}}, "black","black");
    }

    // --------------------------------------------------------------
    //
    // Draw a rectangle to the canvas with the following attributes:
    //      center: { x: , y: },
    //      size: { x: , y: },
    //      rotation:       // radians
    //
    // --------------------------------------------------------------
    function drawRectangle(rect, fillStyle, strokeStyle) {
        context.save();
        context.translate(rect.center.x, rect.center.y);
        context.rotate(rect.rotation);
        context.translate(-rect.center.x, -rect.center.y);

        context.fillStyle = fillStyle;
        context.fillRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);

        context.strokeStyle = strokeStyle;
        context.strokeRect(rect.center.x - rect.size.x / 2, rect.center.y - rect.size.y / 2, rect.size.x, rect.size.y);

        context.restore();
    }


    // --------------------------------------------------------------
    //
    // Draw a circle to the canvas with the following attributes:
    //      center: { x: , y: },
    //      radius:       // radians
    //
    // --------------------------------------------------------------
    function drawEllipse(ell, fillStyle, strokeStyle) {
        context.save();
        context.fillStyle = fillStyle;
        context.strokeStyle = strokeStyle;
        context.beginPath();
        context.arc(ell.center.x, ell.center.y, ell.radius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();

    }

    function drawLine(point1, point2, lineWidth, strokeStyle) {
        context.strokeStyle = strokeStyle;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(point1.x, point1.y);
        context.lineTo(point2.x, point2.y);
        context.stroke();
    }

    function drawText(text, position, fillStyle, font, centered, lineHeight) {
        text = String(text);
        if(lineHeight == undefined)
            lineHeight = 0;
        context.font = font;
        if (centered)
            context.textAlign = 'center';
        else
            context.textAlign = "left";
        context.fillStyle = fillStyle;
        let lines = text.split("\n");
        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], position.x, position.y + (i * lineHeight));

        }
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawLine: drawLine,
        drawText: drawText,
        drawTexture: drawTexture,
        drawEllipse: drawEllipse,
        drawRectangle: drawRectangle,
        drawSubTexture: drawSubTexture,
    };

    return api;
}());
