var sketch = function (p) {
    var positions,
        colors,
        config = {
            width: 50,
            height: 50,
            colors: [ ]
        },
        apiCall,
        apiSrcColour = 'http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=sketch.parseColours',
        body;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        body = document.getElementsByTagName('body')[0];
        getColors();
    };

    p.draw = function () {
        p.background(175);
        for (var i = 0; i < positions.length; i++) {
            p.noStroke();
            p.fill(colors[i]);
            p.push();
            p.translate(positions[i].x + config.width/2, positions[i].y + config.height/2);
            p.translate(-config.width/2, -config.height/2);
            p.rect(0, 0, config.width, config.height);
            p.pop();
        }
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        init();
    };

    function init() {
        var y = config.height/2,
            prevC = p.color(255);
        positions = [];
        colors = [];
        while (y < p.windowHeight - config.height) {
            var x = config.width/2;
            while(x < p.windowWidth - config.width) {
                var index = p.round(p.map(p.noise(x/10, y/10), 0, 1, 0, config.colors.length - 1)),
                    newC = config.colors[index];
                positions.push( new p5.Vector(x, y) );
                colors.push( p.lerpColor(newC, prevC, 0.8) );
                x += config.width * 1.5;
                prevC = newC;
            }
            y += config.height * 1.5;
        }

    }

    // COLOR GENERATORS

    function getColors() {
        var oldCall = document.getElementById('color-script');
        if (oldCall) {
            oldCall.parentNode.removeChild(oldCall);
        }
        apiCall = document.createElement('script');
        apiCall.id = 'color-script';
        apiCall.src = apiSrcColour + '&' + (new Date().getTime());
        body.appendChild(apiCall);
        p.noLoop();
    }

    // Callback function for colourlovers API call.
    function parseColours(json) {
        for (var i = 0; i < json[0].colors.length; i++) {
            config.colors.push(p.color('#' + json[0].colors[i]));
        }
        config.colors.splice(p.floor(config.colors.length/2), 0, p.color(255));
        init();
        p.loop();
    }

    // Calculates HSL-based complement of a color. Returns RGB color.
    function complementHSL(c) {
        var result;
        p.colorMode(p.HSL);
        result = p.color( (p.hue(c)) + 180 % 360, p.saturation(c), 100 - p.lightness(c) );
        p.colorMode(p.RGB);
        return p.color( p.red(result), p.green(result), p.blue(result) );
    }

    function fixedOffsetRGB(c) {
        var offset = 75,
            value = (p.red(c) + p.green(c) + p.blue(c))/3,
            newValue = value + 2 * p.random() * offset - offset,
            valueRatio = newValue / value;
        p.colorMode(p.RGB);
        return p.color( p.red(c) * valueRatio, p.green(c) * valueRatio, p.blue(c) * valueRatio );
    }

    function randomOffsetRGB(c) {
        var max = 50,
            maxr = p.min(255 - p.red(c), max),
            maxg = p.min(255 - p.green(c), max),
            maxb = p.min(255 - p.blue(c), max),
            r = p.red(c) + p.random(-p.red(c)/4, maxr);
            g = p.blue(c) + p.random(-p.green(c)/4, maxg);
            b = p.green(c) + p.random(-p.blue(c)/4, maxb);
        return p.color(r, g, b);

    }

    function perlinRGB(x, y, z) {
        var low = 0,
            hi = 255;
        return p.color( p.map(p.noise(x), 0, 1, low, hi), p.map(p.noise(y), 0, 1, low, hi), p.map(p.noise(z), 0, 1, low, hi));
    }

    function randomRGB() {
        p.colorMode(p.RGB);
        return p.color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }

    sketch.parseColours = parseColours;

}
// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');