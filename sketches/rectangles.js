var sketch = function (p) {
    var positions = [],
        rotations = [],
        colors = [],
        strokes = [],
        config = {
            width: 50,
            height: 100,
            colors: [],
        },
        apiCall,
        apiSrcColour = 'http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=sketch.parseColours',
        body,
        // color mapping for lerping between complements
        mapping = {
            c1: randomRGB(),
        },
        white = p.color(255),
        black = p.color(0);

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.ellipseMode(p.CORNER);
        //init();
        body = document.getElementsByTagName('body')[0];
        getColors();
    };

    p.draw = function () {
        p.background(0);

        for (var i = 0; i < positions.length; i++) {
            p.noStroke();
            p.stroke(strokes[i]);
            p.fill(colors[i]);
            p.push();
            p.translate(positions[i].x + config.width/2, positions[i].y + config.height/2);
            rotations[i] +=  p.radians(5);
            p.rotate(rotations[i]);
            p.translate(-config.width/2, -config.height/2);
            //p.ellipse(0, 0, config.width, config.height);
            p.rect(0, 0, config.width, config.height);
            p.pop();
        }
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        init();
    };

    function init() {
        var y = -config.height,
            stepx = 0.01,
            stepy = 100,
            prevR = p.random(-p.PI/12, p.PI/12),
            prevC = white;
            i = 0;
        positions = [];
        rotations = [];
        colors = [],
        strokes = [];
        mapping.c2 = complementHSL(mapping.c1);
        while (y < p.windowHeight + config.height) {
            var x = 0;
            while(x < p.windowWidth) {
                var newR = prevR + p.map(p.noise(stepx, stepy), 0, 1, -p.PI/6, p.PI/6),
                    index = p.round(p.map(p.noise(x/100, y/100), 0, 1, 0, config.colors.length - 1)),
                    newC = p.lerpColor(config.colors[index], prevC, 0.8);
                rotations.push(newR);
                positions.push( new p5.Vector(x, y) );
                colors.push( newC );
                strokes.push( p.lerpColor( black, white, p.saturation(colors[colors.length - 1])/100 ) );
                x += config.width * 0.25;
                stepx += 0.001;
                prevR = newR;
            }
            y += config.height * 0.25;
            stepy += 0.001;
            prevC = config.colors[ p.floor(i % (config.colors.length - 1))];
            i++;
        }
    }

    // COLOR 

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
        console.log('bar');
        init();
        p.loop();
    }

    function perlinLerpComplements(x, y, z) {
        var amt = p.noise(x, y, z);
        if (amt < 0.5) {
            return p.lerpColor(white, mapping.c1, p.map(amt, 0, 0.5, 0, 1));
        }
        return p.lerpColor(white, mapping.c2, p.map(amt, 0.5, 1, 0, 1));
    }

    function complementHSL(c) {
        var result;
        p.colorMode(p.HSL);
        result = p.color( (p.hue(c)) + 180 % 360, p.saturation(c), 100 - p.lightness(c) );
        p.colorMode(p.RGB);
        return p.color( p.red(result), p.green(result), p.blue(result) );
    }

    function randomRGB() {
        p.colorMode(p.RGB);
        return p.color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }

    sketch.parseColours = parseColours;
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');