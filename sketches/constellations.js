////////////////////////////////////////////////////////////////////////////////
// CONSTELLATIONS LOGIC
var sketch = function (s) {
    var
        title = "constellations",
        locations = [],
        velocities = [],
        colors = [],
        body,
        apiCall,
        apiSrc,
        config = {
            bg: s.color(255),
            colors: [s.color(0)],
            maxPoints: 150,
            minDist: 75
        };
    ////////////////////////////////////////////////////////////////////////////
    // Sets up sketch.
    s.setup = function () {
        s.createCanvas(s.windowWidth, s.windowHeight);
        s.frameRate(60);
        for (var i = 0; i < s.constrain(Math.floor(s.max(s.windowWidth, s.windowHeight)/5), 0, config.maxPoints); i++) {
            locations.push(s.createVector(Math.random() * s.windowWidth, Math.random() * s.windowHeight));
            velocities.push(p5.Vector.random2D().setMag(s.constrain(Math.random() * 4, 0.5, 4)));
            colors.push(config.colors[0]);
        }
        body = document.getElementsByTagName('body')[0];
        apiSrc = 'http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=sketch.parseColors';
    };
    ////////////////////////////////////////////////////////////////////////////
    // Draws.
    s.draw = function () {
        var others = locations.slice();
        s.background(config.bg);
        // Update and display points.
        update();
        // Display connections. O(n!)
        // Loop through locations backwards.
        for (var i = locations.length - 1; i > -1; i--) {
            var n = locations[i];
            // Remove n from choices.
            others.pop();
            // Match n with remaining choices.
            for (var j = 0; j < others.length; j++) {
                var m = others[j],
                    d = p5.Vector.dist(n, m);
                if (d < config.minDist) {
                    var c = s.lerpColor(colors[i], colors[j], 0.5);
                    s.stroke(s.red(c), s.green(c), s.blue(c), s.lerp(255, 0, d/config.minDist));
                    s.line(n.x, n.y, m.x, m.y);
                }
            }
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    // Window resizing logic
    s.windowResized = function () {
        s.resizeCanvas(s.windowWidth, s.windowHeight);
        var target = s.min(Math.floor(s.max(s.width, s.height)/5), config.maxPoints);
        if (locations.length < target) {
            while (locations.length < target) {
                locations.push(s.createVector(Math.random() * s.windowWidth, Math.random() * s.windowHeight));
                velocities.push(p5.Vector.random2D().setMag(s.constrain(Math.random() * 4, 0.5, 4)));
                colors.push(config.colors[Math.floor(Math.random() * config.colors.length)]);
            }
        } else if (locations.length > target) {
            while (locations.length > target) {
                locations.pop();
                velocities.pop();
                colors.pop();
            }
        }
    };
    ////////////////////////////////////////////////////////////////////////////
    // Updates points.
    function update() {
        for (var i = 0; i < locations.length; i++) {
            var loc = locations[i];
            // Add velocity to location.
            locations[i] = loc.add(velocities[i]);
            // Screen wrap.
            if (loc.x > s.windowWidth) { loc.x = 0; }
            if (loc.x < 0) { loc.x = s.windowWidth; }
            if (loc.y > s.windowHeight) { loc.y = 0; }
            if (loc.y < 0) { loc.y = s.windowHeight; }
            // Display.
            s.push();
            s.translate(loc.x, loc.y);
            s.noStroke();
            s.fill(colors[i]);
            s.ellipse(0, 0, 3, 3);
            s.pop();
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    // User input logic
    s.mouseClicked = function() {
        getColors();
    };
    ////////////////////////////////////////////////////////////////////////////
    // Retrieves data from colourlovers API.
    function getColors() {
        var oldCall = document.getElementById('colour-lovers');
        if (oldCall) {
            oldCall.parentNode.removeChild(oldCall);
        }
        apiCall = document.createElement('script');
        apiCall.id = 'colour-lovers';
        apiCall.src = apiSrc + '&' + (new Date().getTime());
        body.appendChild(apiCall);
    }
    ////////////////////////////////////////////////////////////////////////////
    // Callback function for colourlovers API call.
    function parseColors(json) {
        if (json[0].colors.length > 2) {
            config.colors = [];
            config.bg = '#' + json[0].colors[0];
            for (var i = 1; i < json[0].colors.length; i++) {
                config.colors.push(s.color('#' + json[0].colors[i]));
            }
        }
        for (var i = 0; i < colors.length; i++) {
            colors[i] = config.colors[Math.floor(Math.random() * config.colors.length)];
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    // Public API
    sketch.title = title;
    sketch.parseColors = parseColors;
}
// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');