var sketch = function (p) {
    var positions,
        colors,
        config = {
            width: 50,
            height: 50
        };

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        init();
    };

    p.draw = function () {
        p.background(255);
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
        var y = config.height/2;
        positions = [];
        colors = [];
        while (y < p.windowHeight - config.height) {
            var x = config.width/2,
                c1 = randomRGB();
            while(x < p.windowWidth - config.width) {
                positions.push( new p5.Vector(x, y) );
                if (x == config.width/2) { colors.push(c1); }
                else { colors.push( complementHSL(c1) ); }
                x += config.width * 1.5; 
            }
            y += config.height * 1.5;
        }

    }

    // COLOR GENERATORS

    function complementHSL(c) {
        var result;
        p.colorMode(p.HSL);
        result = p.color( (p.hue(c)) + 180 % 360, p.saturation(c), 100 - p.lightness(c) );
        p.colorMode(p.RGB);
        return p.color( p.red(result), p.green(result), p.blue(result) );
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


}
// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');