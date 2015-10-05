////////////////////////////////////////////////////////////////////////////////
// CONSTELLATIONS LOGIC
var sketch = function (s) {
    var
        title = "constellations",
        nsys,
        body,
        apiCall,
        apiSrc,
        config = {
            bg: s.color(255),
            colors: [s.color(0)],
            maxNodes: 150,
            minDist: 75
        };
    ////////////////////////////////////////////////////////////////////////////
    // Sets up sketch.
    s.setup = function () {
        s.createCanvas(s.windowWidth, s.windowHeight);
        s.frameRate(60);
        nsys = nodeSys();
        for (var i = 0; i < s.constrain(Math.floor(s.max(s.windowWidth, s.windowHeight)/5), 0, config.maxNodes); i++) {
            nsys.addNode();
        }
        body = document.getElementsByTagName('body')[0];
        apiSrc = 'http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=sketch.parseColors';
    }
    ////////////////////////////////////////////////////////////////////////////
    // Draws.
    s.draw = function () {
        s.background(config.bg);
        nsys.run();
    }
    ////////////////////////////////////////////////////////////////////////////
    // Window resizing logic
    s.windowResized = function () {
        s.resizeCanvas(s.windowWidth, s.windowHeight);
        nsys.update();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Defines node.
    function node (v) {
        return {
            loc: s.createVector(Math.random() * s.windowWidth, Math.random() * s.windowHeight),
            vel: v.setMag(s.constrain(Math.random() * 4, 0.5, 4)),
            fill: config.colors[0],
            update: function () {
                this.loc.add(this.vel);
            },
            wrap: function () {
                if (this.loc.x > s.windowWidth) {
                    this.loc.x = 0;
                }
                if (this.loc.x < 0) {
                    this.loc.x = s.windowWidth;
                }
                if (this.loc.y > s.windowHeight) {
                    this.loc.y = 0;
                }
                if (this.loc.y < 0) {
                    this.loc.y = s.windowHeight;
                }
            },
            display: function () {
                s.push();
                s.translate(this.loc.x, this.loc.y);
                s.noStroke();
                s.fill(this.fill);
                s.ellipse(0, 0, 3, 3);
                s.pop();
            },
            run: function () {
                this.update();
                this.wrap();
                this.display();
            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    // Defines node.
    function nodeSys () {
        return {
            nodes: [],
            addNode: function () {
                this.nodes.push(node(p5.Vector.random2D()));
            },
            removeNode: function () {
                this.nodes.pop();
            },
            update: function () {
                var target = s.min(Math.floor(s.max(s.windowWidth, s.windowHeight)/5), config.maxNodes);
                if (this.nodes.length < target) {
                    while (this.nodes.length < target) { this.addNode(); }
                } else if (this.nodes.length > target) {
                    while (this.nodes.length > target) { this.removeNode(); }
                }
            },
            run: function () {
                // draw nodes
                for (var i = 0; i < this.nodes.length; i++) {
                    var n = this.nodes[i];
                    n.run();
                }
                // draw connections
                for (var i = 0; i < this.nodes.length; i++) {
                    var n = this.nodes[i];
                    for (var j = 0; j < this.nodes.length; j++) {
                        var m = this.nodes[j];
                        if (n != m) {
                            var d = p5.Vector.dist(n.loc, m.loc);
                            if (d < config.minDist) {
                                s.stroke(s.red(n.fill), s.green(n.fill), s.blue(n.fill), s.lerp(255, 0, d/config.minDist));
                                s.line(n.loc.x, n.loc.y, m.loc.x, m.loc.y);
                            }
                        }
                    }
                }
            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    // User input logic
    s.mouseClicked = function() {
        getColors();
    }
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
        console.log(json);
        if (json[0].colors.length > 2) {
            config.colors = [];
            config.bg = '#' + json[0].colors[0];
            for (var i = 1; i < json[0].colors.length; i++) {
                config.colors.push(s.color('#' + json[0].colors[i]));
            }
        }
        for (var i = 0; i < nsys.nodes.length; i++) {
            nsys.nodes[i].fill = config.colors[Math.floor(Math.random() * config.colors.length)];
        }
    }
    ////////////////////////////////////////////////////////////////////////////
    // Public API
    sketch.title = title;
    sketch.parseColors = parseColors;
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');