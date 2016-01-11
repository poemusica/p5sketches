var sketch = function (p) {
    var dimensions = 2,
        minDist = 10,
        rejectLimit = 30,
        grid = [],
        neigborhood = [{x: 0, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}],
        cellSize = minDist / Math.sqrt(dimensions),
        queue = [],
        sample;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        poisson();
    };

    p.draw = function () {
        p.background(0);
        p.strokeWeight(3);
        p.stroke(255);
        for (var i = 0; i < grid.length; i++) {
            p.point(grid[i].x, grid[i].y);
        }
        p.noLoop();
    };


    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        grid = [];
        queue = [];
        sample = undefined;
        poisson();
        p.loop();
    };

    function poisson() {
         if (!sample) {
            sample = {x: Math.random() * p.width, y: Math.random() * p.height};
        }
        grid.push(sample);
        queue.push(sample);
        while (queue.length) {
            var rejects = 0,
                i = Math.floor(Math.random() * queue.length),
                s = queue[i];
            while (rejects < rejectLimit) {
                var candidate = getCandidate(s),
                    accepted = validate(candidate);

                if (accepted) {
                    sample = candidate;
                    grid.push(candidate);
                    queue.push(candidate);
                    break;
                }
                rejects++;
            }
            if (rejects >= rejectLimit) { queue.splice(i, 1); }
        }
    }

    function getCandidate(s) {
        var angle = Math.random(0) * p.TWO_PI;
            x = s.x + p.random(minDist, 2 * minDist) * Math.cos(angle),
            y = s.y + p.random(minDist, 2 * minDist) * Math.sin(angle),
            candidate = {'x': x, 'y': y};
        return candidate;
    }

    function validate(candidate) {
        if (candidate.x > p.width || candidate.x < 0 || candidate.y > p.height || candidate.y < 0) { return false; }
        for (var i = 0; i < grid.length; i++) {
            var dsq = Math.pow(candidate['x'] - grid[i]['x'], 2) + Math.pow(candidate['y'] - grid[i]['y'], 2);
            if (dsq < minDist * minDist) { return false; }
        }
        return true;
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');