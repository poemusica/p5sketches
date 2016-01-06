var sketch = function (p) {
    var
        dpr,
        scale,
        gui,
        data = {
            zoom: 100,
            // p5.js default
            octaves: 4,
            // p5.js default. Values > 0.5 can result in output > 1.
            falloff: 0.5,
            // TODO
            viz: { cloud: true, other: false, whatever: false },
            // From setSeed p5.js source code.
            seed: (Math.random() * 4294967296)  >>> 0,
            randSeed: function () {
                    data.seed = (Math.random() * 4294967296)  >>> 0;
                    p.noiseSeed(data.seed);
                    // CAUTION: Verify this index when changing controllers.
                    gui.__controllers[4].updateDisplay();
                    p.loop();
                }
            }

    p.setup = function () {
        var guiElt;
        p.createCanvas(p.windowWidth, p.windowHeight);
        // Set up GUI in DOM.
        dpr = p.pixelDensity();
        gui = new dat.GUI( { autoPlace: false } );
        guiElt = gui.domElement;
        document.getElementById('p5-sketch').appendChild(guiElt);
        guiElt.style.position = 'fixed';
        guiElt.style.left = '0px';
        guiElt.style.top = '0px';
        // Add GUI controllers.
        gui.add(data, 'zoom', 5, 500).name('Zoom').step(5).onChange( function() {
            p.loop();
        });
        gui.add(data, 'octaves', 1, 8).name('Octaves').step(1).onChange( function() {
            p.noiseDetail(data.octaves, data.falloff);
            p.loop();
        });
        gui.add(data, 'falloff', 0, 0.5).name('Falloff').onChange( function() {
            p.noiseDetail(data.octaves, data.falloff);
            p.loop();
        });
        gui.add(data, 'viz', { cloud: true, other: false, whatever: false } ).name('Visualization');
        gui.add(data, 'seed').name('Seed').onFinishChange( function() {
            p.noiseSeed(data.seed);
            p.loop();
        });
        gui.add(data, 'randSeed').name('Re-seed');
        scale = chroma.scale('Paired');
        //scale = chroma.cubehelix().scale();
    };

    p.draw = function () {
        p.background(0);
        p.loadPixels();
        for (var x = 0; x < p.width; x++) {
            for (var y = 0; y < p.height; y++) {
                var n = p.noise(x/data.zoom, y/data.zoom),
                    c = scale(n).rgb();
                    // c = p.map(n, 0, 1, 0, 255);
                setPixColor(x, y, dpr, c);
                //p.set(x, y, c);
            }
        }
        p.updatePixels();
        p.noLoop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    // Directly sets values for pixels in the display.
    // Inputs: x, y coords, pixel density of screen, color.
    // Uses method suggesed in p5.js docs for compatibility with retina displays.
    function setPixColor(x, y, d, c) {
        for (var i = 0; i < d; i++) {
          for (var j = 0; j < d; j++) {
            var idx = 4 * ((y * d + j) * p.width * d + (x * d + i));
            p.pixels[idx] = c[0];      // r
            p.pixels[idx+1] = c[1];    // g
            p.pixels[idx+2] = c[2];    // b
            p.pixels[idx+3] = 255;     // a
          }
        }
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');