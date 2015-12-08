var sketch = function (p) {
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

    p.setup = function () {
        p.frameRate(60);
        init_dimensions();
        p.createCanvas(window.innerWidth, window.innerHeight);
        // Find good color pairs at http://www.colorhexa.com/
        color_pairs.push([p.color(208, 103, 5), p.color(250, 194, 39)]); // Gold
        color_pairs.push([p.color(5, 137, 181), p.color(2, 62, 82)]); // Night
        color_pairs.push([p.color(31, 2, 108), p.color(183, 52, 3)]); // Firelight
        color_pairs.push([p.color(0, 0, 0), p.color(133, 66, 3)]); // Wood
        color_pairs.push([p.color(13, 187, 251), p.color(187, 251, 13)]); // Life force
        color_pairs.push([p.color(0, 0, 255), p.color(255, 0, 0)]); // Red vs. Blue
        color_pairs.push([p.color(254,249,233), p.color(191,185,192)]); // 50 Shades
        color_pairs.push([p.color(255,255,212), p.color(243,121,132)]); // Peach Glow
        color_pairs.push([p.color(243,220,250), p.color(254,249,231)]); // Light Lavender

        // 233,220,228
        // 219,203,225
    };

    p.draw = function () {
        // p.background(255);
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var amt = p.noise(c * xstep, r * ystep, p.frameCount/5 * tstep)
                p.fill(p.lerpColor(color_pairs[color_index][0], color_pairs[color_index][1], amt));
                p.push();
                p.stroke(255, 20);
                p.translate(resolution * c + xmargin, resolution * r + ymargin);
                p.rect(-20, -20, 40, 40);
                p.pop();
           }
        }
    };

    p.windowResized = function () {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        init_dimensions();
    };

    p.keyPressed = function() {
        if (p.keyCode === p.ENTER) {
            p.fullscreen(true);
        }
        else if (p.keyCode === p.UP_ARROW) {
            color_index += 1;
            if (color_index > color_pairs.length - 1) { color_index = 0; }
        }
        else if (p.keyCode === p.DOWN_ARROW) {
            color_index -= 1;
            if (color_index < 0) { color_index = color_pairs.length - 1; }
        }
    };

    function init_dimensions() {
        rows = p.floor(window.innerHeight/resolution);
        cols = p.floor(window.innerWidth/resolution);
        xmargin = (window.innerWidth - (cols * resolution) + resolution) / 2;
        ymargin = (window.innerHeight - (rows * resolution) + resolution) / 2;
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');