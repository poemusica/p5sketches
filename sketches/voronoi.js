// Fortune's algorithm for constructing voronoi diagram.
// http://www.ams.org/samplings/feature-column/fcarc-voronoi
var sketch = function (p) {
    var sites = [],
        parabolaPts = [],
        sweep;

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
        for(var i = 0; i < sites.length; i++) {
            var site = sites[i];
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
                midpt(site);
            }
            // site
            p.stroke(255);
            p.strokeWeight(8);
            p.point(site.x, site.y);
        }
        // beach line
        p.strokeWeight(1);
        p.stroke(255, 255, 0);
        p.beginShape();
        beachLine();
        p.endShape();
        // sweep line
        p.stroke(255);
        p.strokeWeight(5);
        p.line(0, sweep, p.width, sweep);
        if (sweep < p.height) { sweep++; }
    }

    p.windowResized = function () {
        // p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    function midpt(site) {
        var diff = (sweep - site.y)/2;
        p.point(site.x, sweep - diff);
    }

    function parabola(site) {
        var x = 0;
        while (x < p.width) {
            var y = (p.sq(x - site.x) + p.sq(site.y) - p.sq(sweep)) / (2 * (site.y - sweep)) ;
            p.curveVertex(x, y);
            x += 5;
            parabolaPts.push(p.createVector(x, y));
        }
    }

    function beachLine() {
        var x = 0;
        while (x < p.width) {
            var maxY = 0,
                match = false;
            for (var i = 0; i < parabolaPts.length; i++) {
                var point = parabolaPts[i];
                if (point.x == x) {
                    match = true;
                    if (point.y > maxY) { maxY = point.y; }
                }
            }
            if (match == true) { p.curveVertex(x - 5, maxY) };
            x += 1;
        }
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');