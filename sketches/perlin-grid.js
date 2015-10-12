var sketch = function (s) {
    // Sketch globals
    var rows;
    var cols;
    var xmargin;
    var ymargin;
    var resolution = 40;
    var xstep = 0.2;
    var ystep = 0.2;
    var tstep = 0.1;
    var color_pairs = [];
    var color_index = 0;

    s.setup = function () {
        s.frameRate(60);
        init_dimensions();
        s.createCanvas(window.innerWidth, window.innerHeight);
        // Find good color pairs at http://www.colorhexa.com/
        color_pairs.push([s.color(208, 103, 5), s.color(250, 194, 39)]); // Gold
        color_pairs.push([s.color(5, 137, 181), s.color(2, 62, 82)]); // Night
        color_pairs.push([s.color(31, 2, 108), s.color(183, 52, 3)]); // Firelight
        color_pairs.push([s.color(0, 0, 0), s.color(133, 66, 3)]); // Wood
        color_pairs.push([s.color(13, 187, 251), s.color(187, 251, 13)]); // Life force
        color_pairs.push([s.color(0, 0, 255), s.color(255, 0, 0)]); // Red vs. Blue
        color_pairs.push([s.color(254,249,233), s.color(191,185,192)]); // 50 Shades
        color_pairs.push([s.color(255,255,212), s.color(243,121,132)]); // Peach Glow
        color_pairs.push([s.color(243,220,250), s.color(254,249,231)]); // Light Lavender

        // 233,220,228
        // 219,203,225
    };

    s.draw = function () {
        // s.background(255);
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var amt = s.noise(c * xstep, r * ystep, s.frameCount/5 * tstep)
                s.fill(s.lerpColor(color_pairs[color_index][0], color_pairs[color_index][1], amt));
                s.push();
                s.stroke(255, 20);
                s.translate(resolution * c + xmargin, resolution * r + ymargin);
                s.rect(-20, -20, 40, 40);
                s.pop();
           }
        }
    };

    s.windowResized = function () {
        s.resizeCanvas(window.innerWidth, window.innerHeight);
        init_dimensions();
    };

    s.keyPressed = function() {
        if (s.keyCode === s.ENTER) {
            s.fullscreen(true);
        }
        else if (s.keyCode === s.UP_ARROW) {
            color_index += 1;
            if (color_index > color_pairs.length - 1) { color_index = 0; }
        }
        else if (s.keyCode === s.DOWN_ARROW) {
            color_index -= 1;
            if (color_index < 0) { color_index = color_pairs.length - 1; }
        }
    };

    function init_dimensions() {
        rows = s.floor(window.innerHeight/resolution);
        cols = s.floor(window.innerWidth/resolution);
        xmargin = (window.innerWidth - (cols * resolution) + resolution) / 2;
        ymargin = (window.innerHeight - (rows * resolution) + resolution) / 2;
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');