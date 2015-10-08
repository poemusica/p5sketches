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
        var others = foci.slice();
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
            // Draw intersections of parabolas.
            if (foci.length > 1) {
                // standard form variables.
                var fdenom = 2 * (focus.y - directrix),
                    fa = 1 / fdenom,
                    fb = -(2 * focus.x) / fdenom,
                    fc = p.sq(focus.x)/fdenom + p.sq(focus.y)/fdenom - p.sq(directrix)/fdenom;
                // Remove current focus from list.
                others.splice(0, 1);
                // Check for intersections with other parabolas.
                for (var j = 0; j < others.length; j++) {
                    var gfocus = others[j],
                        // other parabola's standard form variables.
                        gdenom = 2 * (gfocus.y - directrix),
                        ga = 1 / gdenom,
                        gb = -(2 * gfocus.x) / gdenom,
                        gc = p.sq(gfocus.x)/gdenom + p.sq(gfocus.y)/gdenom - p.sq(directrix)/gdenom,
                        // variables for quadradic formula
                        a = fa - ga,
                        b = fb - gb,
                        c = fc - gc,
                        discriminant = p.sq(b) - 4 * a * c;
                    // If discriminant is zero, there is one intersection.
                    // If discriminant is positive, there are two intersections.
                    // If discriminant is negative, there are no intersections.
                    p.stroke(255, 255, 0);
                    p.strokeWeight(8);
                    if (discriminant === 0) {
                        var x1 = -b / (2 * fa),
                            y1 = a * p.sq(x1) + fb * x1 + fc;
                        p.point(x1, y1);
                    } else if (discriminant > 0) {
                        var x1 = (-b + p.sqrt(discriminant)) / (2 * a),
                            x2 = (-b - p.sqrt(discriminant)) / (2 * a),
                            y1 = fa * p.sq(x1) + fb * x1 + fc,
                            y2 = fa * p.sq(x2) + fb * x2 + fc;
                        p.point(x1, y1);
                        p.point(x2, y2);
                    }
                }
            }
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