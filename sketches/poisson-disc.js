var sketch = function (p) {
    var dimensions = 2,
        minDist = 150,
        rejectLimit = 30,
        grid = [],
        cellSize = minDist / Math.sqrt(dimensions),
        queue = [],
        samples = [],
        sample, 
        colors = ['#FC0501', '#FE4164', '#161544', '#5B1341'];

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.ellipseMode(p.CENTER);
        grid = makeGrid();
        poisson();
    };

    p.draw = function () {
        p.background(255);
        p.fill(255);

        for (var i = 0; i < samples.length; i++) {
            p.fill(255);
            //p.ellipse(samples[i].x, samples[i].y, 50, 50);
            p.strokeWeight(4);
            p.stroke(255);
            flower(samples[i]);
        }
        p.noLoop();
    };


    function flower(point) {
        var r = 60,
            size = r/2,
            petals = 36,
            layers = 4,
            n = layers + 1,
            m = size,
            shift = p.createVector(0, 0);
            shift = p.createVector(p.random(0, layers), 0).rotate(p.random(0, p.TWO_PI));
        p.fill(colors[Math.floor(Math.random() * 4)]);
        while (layers > 0) {
            var spacing = p.TWO_PI/petals, 
                offset = p.random(0, p.TWO_PI);
            for (var i = 0; i < petals; i++) {
                var angle = spacing * i + offset;
                p.push();
                p.translate(point.x + shift.x, point.y + shift.y);
                p.rotate(angle);
                p.arc(r, 0, size * 4, size, -p.PI/2, p.PI/2, p.CHORD);
                //p.ellipse(r, 0, size * 2, size);
                p.pop();
            }
            shift.div(layers);
            petals = Math.floor(petals * 0.75);
            size -= 30/60 * (n - layers);
            r -= 60 * 0.1 * (n - layers);
            layers--;
        }

    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        grid = makeGrid();
        queue = [],
        samples = [],
        sample = null;
        poisson();
        p.loop();
    };

    function makeGrid() {
        var result = [];
        for (var col = 0; col < Math.ceil(p.width/cellSize); col++) {
            result.push([]);
            for (var row = 0; row < Math.ceil(p.height/cellSize); row++) {
                result[col].push(-1);
            }
        }
        return result;
    }

    function poisson() {
         if (!sample) {
            sample = {x: Math.random() * p.width, y: Math.random() * p.height};
        }
        samples.push(sample);
        var col = Math.floor(sample.x / cellSize),
            row = Math.floor(sample.y / cellSize);
        // Update grid and queue with the index of sample in samples.
        grid[col][row] = samples.length - 1;
        queue.push(samples.length - 1);
        while (queue.length) {
            var rejects = 0,
                i = Math.floor(Math.random() * queue.length),
                s = samples[queue[i]];
            while (rejects < rejectLimit) {
                var candidate = getCandidate(s),
                    accepted = validate(candidate);
                if (accepted) {
                    sample = candidate;
                    samples.push(sample);
                    var col = Math.floor(sample.x / cellSize),
                        row = Math.floor(sample.y / cellSize);
                    // Update grid and queue with the index of sample in samples.
                    grid[col][row] = samples.length - 1;
                    queue.push(samples.length - 1);
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
        var col = Math.floor(candidate.x / cellSize),
            row = Math.floor(candidate.y / cellSize),
            cLo = Math.max(col - 2, 0),
            rLo = Math.max(row - 2, 0),
            cHi = Math.min(col + 3, Math.ceil(p.width/cellSize)),
            rHi = Math.min(row + 3, Math.ceil(p.height/cellSize));
        for (var c = cLo; c < cHi; c++) {
            for (var r = rLo; r < rHi; r++) {
                var index = grid[c][r];
                if (index < 0) { continue; }
                var neighbor = samples[index],
                    dsq = Math.pow(candidate['x'] - neighbor['x'], 2) + Math.pow(candidate['y'] - neighbor['y'], 2);
                if (dsq < minDist * minDist) { return false; }
            }
        }
        return true;
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');