var sketch = function (p) {
    var peaks = [],
        anchors = [];

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        makeWall();
    }

    p.draw = function () {
        p.background(0);
        p.stroke(255);
        p.noFill();
        var prev = peaks[0];
        for (var i = 0; i < peaks.length; i++) {
            var v = peaks[i],
                top = anchors[i][0],
                bot = anchors[i][1];
            p.ellipse(v.x, v.y, 2, 2);
            p.line(prev.x, prev.y, v.x, v.y);
            p.fill(p.map(p.noise(i), 0, 1, 0, 255));
            p.triangle(top.x, top.y, v.x, v.y, bot.x, bot.y);
            // p.line(v.x, v.y, top.x, top.y);
            // p.line(v.x, v.y, bot.x, bot.y);
            prev = v;
        }
        p.line(prev.x, prev.y, 0, p.windowHeight + 100);
    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    function makeWall() {
        var offset = 100,
            noiseScale = 1,
            numpts = 50,
            x = 0,
            xstep = 0.05,
            ystep = p.windowHeight/numpts;
        for (var i = 0; i < numpts; i++) {
            var triangle = [],
                top, bot,
                n = p.noise((x + offset) * noiseScale),
                v = p.createVector(p.map(n, 0, 1, 0, p.windowWidth/2), ystep * i);
            peaks.push(v.copy());
            top = p.createVector(0, p.map(Math.random(), 0, 1, 0, v.y));
            bot = p.createVector(0, p.map(Math.random(), 0, 1, v.y, p.windowHeight + 100));
            anchors.push([top, bot]);
            x += xstep;
        }
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');