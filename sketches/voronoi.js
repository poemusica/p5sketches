// Fortune's algorithm for constructing voronoi diagram.
// http://www.ams.org/samplings/feature-column/fcarc-voronoi
var sketch = function (p) {
    var sites = [],
        parabolaPts = [],
        beachPts = [],
        vertices = [],
        arcPairs = {},
        sweep,
        looping = true;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (var i = 0; i < 10; i++) {
            var site = p.createVector(Math.floor(Math.random() * p.width), Math.floor(Math.random() * p.height));
            sites.push(site);
        }
        sweep = 0;
    }

    p.draw = function () {
        p.background(0);
        parabolaPts = [];
        beachPts = [];
        for(var i = 0; i < sites.length; i++) {
            var site = sites[i];
            // site event
            if (site.y == sweep) {

            }
            if (site.y < sweep) {
                // site-to-sweep line
                p.stroke(175);
                p.strokeWeight(1);
                p.line(site.x, site.y, site.x, sweep);
                // parabola
                p.stroke(255, 0, 0);
                p.strokeWeight(2);
                p.noFill();
                p.beginShape();
                parabola(site);
                p.endShape();
                // midpoint from site to sweep
                p.stroke(0, 255, 255);
                p.strokeWeight(8);
                p.point(site.x, sweep - (sweep - site.y)/2);
            }
            // site
            p.stroke(255, 0, 255);
            p.strokeWeight(8);
            p.point(site.x, site.y);
        }
        // beach line
        p.stroke(255, 255, 0);
        p.strokeWeight(1);
        p.beginShape();
        beachLine();
        p.endShape();
        // vertices
        findVertexes();
        p.strokeWeight(8);
        p.stroke(0, 255, 0);
        for (var key in arcPairs) {
            if (arcPairs.hasOwnProperty(key)) {
                var value = arcPairs[key];
                p.point(value.start.x, value.start.y);
                if (value.end) {
                    p.point(value.end.x, value.end.y);
                    p.line(value.start.x, value.start.y, value.end.x, value.end.y);
                }
            }
        }
        // sweep line
        p.stroke(255);
        p.strokeWeight(5);
        p.line(0, sweep, p.width, sweep);
        if (sweep < p.height + 1000) { sweep++; }
        else { p.noLoop(); }
    }

    p.windowResized = function () {
        // p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.mouseClicked = function() {
        if (looping) { p.noLoop(); looping = false; }
        else { p.loop(); looping = true; }
    }

    function parabola(site) {
        var x = 0;
        while (x < p.width) {
            var y = (p.sq(x - site.x) + p.sq(site.y) - p.sq(sweep)) / (2 * (site.y - sweep)),
                vertex = p.createVector(x, y);
            p.curveVertex(x, y);
            x += 5;
            // read only!
            vertex.site = site;
            parabolaPts.push(vertex);
        }
    }

    function beachLine() {
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
                beachPts.push(winner);
            };
            x += 1;
        }
    }

    function findVertexes() {
        if (beachPts.length > 2) {
            for (var i = 0; i < beachPts.length - 2; i++) {
                var left = beachPts[i],
                    mid = beachPts[i + 1],
                    right = beachPts[i + 2];
                if (left.site && mid.site) {
                    var key1 = 'p' + left.site.x + left.site.y + mid.site.x + mid.site.y,
                        key2 = 'p' + mid.site.x + mid.site.y + left.site.x + left.site.y;
                    if (!mid.site.equals(left.site) && !arcPairs.hasOwnProperty(key1) && !arcPairs.hasOwnProperty(key2)) {
                        arcPairs[key1] = {start: left, end: null};
                    } else if (!mid.site.equals(left.site)) {
                        if (arcPairs.hasOwnProperty(key1)) { arcPairs[key1].end = mid; }
                        else if (arcPairs.hasOwnProperty(key2)) { arcPairs[key2].end = mid; }
                    }
                    if (right.site && !mid.site.equals(left.site) && !mid.site.equals(right.site)) {
                        if (arcPairs.hasOwnProperty(key1)) { arcPairs[key1].end = left; }
                        else if (arcPairs.hasOwnProperty(key2)) { arcPairs[key2].end = left; }
                    }
                }
            }
            var left = beachPts[beachPts.length - 2],
                mid = beachPts[beachPts.length - 1];
            if (left.site && mid.site) {
                var key1 = 'p' + left.site.x + left.site.y + mid.site.x + mid.site.y,
                    key2 = 'p' + mid.site.x + mid.site.y + left.site.x + left.site.y;
                if (!mid.site.equals(left.site) && !arcPairs.hasOwnProperty(key1) && !arcPairs.hasOwnProperty(key2)) {
                    arcPairs[key1] = {start: left, end: null};
                } else if (!mid.site.equals(left.site)) {
                    if (arcPairs.hasOwnProperty(key1)) { arcPairs[key1].end = mid; }
                    else if (arcPairs.hasOwnProperty(key2)) { arcPairs[key2].end = mid; }
                }
            }
        }
    }

    // function edgePt() {
    //     if (beachPts.length > 1) {
    //         for (var i = 0; i < beachPts.length - 1; i++) {
    //             var a = beachPts[i],
    //                 b = beachPts[i + 1];
    //             if (a.site && b.site && !a.site.equals(b.site)) {
    //                 var c = p5.Vector.lerp(a, b, 0.5),
    //                     m = p5.Vector.lerp(a.site, b.site, 0.5),
    //                     // slope of edge
    //                     slope = -1/((a.site.y - b.site.y) / (a.site.x - b.site.x)),
    //                     // y intercept of edge
    //                     b = m.y - (slope * m.x),
    //                     // x intercept of edge
    //                     intercept = p.createVector(-b / slope, 0);
    //                 // edges.push(c);
    //             }
    //         }
    //     }
    // }

}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');