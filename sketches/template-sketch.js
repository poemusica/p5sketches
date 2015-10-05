var sketch = function (p) {

    // Preload assets using p5 *load functions.
    p.preload = function () {
    }

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = function () {
        p.background(0);
    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');