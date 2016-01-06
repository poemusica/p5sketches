var sketch = function (p) {
    var
        dpr,
        scale,
        gui,
        display,
        mode = null,
        data = {
            zoom: 100,
            // p5.js default
            octaves: 4,
            // p5.js default. Values > 0.5 can result in output > 1.
            falloff: 0.5,
            // TODO
            viz: { cloud: 'cloud', other: 'other' },
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
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        p.createCanvas(document.getElementsByTagName('html')[0].clientWidth, document.getElementsByTagName('html')[0].clientHeight);
        p.rectMode(p.CENTER);
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
        gui.add(data, 'viz', data.viz ).name('Visualization').onFinishChange( function(e) {
            console.log(e);
            mode = e;
            p.loop();
        });
        gui.add(data, 'seed').name('Seed').onFinishChange( function() {
            p.noiseSeed(data.seed);
            p.loop();
        });
        gui.add(data, 'randSeed').name('Re-seed');
        // Set up color scale.
        scale = chroma.scale('Paired');
        // Set up default display mode.
        mode = 'cloud';
    };

    p.draw = function () {
        display[mode]();
    };

    p.windowResized = function () {
        p.resizeCanvas(document.getElementsByTagName('html')[0].clientWidth, document.getElementsByTagName('html')[0].clientHeight);
    };

    // Define display modes.
    display = {
        cloud: function() {
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
        },
        other: function() {
            var space = 20,
                size = space - 10,
                margin = 30,
                xm = Math.floor((p.width - margin) / space),
                ym = Math.floor((p.height - margin) / space);
            p.background(255);
            p.stroke(0);
            p.strokeWeight(4);
            var m = 0;
            for (var y = p.height/2 + space/2; y < p.height - ym/2 - size/2; y += space) {
                var n = 0;
                for (var x = p.width/2 + space/2; x < p.width - xm/2 - size/2; x += space) {
                    p.point(x, y);
                    p.line(x - size/2, y, x + size/2, y);
                    p.point((p.width/2 - space/2) - space * n, y);
                    p.line((p.width/2 - space/2) - space * n - size/2, y, (p.width/2 - space/2) - space * n + size/2, y);
                    p.point(x, (p.height/2 - space/2) - space * m);
                    p.line(x - size/2, (p.height/2 - space/2) - space * m, x + size/2, (p.height/2 - space/2) - space * m);
                    p.point((p.width/2 - space/2) - space * n, (p.height/2 - space/2) - space * m);
                    p.line((p.width/2 - space/2) - space * n - size/2, (p.height/2 - space/2) - space * m, (p.width/2 - space/2) - space * n + size/2, (p.height/2 - space/2) - space * m);
                    n++;
                }
                m++;
            }
            p.noLoop();
        },
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