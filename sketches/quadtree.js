var sketch = function (p) {
    var points = [],
        stack = [],
        root,
        center,
        depth,
        colors = [];

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER);
        // Select random colors
        getColors();
        // Populate points.
        for (var i = 0; i < 50; i++) {
            points.push(p.createVector(p.random(0, p.width), p.random(0, p.height)));
        }
        // Initialize and populate quadtree.
        root = quadtree(p.createVector(p.width/2, p.height/2));
        for (var i = 0; i < points.length; i++) {
            depth = 0;
            quadtreeInsert(points[i], root);
        }
    };

    p.draw = function () {
        quadtreeTraverse(root, 0);
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    function getColors() {
        colors = [];
        colors.push(p.createVector(p.random(0, 255), p.random(0, 255), p.random(0, 255)));
        colors.push(p.createVector(p.random(0, 255), p.random(0, 255), p.random(0, 255)));
    }

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

    function quadtreeTraverse(quad, deep) {
        deep++;
        // Base case 1: Quadtree has data.
        if (quad.data instanceof p5.Vector) {
            var amt = p.noise(quad.data.x, quad.data.y, p.frameCount/100),
                c = p5.Vector.lerp(colors[0], colors[1], amt);
            deep--;
            p.stroke(255);
            p.strokeWeight(1);
            p.fill(c.x, c.y, c.z);
            p.rect(quad.center.x, quad.center.y, 2 * (p.width/p.pow(2, deep + 1)), 2 * (p.height/p.pow(2, deep + 1)));
            p.stroke(0);
            p.strokeWeight(3);
            // p.point(quad.data.x, quad.data.y);
            return;
        }
        // Base case 2: Quadtree is empty.
        if (quad.data === false) {
            deep--;
            return;
        }
        // Recursive case
        quadtreeTraverse(quad.nw, deep);
        quadtreeTraverse(quad.sw, deep);
        quadtreeTraverse(quad.ne, deep);
        quadtreeTraverse(quad.se, deep);
    }

    function quadtreeInsert(point, quad) {
        depth++;
        // Case 1: Quadtree has no data (and therefore no children).
        if (quad.data === false) {
            var n = p.round(p.random(0, 1));
            // Store point in data slot.
            quad.data = point;
            depth--;
            p.stroke(255);
            p.fill(colors[n].x, colors[n].y, colors[n].z);
            p.rect(quad.center.x, quad.center.y, 2 * p.width/p.pow(2, depth + 1), 2 * p.height/p.pow(2, depth + 1));
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
            p.stroke(255);
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