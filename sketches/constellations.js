////////////////////////////////////////////////////////////////////////////////
// REFERENCES
// *    Spatial hash
//      http://www.gamedev.net/page/resources/_/technical/game-programming/spatial-hashing-r2697
////////////////////////////////////////////////////////////////////////////////
// CONSTELLATIONS LOGIC
var sketch = function (p) {
    var
        title = "constellations",
        locations = [],
        velocities = [],
        cellSize = 75,
        hashTable = {},
        neigborhood = [{x: 0, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}],
        body,
        apiCall,
        apiSrcColour,
        apiSrcColr,
        config = {
            alpha: 100,
            bg: null,
            colors: [p.color(0)],
            maxPoints: 500,
            minDist: 75
        };
    ////////////////////////////////////////////////////////////////////////////
    // Sets up sketch.
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.RGB);
        p.frameRate(60);
        config.bg = p.color(255, config.alpha);
        for (var i = 0; i < p.constrain(Math.floor(p.max(p.windowWidth, p.windowHeight)/4), 0, config.maxPoints); i++) {
            var v = p.createVector(Math.random() * p.windowWidth, Math.random() * p.windowHeight);
            v.color = config.colors[0];
            locations.push(v);
            velocities.push(p5.Vector.random2D().setMag(p.constrain(Math.random() * 4, 0.5, 4)));
        }
        console.log('points:', locations.length);
        console.log('w x h:', Math.floor(p.width/cellSize) + 1, Math.floor(p.height/cellSize) + 1);
        body = document.getElementsByTagName('body')[0];
        apiSrcColour = 'http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=sketch.parseColours';
        apiSrcColr = 'http://www.colr.org/json/scheme/random?callback=sketch.parseColrs';
    };
    ////////////////////////////////////////////////////////////////////////////
    // Draws.
    p.draw = function () {
        p.background(config.bg);
        // Update and display points.
        update();
        // Display connections.
        // Check each cell in  the grid.
        for (var y = 0; y < Math.floor(p.height/cellSize) + 1; y++) {
            if (hashTable[y] === undefined) { continue; }
            for (var x = 0; x < Math.floor(p.width/cellSize) + 1; x++) {
                var bucket = hashTable[y][x];
                if (bucket === undefined) { continue; }
                // If the cell exists, examine each object in it.
                for (var i = 0; i < bucket.length; i++) {
                    var loc = bucket[i],
                        connections = 0;
                    // Check against others within the cell and its neighboring cells (SW, S, SE, E).
                    for (var n = 0; n < neigborhood.length; n++) {
                        var block = neigborhood[n],
                            others;
                        if (hashTable[y + block.y] === undefined || hashTable[y + block.y][x + block.x] === undefined) { continue; }
                        others = hashTable[y + block.y][x + block.x];
                        // If the neighboring cell exists, check the current object against all others in it.
                        for (var j = 0; j < others.length; j++) {
                            var neighbor = others[j],
                                d = p5.Vector.dist(loc, neighbor);
                            // If the object and its neighbor are within a minimum distance, draw their connection.
                            if (d < config.minDist && d > 0) {
                                var c = loc.color;
                                connections++;
                                // Nice effects, but too expensive.
                                // p.stroke(p.red(c), p.green(c), p.blue(c), p.lerp(127, 0, d/config.minDist));
                                // p.strokeWeight(p.lerp(4, 0.5, d/config.minDist));
                                p.stroke(c);
                                p.strokeWeight(1);
                                p.line(loc.x, loc.y, neighbor.x, neighbor.y);
                            }
                        }
                    }
                    // Draw point if it connects to at least one other point.
                    if (connections > 0) {
                        p.stroke(loc.color);
                        p.strokeWeight(4);
                        p.point(loc.x, loc.y);
                    }
                }
            }
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    // Window resizing logic
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        var target = p.min(Math.floor(p.max(p.width, p.height)/4), config.maxPoints);
        if (locations.length < target) {
            while (locations.length < target) {
                var v = p.createVector(Math.random() * p.windowWidth, Math.random() * p.windowHeight);
                v.color = config.colors[Math.floor(Math.random() * config.colors.length)];
                locations.push(v);
                velocities.push(p5.Vector.random2D().setMag(p.constrain(Math.random() * 4, 0.5, 4)));
            }
        } else if (locations.length > target) {
            while (locations.length > target) {
                locations.pop();
                velocities.pop();
            }
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    // Updates locations.
    function update() {
        // Clear hash table.
        hashTable = {};
        // Update locations and draw points.
        for (var i = 0; i < locations.length; i++) {
            var loc = locations[i],
                key;
            // Add velocity to location.
            locations[i] = loc.add(velocities[i]);
            // Screen wrap.
            if (loc.x > p.windowWidth) { loc.x = 0; }
            if (loc.x < 0) { loc.x = p.windowWidth; }
            if (loc.y > p.windowHeight) { loc.y = 0; }
            if (loc.y < 0) { loc.y = p.windowHeight; }
            // Put location into bucket.
            key = hash(loc);
            if (hashTable[key.y] === undefined) { hashTable[key.y] = {}; }
            if (hashTable[key.y][key.x] == undefined) { hashTable[key.y][key.x] = []; }
            hashTable[key.y][key.x].push(loc);
        }
    }
    ///////////////////////////////////////////////////////////////////////////
    // Assigns coords to bucket.
    function hash(point) {
        return {x: Math.floor(point.x/cellSize), y: Math.floor(point.y/cellSize)};
    }
    ////////////////////////////////////////////////////////////////////////////
    // User input logic
    p.mouseClicked = function() {
        getColors();
    };
    ////////////////////////////////////////////////////////////////////////////
    // Retrieves data from colourlovers API.
    function getColors() {
        var oldCall = document.getElementById('color-script');
        if (oldCall) {
            oldCall.parentNode.removeChild(oldCall);
        }
        apiCall = document.createElement('script');
        apiCall.id = 'color-script';
        apiCall.src = apiSrcColour + '&' + (new Date().getTime());
        //apiCall.src = apiSrcColr  + '&' + (new Date().getTime());
        body.appendChild(apiCall);
    }
    ////////////////////////////////////////////////////////////////////////////
    // API Callbacks
    // Callback function for colourlovers API call.
    function parseColours(json) {
        if (json[0].colors.length > 2) {
            var bg = p.color('#' + json[0].colors[0]);
            config.colors = [];
            config.bg = p.color(p.red(bg), p.green(bg), p.blue(bg), config.alpha);

            for (var i = 1; i < json[0].colors.length; i++) {
                config.colors.push(p.color('#' + json[0].colors[i]));
            }
        }
        for (var i = 0; i < locations.length; i++) {
            locations[i].color = config.colors[Math.floor(Math.random() * config.colors.length)];
        }
    }
    // Callback function for colrs.org API call.
    function parseColrs(json) {
        var colors;
        if (json.schemes == []) { return; }
        colors = json.schemes[0].colors;
        if (colors.length > 1) {
            var bg = p.color('#' + colors[0]);
            config.colors = [];
            config.bg = p.color(p.red(bg), p.green(bg), p.blue(bg), config.alpha);

            for (var i = 1; i < colors.length; i++) {
                config.colors.push(p.color('#' + colors[i]));
            }
        }
        for (var i = 0; i < locations.length; i++) {
            locations[i].color = config.colors[Math.floor(Math.random() * config.colors.length)];
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    // Public API
    sketch.title = title;
    sketch.parseColours = parseColours;
    sketch.parseColrs = parseColrs;
}
// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');