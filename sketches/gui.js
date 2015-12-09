
var sketch = function (p) {

    // Sketch globals
    var rows, cols,
        xmargin, ymargin,
        resolution = 40,
        xstep = 0.2, ystep = 0.2, tstep = 0.1,
        data = {
            color0: '#000000',
            color1: '#FFFFFF'
        },
        gui;

    p.setup = function () {
        init_dimensions();
        p.createCanvas(window.innerWidth, window.innerHeight);
        gui = new dat.GUI( { autoPlace: false } );
        var guiElt = gui.domElement;
        document.getElementById('p5-sketch').appendChild(guiElt);
        guiElt.style.position = 'fixed';
        guiElt.style.left = '0px';
        guiElt.style.top = '0px';
        gui.addColor(data, 'color0');
        gui.addColor(data, 'color1');

    };

    p.draw = function () {
        var c0 = p.color(data.color0),
            c1 = p.color(data.color1);
        // p.background(255);
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var amt = p.noise(c * xstep, r * ystep, p.frameCount/5 * tstep)
                p.fill(p.lerpColor(c0, c1, amt));
                p.push();
                p.stroke(255, 20);
                p.translate(resolution * c + xmargin, resolution * r + ymargin);
                p.rect(-20, -20, 40, 40);
                p.pop();
           }
        }
    };

    p.mouseClicked = function() {
        console.log(data.color0, data.color1);
    };

    p.windowResized = function () {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        init_dimensions();
    };

    function init_dimensions() {
        rows = p.floor(window.innerHeight/resolution);
        cols = p.floor(window.innerWidth/resolution);
        xmargin = (window.innerWidth - (cols * resolution) + resolution) / 2;
        ymargin = (window.innerHeight - (rows * resolution) + resolution) / 2;
    }
}

window.onload = function() {
    // Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
    var p5sketch = new p5(sketch, 'p5-sketch');
};
