var sketch = function (p) {
    var positions,
        colors,
        config = {
            width: 50,
            height: 50,
            colors: [ ]
        },
        data = {
            referenceAngle: null,
            saturation: null,
            lightness: null,
            refresh: function() { refresh(); },
            randAngles: [],
            // Analogous: Choose second and third ranges 0.
            // Complementary: Choose rangeAngle2 = 0, offsetAngle1 = 180.
            // Split Complementary: Choose offset angles 180 +/- a small angle. The second and third ranges must be smaller than the difference between the two offset angles.
            // Triad: Choose offset angles 120 and 240.
            offsetAngle1: 240,
            offsetAngle2: 180,
            rangeAngle0: 25,
            rangeAngle1: 15,
            rangeAngle2: 10,
        },
        gui,
        apiCall,
        apiSrcColour = 'http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=sketch.parseColours',
        body;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        body = document.getElementsByTagName('body')[0];
        gui = new dat.GUI( { autoPlace: false } );
        var guiElt = gui.domElement;
        document.getElementById('p5-sketch').appendChild(guiElt);
        guiElt.style.position = 'fixed';
        guiElt.style.left = '0px';
        guiElt.style.top = '0px';
        gui.add(data, 'offsetAngle1', 0, 360).onChange(function() { updateColors(); });
        gui.add(data, 'offsetAngle2', 0, 360).onChange(function() { updateColors(); });
        gui.add(data, 'rangeAngle0', 0, 360).onChange(function() { data.randAngles = setRandAngles(); updateColors(); });
        gui.add(data, 'rangeAngle1', 0, 360).onChange(function() { data.randAngles = setRandAngles(); updateColors(); });
        gui.add(data, 'rangeAngle2', 0, 360).onChange(function() { data.randAngles = setRandAngles(); updateColors(); });
        gui.add(data,'refresh').name('refresh palette');
        setBasics();
        positions = setPositions();
        data.randAngles = setRandAngles();
        colors = colorHarmonizer();
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
        positions = setPositions();
        data.randAngles = setRandAngles();
        colors = colorHarmonizer();
    };

    function updateColors() {
        colors = colorHarmonizer();
    }

    function refresh() {
        setBasics();
        data.randAngles = setRandAngles();
        colors = colorHarmonizer();
    }

    function setBasics() {
        data.referenceAngle = p.random(0, 360);
        data.saturation = p.random(60, 100);
        data.luminance = p.random(50, 70);
    }

    function setRandAngles() {
        var result = [],
            rangeAngleSum = data.rangeAngle0 + data.rangeAngle1 + data.rangeAngle2;
        for (var i = 0; i < positions.length; i++) {
            result.push(p.random(0, rangeAngleSum));
        }
        return result;
    }

    // Returns an array of positions based on window dimensions.
    function setPositions() {
        var result = [],
            y = config.height/2;
        while (y < p.windowHeight - config.height) {
            var x = config.width/2;
            while(x < p.windowWidth - config.width) {
                result.push( new p5.Vector(x, y) );
                x += config.width * 1.5;
            }
            y += config.height * 1.5;
        }
        return result;
    }

    // COLOR GENERATORS

    // Returns an array of harmonized HSL colors.
    // Adapted from http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/
    function colorHarmonizer() {
        var result = [],
            rangeAngleSum = data.rangeAngle0 + data.rangeAngle1 + data.rangeAngle2;
        p.colorMode(p.HSL, 360, 100, 100);
        for (var i = 0; i < positions.length; i++) {
            var randomAngle = data.randAngles[i],
                hslColor;
            if (randomAngle > data.rangeAngle0) {
                if (randomAngle < data.rangeAngle0 + data.rangeAngle1) {
                    randomAngle += data.offsetAngle1;
                } else { randomAngle += data.offsetAngle2; }
            }
            hslColor = p.color( (data.referenceAngle + randomAngle) % 360, data.saturation, data.luminance);
            result.push(hslColor);
        }
        return result;
    }

    function colorHarmonizerAlt() {
        var result = [],
            rangeAngleSum = data.rangeAngle0 + data.rangeAngle1 + data.rangeAngle2;
        p.colorMode(p.HSL, 360, 100, 100);
        for (var i = 0; i < positions.length; i++) {
            var randomAngle = data.randAngles[i],
                hslColor;
            if (randomAngle < data.rangeAngle0) {
                randomAngle -= data.rangeAngle0/2;
            } else if (randomAngle < data.rangeAngle0 + data.rangeAngle1) {
                randomAngle += (data.offsetAngle1 - data.rangeAngle1);
            } else { randomAngle += (data.offsetAngle2 - data.rangeAngle2); }
            hslColor = p.color( (data.referenceAngle + randomAngle) % 360, data.saturation, data.luminance);
            result.push(hslColor);
        }
        return result;
    }

    // Given an array of color options, returns an array of colors associated with positions array.
    // Uses white as a starting color. Blends each new color with it's neighbor using color lerping.
    function lerpNeighbor() {
        var result = [],
            prevC = p.color(255);
        for (var i = 0; i < positions.length; i++) {
            var pos = positions[i],
                index = p.round(p.map(p.noise(pos.x/10, pos.y/10), 0, 1, 0, config.colors.length - 1)),
                newC = config.colors[index];
            result.push( p.lerpColor(newC, prevC, 0.8) );
            prevC = newC;
        }
        return result;
    }
    // Returns an array of colors created with triad mixing.
    // Adapted from http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/
    function triadMixer() {
        var result = [],
            base = randomRGB(),
            greyControl = 15,
            tri1, tri2, tri3;
        p.colorMode(p.HSL);
        tri1 = p.color(p.hue(base), 100, 50);
        tri2 = p.color((p.hue(base) + 120) % 360, 100, 50 );
        tri3 = p.color((p.hue(base) + 240) % 360, 100, 50 );
        p.colorMode(p.RGB);
        for (var i = 0; i < positions.length; i++) {
            var n = p.random(0, 3),
                mixRatio1 = mixRatio2 = mixRatio3 = 0,
                mixSum,
                r, g, b;
            mixRatio1 = (n <= 1) ? Math.random() * greyControl : Math.random();
            mixRatio2 = (n > 1 && n <= 2) ? Math.random() * greyControl : Math.random();
            mixRatio3 = (n > 2 && n <= 3) ? Math.random() * greyControl : Math.random();
            mixSum = mixRatio1 + mixRatio2 + mixRatio3;
            mixRatio1 /= mixSum;
            mixRatio2 /= mixSum;
            mixRatio3 /= mixSum;
            r = mixRatio1 * p.red(tri1) + mixRatio2 * p.red(tri2) + mixRatio3 * p.red(tri3);
            g = mixRatio1 * p.green(tri1) + mixRatio2 * p.green(tri2) + mixRatio3 * p.green(tri3);
            b = mixRatio1 * p.blue(tri1) + mixRatio2 * p.blue(tri2) + mixRatio3 * p.blue(tri3);
            result.push( p.color( r, g, b) );
        }
        return result;
    }

    // Attaches colourlovers script to DOM.
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
    // Returns triad HSL color based on an input reference color.
    function triad(c) {
        p.colorMode(p.HSL);
        return p.color( (p.hue(c) + 120) % 360, 100, 50 );
    }

    // Returns HSL-based complement of a color in RGB format.
    function complementHSL(c) {
        var result;
        p.colorMode(p.HSL);
        result = p.color( (p.hue(c)) + 180 % 360, p.saturation(c), 100 - p.lightness(c) );
        p.colorMode(p.RGB);
        return p.color( p.red(result), p.green(result), p.blue(result) );
    }
    // Takes a color and returns an RGB color with a fixed offset from the input.
    // Adapted from http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/
    function fixedOffsetRGB(c) {
        var offset = 75,
            value = (p.red(c) + p.green(c) + p.blue(c))/3,
            newValue = value + 2 * p.random() * offset - offset,
            valueRatio = newValue / value;
        p.colorMode(p.RGB);
        return p.color( p.red(c) * valueRatio, p.green(c) * valueRatio, p.blue(c) * valueRatio );
    }
    // Takes a color and returns an RGB color with a random offset from the input.
    // Adapted from http://devmag.org.za/2012/07/29/how-to-choose-colours-procedurally-algorithms/
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
    // Takes three variables and returns an RGB color based on output of perlin noise.
    function perlinRGB(x, y, z) {
        var low = 0,
            hi = 255;
        p.colorMode(p.RGB);
        return p.color( p.map(p.noise(x), 0, 1, low, hi), p.map(p.noise(y), 0, 1, low, hi), p.map(p.noise(z), 0, 1, low, hi));
    }
    // Returns a random RGB color.
    function randomRGB() {
        p.colorMode(p.RGB);
        return p.color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }

    // PUBLIC API
    sketch.parseColours = parseColours;

}


window.onload = function() {
    // Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
    var p5sketch = new p5(sketch, 'p5-sketch');
};
