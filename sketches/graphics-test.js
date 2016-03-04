var sketch = function (p) {
    var graphic;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        graphic = p.createGraphics(p.width, p.height);
        graphic.fill(0);
        graphic.rect(0, 0, graphic.width, graphic.height);
    };

    p.draw = function () {
        p.image(graphic, 0, 0, graphic.width, graphic.height, 0, 0, p.width, p.height);
        p.fill(255, 0, 0);
        p.stroke(255, 0, 0);
        p.ellipse(p.width/2, p.height/2, 50, 50);

        p.text(p.frameCount, 12, 12);
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');