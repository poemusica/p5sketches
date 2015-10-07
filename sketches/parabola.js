// References
//  *   Directrix-focus equation for parabola:
//      http://hotmath.com/hotmath_help/topics/finding-the-equation-of-a-parabola-given-focus-and-directrix.html

var sketch = function (p) {
    var foci = [],
        directrix,
        dragged = false;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        directrix = 0;
    }

    p.draw = function () {
        p.background(0);
        // Draw foci and parabolas.
        for (var i = 0; i < foci.length; i++) {
            var vertex,
                focus = foci[i],
                x = 0;
            // Draw parabola.
            p.noFill();
            p.stroke(255, 0, 255);
            p.strokeWeight(2);
            p.beginShape();
            while (x < p.width) {
                var y = (p.sq(x - focus.x) + p.sq(focus.y) - p.sq(directrix)) / (2 * (focus.y - directrix));
                // Draw parabola point sample.
                p.curveVertex(x, y);
                // Sample in increments of 5px.
                x += 5;
            }
            p.endShape();
            // Draw focus-vertex line.
            vertex = p.createVector(focus.x, directrix - (directrix - focus.y)/2);
            p.stroke(255, 0, 255);
            p.strokeWeight(1);
            p.line(focus.x, focus.y, vertex.x, vertex.y);
            // Draw vertex.
            p.stroke(255, 0, 255);
            p.strokeWeight(5);
            p.point(vertex.x, vertex.y);
            // Draw focus.
            p.stroke(255, 0, 255);
            p.strokeWeight(5);
            p.point(focus.x, focus.y);
        }
        // Draw directrix.
        p.stroke(255);
        p.strokeWeight(1);
        p.line(0, directrix, p.width, directrix);
    }

    p.mouseDragged = function() {
        directrix = p.mouseY;
        dragged = true;
        // prevent default
        return false;
    }

    p.mouseClicked = function() {
        if (!dragged) {
            foci.push(p.createVector(p.mouseX, p.mouseY));
        }
        dragged = false;
        // prevent default
        return false;
    }

}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');