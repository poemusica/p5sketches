var sketch = function (p) {

    var slider;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        slider = p.createSlider(0, 255, 100);
        slider.addClass('slide');
        slider.position(10, 10);
    };

    p.draw = function () {
        p.background(slider.value());
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');