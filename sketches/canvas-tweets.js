var sketch = function (p) {
    var button;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER);
        p.textAlign(p.CENTER);
        p.textFont("Helvetica");
        p.textSize(24);
        p.fill(255);
        button = p.createButton('save canvas');
        button.position(19, 19);
        button.mousePressed(saveCanvas);
    };

    p.draw = function () {
        p.background('#0BF577');
        p.text('hello!', p.width/2, p.height/2);
        p.noLoop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.loop();
    };

    function saveCanvas() {
        p.saveCanvas();
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');