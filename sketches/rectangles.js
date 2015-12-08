var sketch = function (p) {
    var positions = [],
        rotations = [],
        colors = [],
        strokes = [],
        config = {
            width: 50,
            height: 100,
            colors: [],
            alpha: 0.5
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
        body = document.getElementsByTagName('body')[0];
        init();
    };

    p.draw = function () {
        for (var i = 0; i < positions.length; i++) {
            p.noStroke();
            //p.stroke(strokes[i]);
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
        var referenceAngle = p.random(0, 360),
            y = -config.height,
            stepx = 0.01,
            stepy = 100;
        setPosAndRot();
        while (y < p.windowHeight + config.height) {
            var x = 0,
                referenceColor = colorHarmonizer(referenceAngle);
            while(x < p.windowWidth) {
                colors.push( perlinLightness(referenceColor, x, y) );
                p.colorMode(p.RGB);
                strokes.push( p.lerpColor(p.color(255), p.color(0), p.noise(x, y)) );
                x += config.width * 0.25;
                stepx += 0.001;
            }
            y += config.height * 0.25;
            stepy += 0.001;
        }
    }

    // Returns an array of positions based on window dimensions.
    function setPosAndRot() {
        var y = -config.height,
            stepx = 0.01,
            stepy = 100,
            prevR = p.random(-p.PI/12, p.PI/12);
        while (y < p.windowHeight + config.height) {
            var x = 0;
            while(x < p.windowWidth) {
                var newR = prevR + p.map(p.noise(stepx, stepy), 0, 1, -p.PI/6, p.PI/6);
                rotations.push(newR);
                positions.push( new p5.Vector(x, y) );
                x += config.width * 0.25;
                stepx += 0.001;
                prevR = newR;
            }
            y += config.height * 0.25;
            stepy += 0.001;
        }
    }

    // COLOR 

    // Returns a harmonized HSL color based on reference angle input.
    // Adapted from http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/
    function colorHarmonizer(referenceAngle) {
        var result,
            // Analogous: Choose second and third ranges 0.
            // Complementary: Choose rangeAngle2 = 0, offsetAngle1 = 180.
            // Split Complementary: Choose offset angles 180 +/- a small angle. The second and third ranges must be smaller than the difference between the two offset angles.
            // Triad: Choose offset angles 120 and 240.
            offsetAngle1 = 120, 
            offsetAngle2 = 240,
            rangeAngle0 = 15, 
            rangeAngle1 = 30, 
            rangeAngle2 = 60,
            rangeAngleSum = rangeAngle0 + rangeAngle1 + rangeAngle2,
            saturation = p.random(60, 100), 
            luminance = p.random(50, 70),
            randomAngle;
        p.colorMode(p.HSL, 360, 100, 100);
        randomAngle = p.random(0, rangeAngleSum);
        if (randomAngle > rangeAngle0) {
            if (randomAngle < rangeAngle0 + rangeAngle1) {
                randomAngle += offsetAngle1;
            } else { randomAngle += offsetAngle2; }
        }
        return p.color( (referenceAngle + randomAngle) % 360, saturation, luminance);
    }

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

        // Takes a color and two variables. Returns a color based on output of perlin noise.
    function perlinLightness(c, x, y) {
        var amt = p.noise(x, y);
        p.colorMode(p.HSL);
        return p.color( p.hue(c), p.saturation(c), p.map(amt, 0, 1, -15, 15) + p.lightness(c), config.alpha );
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