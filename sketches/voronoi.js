// References
// *    Fortune's algorithm for constructing voronoi diagram.
//      *   http://www.ams.org/samplings/feature-column/fcarc-voronoi
//      *   http://www.skynet.ie/~sos/mapviewer/docs/Voronoi_Diagram_Notes_1.pdf
//      *   http://www.cs.sfu.ca/~binay/813.2011/Fortune.pdf
//      *   http://nms.lcs.mit.edu/~aklmiu/6.838/L7.pdf

var sketch = function (p) {
    var foci = [],
        directrix,
        sites = [],
        // For visualizing beach line only.
        parabolaPts = [],
        // For playing/pausing animation.
        looping = true;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (var i = 0; i < 10; i++) {
            foci.push(p.createVector(Math.floor(Math.random()* p.width), Math.floor(Math.random() * p.height)));
        }
        // Sort foci by y value low to high.
        foci.sort(function(a, b) { return a.y - b.y });
        directrix = 0;
    };

    p.draw = function () {
        p.background(0);
        parabolaPts = [];
        // Add or remove sites. Draw foci.
        for (var i = 0; i < foci.length; i++) {
            var focus = foci[i];
            // Site event.
            // Add focus to list of sites.
            if (focus.y == directrix) {
                sites.push(focus);
            }
            //TODO: Remove sites.
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
            p.stroke(0, 255, 0);
            p.strokeWeight(5);
            p.point(focus.x, focus.y);
        }
        // Draw parabolas and intersections for sites.
        var others = sites.slice();
        for (var i = 0; i < sites.length; i++) {
            var vertex,
                focus = sites[i],
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
                parabolaPts.push(p.createVector(x, y));
                // Sample in increments of 5px.
                x += 5;
            }
            p.endShape();
            // Check for intersections with other parabolas.
            if (sites.length > 1) {
                // Standard form variables.
                var fdenom = 2 * (focus.y - directrix),
                    fa = 1 / fdenom,
                    fb = -(2 * focus.x) / fdenom,
                    fc = p.sq(focus.x)/fdenom + p.sq(focus.y)/fdenom - p.sq(directrix)/fdenom;
                // Remove current parabola's focus from others.
                others.splice(0, 1);
                // Check current parabola against each remaining parabola in others.
                for (var j = 0; j < others.length; j++) {
                    var gfocus = others[j],
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
                    // If discriminant is zero, there is one intersection.
                    // If discriminant is positive, there are two intersections.
                    // If discriminant is negative, there are no intersections.
                    p.stroke(255, 255, 0);
                    p.strokeWeight(8);
                    if (discriminant === 0) {
                        var x1 = -b / (2 * fa),
                            y1 = a * p.sq(x1) + fb * x1 + fc;
                        // Draw intersection point.
                        p.point(x1, y1);
                    } else if (discriminant > 0) {
                        var x1 = (-b + p.sqrt(discriminant)) / (2 * a),
                            x2 = (-b - p.sqrt(discriminant)) / (2 * a),
                            y1 = fa * p.sq(x1) + fb * x1 + fc,
                            y2 = fa * p.sq(x2) + fb * x2 + fc;
                        // Draw intersection points.
                        p.point(x1, y1);
                        p.point(x2, y2);
                    }
                }
            }
        }
        // Draw beach line. (Visual aid only.)
        beachLine();
        // Draw directrix.
        p.stroke(255);
        p.strokeWeight(1);
        p.line(0, directrix, p.width, directrix);
        // Increment directrix.
        // For visualization: Normally directrix can snap to next focus.
        if (directrix < p.height) {
            directrix++;
        }
    };

    function beachLine() {
        p.stroke(0, 255, 255);
        p.strokeWeight(1);
        p.beginShape();
        var x = 0;
        while (x < p.width) {
            var maxY = -1,
                match = false,
                winner = p.createVector(x, -1);
            for (var i = 0; i < parabolaPts.length; i++) {
                var point = parabolaPts[i];
                if (point.x == x) {
                    match = true;
                    if (point.y > maxY) {
                        maxY = point.y;
                        winner = point;
                    }
                }
            }
            if (match == true) {
                p.curveVertex(winner.x, winner.y);
            };
            x += 1;
        }
        p.endShape();
    }

    p.mouseClicked = function() {
        if (looping) { p.noLoop(); looping = false; }
        else { p.loop(); looping = true; }
    };

}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');