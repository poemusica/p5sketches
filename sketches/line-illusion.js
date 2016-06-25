// inspiration: https://s-media-cache-ak0.pinimg.com/236x/96/fa/93/96fa93baa8987d5edd6c35182200d3d8.jpg

var sketch = function (p) {
    var lines = []
        numLines = 100,
        numPoints = 25;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);

        p.noiseDetail(8, 0.5);

        var prev = [],
            margin = (p.width/numLines)/2;
        for (var i = 0; i < numLines; i++) {
            var line = [],
                yPrev = 0;
            for (var j = 0; j < numPoints; j++) {
                yPrev = prev[j] ? prev[j].y : 0;
                var xPrev = prev[j] ? prev[j].x : -10,
                    xBase = i * p.width/numLines,
                    xUpper = xPrev + 10,
                    xLower = xPrev,
                    x = p.map(p.noise(i , j), 0, 1, xLower, xUpper),
                    yUpper = yPrev + (p.height/numPoints),
                    yLower = yPrev,
                    y = p.map(p.noise(i, j), 0, 1, yLower, yUpper);
                    point = p.createVector(margin + x, j * (p.height/numPoints + 1));
                line.push(point);
                yPrev = y;
            }
            prev = line;
            lines.push(line);
        }
        console.log(lines);
    };

    p.draw = function () {
        p.background(255);
        p.noFill();
        p.stroke(0);
        for (var i = 0; i < lines.length; i++) {
            p.beginShape();
            for (var j = 0; j < lines[i].length; j++) {
                // i % 2 ? p.stroke(0) : p.stroke(255, 0, 0);
                p.vertex(lines[i][j].x, lines[i][j].y);
            }
            p.endShape();
        }
        p.noLoop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');