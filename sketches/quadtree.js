var sketch = function (p) {
    var points = [],
        stack = [],
        root,
        center,
        depth;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER);
        for (var i = 0; i < 100; i++) {
            points.push(p.createVector(p.random(0, p.width), p.random(0, p.height)));
        }
        root = quadtree(p.createVector(p.width/2, p.height/2));
    };

    p.draw = function () {
        p.background(0);
        for (var i = 0; i < points.length; i++) {
            depth = 0;
            quadtreeInsert(points[i], root);
        }
        p.stroke(255);
        p.strokeWeight(3);
        for (var i = 0; i < points.length; i++) {
            p.point(points[i].x, points[i].y);
        }
        p.noLoop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    function quadtree(loc) {
        return {
            data: false,
            center: loc,
            nw: null,
            sw: null,
            ne: null,
            se: null
        }
    }

    function quadtreeInsert(point, quad) {
        depth++;
        // Case 1: Quadtree has no data (and therefore no children).
        if (quad.data === false) {
            // Store point in data slot.
            quad.data = point;
            depth--;
            return;
        }
        // Case 2: Quadtree has only data (and therefore no children).
        if (quad.data instanceof p5.Vector) {
            var x = p.width/p.pow(2, depth + 1),
                y = p.height/p.pow(2, depth + 1);
            // Initialize sub-quadrants.
            quad.nw = quadtree(p.createVector(quad.center.x - x, quad.center.y - y));
            quad.sw = quadtree(p.createVector(quad.center.x - x, quad.center.y + y));
            quad.ne = quadtree(p.createVector(quad.center.x + x, quad.center.y - y));
            quad.se = quadtree(p.createVector(quad.center.x + x, quad.center.y + y));
            // Move existing data to sub-quadrant.
            if (quad.data.x < quad.center.x) {
                if (quad.data.y < quad.center.y) { quadtreeInsert(quad.data, quad.nw); }
                else { quadtreeInsert(quad.data, quad.sw); }
            }
            else if (quad.data.y < quad.center.y) {
                quadtreeInsert(quad.data, quad.ne);
            } else { quadtreeInsert(quad.data, quad.se); }
            // Reduce case 2 to case 3.
            quad.data = true;

            // Draw quadrants
            p.noFill();
            p.stroke(0, 255, 255);
            p.strokeWeight(1);
            // NW
            p.rect(quad.center.x - x, quad.center.y - y, 2 * x, 2 * y);
            // SW
            p.rect(quad.center.x - x, quad.center.y + y, 2 * x, 2 * y);
            // NE
           p.rect(quad.center.x + x, quad.center.y - y, 2 * x, 2 * y);
            // SE
            p.rect(quad.center.x + x, quad.center.y - y, 2 * x, 2 * y);
        }
        // Case 3: Quadtree already has children (instead of data).
        if (quad.data === true) {
            // Insert point into sub-quadrant.
            if (point.x < quad.center.x) {
                if (point.y < quad.center.y) { quadtreeInsert(point, quad.nw); }
                else { quadtreeInsert(point, quad.sw); }
            } else if (point.y < quad.center.y) {
                quadtreeInsert(point, quad.ne);
            } else { quadtreeInsert(point, quad.se); }
        }
    }


}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');