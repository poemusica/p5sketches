// References
//  *   Directrix-focus equation for parabola:
//      http://hotmath.com/hotmath_help/topics/finding-the-equation-of-a-parabola-given-focus-and-directrix.html
//  *   Intersection of two parabolas
//      http://zonalandeducation.com/mmts/intersections/intersectionOfTwoParabollas1/intersectionOfTwoParabolas1.htm

var sketch = function (p) {
    var foci = [],
        intersections = [],
        nextFoci = [],
        directrix,
        mouseStart,
        mouseEnd;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        directrix = 0;
        foci.push(p.createVector(0, p.height));
        foci.push(p.createVector(p.width, p.height));
        intersect(foci[0], foci[1]);
    };

    p.draw = function () {
        var vertex;
        p.background(0);
        // Draw foci and parabolas.
        for (var i = 0; i < foci.length; i++) {
            var vertex,
                focus = foci[i];
            // Draw parabola.
            p.noFill();
            p.stroke(255, 0, 255);
            p.strokeWeight(2);
            drawArc(focus);
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
        for (var i = 0; i < intersections.length; i++) {
            var point = intersections[i];
            p.stroke(255, 255, 0);
            p.strokeWeight(5);
            p.point(point.x, point.y);
        }
        // Draw directrix.
        p.stroke(255);
        p.strokeWeight(1);
        p.line(0, directrix, p.width, directrix);
    };

    function intersect(focus, gfocus) {
        // Check for intersections with other parabolas.
        // Standard form variables.
        var fdenom = 2 * (focus.y - directrix),
            fa = 1 / fdenom,
            fb = -(2 * focus.x) / fdenom,
            fc = p.sq(focus.x)/fdenom + p.sq(focus.y)/fdenom - p.sq(directrix)/fdenom,
            // Other parabola's standard form variables.
            gdenom = 2 * (gfocus.y - directrix),
            ga = 1 / gdenom,
            gb = -(2 * gfocus.x) / gdenom,
            gc = p.sq(gfocus.x)/gdenom + p.sq(gfocus.y)/gdenom - p.sq(directrix)/gdenom,
            // Variables for quadradic formula.
            a = fa - ga,
            b = fb - gb,
            c = fc - gc,
            discriminant = p.sq(b) - 4 * a * c;
        // If a is zero, special case.
        // If discriminant is zero, there is one intersection.
        // If discriminant is positive, there are two intersections.
        // If discriminant is negative, there are no intersections.
        p.stroke(255, 255, 0);
        p.strokeWeight(8);
        if (a === 0) {
            var x1 = p.width/2;
                y1 = fa * p.sq(x1) + fb * x1 + fc,
                v1 = p.createVector(x1, y1);
            intersections.push(v1);
            nextFoci.push(v1);
        }
        else if (discriminant === 0) {
            var x1 = -b / (2 * fa),
                y1 = a * p.sq(x1) + fb * x1 + fc,
                v1 = p.createVector(x1, y1);
            intersections.push(v1);
            nextFoci.push(v1);
        } else if (discriminant > 0) {
            var x1 = (-b + p.sqrt(discriminant)) / (2 * a),
                x2 = (-b - p.sqrt(discriminant)) / (2 * a),
                y1 = fa * p.sq(x1) + fb * x1 + fc,
                y2 = fa * p.sq(x2) + fb * x2 + fc,
                v1 = p.createVector(x1, y1),
                v2 = p.createVector(x2, y2);
            intersections.push(v1);
            intersections.push(v2);
            nextFoci.push(v1);
            nextFoci.push(v2);
        }
    }

    function drawArc(focus) {
        var x = 0;
        p.beginShape();
        while (x <= p.width) {
            var y = (p.sq(x - focus.x) + p.sq(focus.y) - p.sq(directrix)) / (2 * (focus.y - directrix));
            // Draw parabola point sample.
            p.curveVertex(x, y);
            // Sample in increments of 5px.
            x += 5;
        }
        p.endShape();
    }

    // Workaround for p5 mouseDragged bug.
    p.mouseClicked = function() {
        var next = nextFoci.slice(0);
        console.log(next);
        nextFoci = [];
        for (var i = 0; i < next.length; i++) {
            var f = next[i]
            foci.push(f);
            for (var j = 0; j < foci.length; j++) {
                intersect(f, foci[j]);
            }
        }
        console.log(nextFoci, foci);
    };

}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');