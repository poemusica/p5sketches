// phyllotaxis code taken from: 
// https://bl.ocks.org/mbostock/b418a040bb28295e4a78581fe8e269d1

var sketch = function (p) {
    var size = 400,
        center,
        radius = 5,
        points = [];

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(0);
        center = new p5.Vector(size/2, size/2);
        for (var i = 0; i < 1600; i++) {
            points.push(phyllotaxis(radius)(i));
        }
    };

    p.draw = function () {
        p.background(0);
        p.noStroke();
        p.push();
        p.translate(p.width/2, p.height/2);
        drawBall();
        p.translate(-size/2, -size/2);
        drawPoints();
        drawLines();
        p.pop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    function drawBall() {
        p.fill(255, 25);
        p.ellipse(0, 0, size, size);
    }

    function drawPoints() {
        p.fill(145);
        for (var i = 0; i < points.length; i++) {
            p.ellipse(points[i].x, points[i].y, 3, 3);
        }
    }

    function drawLines() {
        var target, v, magSq, mag;
        p.stroke(145);
        for (var i = 0; i < points.length; i++) {
            v = p5.Vector.sub(points[i], center);
            magSq = v.magSq();
            mag = p.map(magSq, 0, size * size, 1, 100);
            // mag = 20;
            target = p5.Vector.sub(new p5.Vector(p.mouseX - p.width/2 + size/2, p.mouseY - p.height/2 + size/2), points[i]);
            target.setMag(mag);
            target.add(points[i]);
            p.line(points[i].x, points[i].y, target.x, target.y);
        }
    }

    function phyllotaxis(radius) {
        var theta = Math.PI * (3 - Math.sqrt(5));
        return function(i) {
            var r = radius * Math.sqrt(i),
                a = theta * i,
                x = size / 2 + r * Math.cos(a),
                y = size / 2 + r * Math.sin(a);
                return new p5.Vector(x, y);
        };
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');