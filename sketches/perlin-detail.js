var sketch = function (p) {
    var
        config = {
            rotOffset: null,
        },
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
            // Visualization options.
            viz: {
                pixels: 'pixels',
                rotations: 'rotations',
                gradient: 'gradient',
                curl: 'curl',
                histogram: 'histogram'
            },
            // From setSeed p5.js source code.
            overlay: true,
            seed: (Math.random() * 4294967296)  >>> 0,
            randSeed: function () {
                    data.seed = (Math.random() * 4294967296)  >>> 0;
                    p.noiseSeed(data.seed);
                    config.rotOffset = p.random(0, p.TWO_PI);
                    // CAUTION: Verify this index when changing controllers.
                    gui.__controllers[5].updateDisplay();
                    p.loop();
                }
            }

    p.setup = function () {
        var guiElt;
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        p.createCanvas(document.getElementsByTagName('html')[0].clientWidth, document.getElementsByTagName('html')[0].clientHeight);
        p.noFill();
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
            mode = e;
            p.loop();
        });
        gui.add(data, 'overlay').name('Overlay').onFinishChange( function() {
            p.loop();
        });
        gui.add(data, 'seed').name('Seed').onFinishChange( function() {
            p.noiseSeed(data.seed);
            config.rotOffset = p.random(0, p.TWO_PI);
            p.loop();
        });
        gui.add(data, 'randSeed').name('Re-seed');
        // Set up color scale.
        scale = chroma.scale('Paired');
        // Set default display mode.
        mode = 'pixels';
        // Set initial rotation offset for vector field mode.
        config.rotOffset = p.random(0, p.TWO_PI);
    };

    p.draw = function () {
        display[mode]();
    };

    p.windowResized = function () {
        p.resizeCanvas(document.getElementsByTagName('html')[0].clientWidth, document.getElementsByTagName('html')[0].clientHeight);
    };

    // Define display modes.
    display = {
        pixels: function() {
            p.loadPixels();
            for (var x = 0; x < p.width; x++) {
                for (var y = 0; y < p.height; y++) {
                    var n = p.noise(x/data.zoom, y/data.zoom),
                        c = scale(n).rgb();
                    setPixColor(x, y, dpr, c);
                }
            }
            p.updatePixels();
            p.noLoop();
        },
        rotations: function() {
            var space = 20,
                size = space - 10,
                arrow = size/2,
                margin = 30,
                xm = Math.floor((p.width - margin) / space),
                ym = Math.floor((p.height - margin) / space),
                chr = 80,
                lit = 65,
                m = 0,
                cos60 = Math.cos(60);
            if (data.overlay) { display['pixels'](); p.background(40, 160); }
            else { p.background(40); }
            for (var y = p.height/2 + space/2; y < p.height - ym/2 - size/2; y += space) {
                var n = 0,
                    noise, theta, color;
                for (var x = p.width/2 + space/2; x < p.width - xm/2 - size/2; x += space) {
                    p.push();
                    p.translate(x, y);
                    noise = p.noise(x/data.zoom, y/data.zoom);
                    theta = p.map(noise, 0, 1, 0, p.TWO_PI) + config.rotOffset;
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    p.push();
                    p.translate(p.width/2 - space/2 - space * n, y);
                    noise = p.noise((p.width/2 - space/2 - space * n)/data.zoom, y/data.zoom);
                    theta = p.map(noise, 0, 1, 0, p.TWO_PI) + config.rotOffset;
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    p.push();
                    p.translate(x, p.height/2 - space/2 - space * m);
                    noise = p.noise(x/data.zoom, (p.height/2 - space/2 - space * m)/data.zoom);
                    theta = p.map(noise, 0, 1, 0, p.TWO_PI) + config.rotOffset;
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    p.push();
                    p.translate(p.width/2 - space/2 - space * n, p.height/2 - space/2 - space * m);
                    noise = p.noise((p.width/2 - space/2 - space * n)/data.zoom, (p.height/2 - space/2 - space * m)/data.zoom);
                    theta = p.map(noise, 0, 1, 0, p.TWO_PI) + config.rotOffset;
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    n++;
                }
                m++;
            }
            p.noLoop();
        },
        gradient: function() {
            var space = 20,
                size = space - 10,
                arrow = size/2,
                margin = 30,
                xm = Math.floor((p.width - margin) / space),
                ym = Math.floor((p.height - margin) / space),
                chr = 80,
                lit = 65,
                m = 0,
                cos60 = Math.cos(60);
            if (data.overlay) { display['pixels'](); p.background(40, 160); }
            else { p.background(40); }
            for (var y = p.height/2 + space/2; y < p.height - ym/2 - size/2; y += space) {
                var n = 0,
                    noise, theta, color;
                for (var x = p.width/2 + space/2; x < p.width - xm/2 - size/2; x += space) {
                    var v = gradient(x, y, data.zoom);
                    p.push();
                    p.translate(x, y);
                    theta = v.heading();
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    p.push();
                    v = gradient(p.width/2 - space/2 - space * n, y, data.zoom);
                    p.translate(p.width/2 - space/2 - space * n, y);
                    theta = v.heading();
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    p.push();
                    v = gradient(x, p.height/2 - space/2 - space * m, data.zoom);
                    p.translate(x, p.height/2 - space/2 - space * m);
                    theta = v.heading();
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    p.push();
                    v = gradient(p.width/2 - space/2 - space * n, p.height/2 - space/2 - space * m, data.zoom);
                    p.translate(p.width/2 - space/2 - space * n, p.height/2 - space/2 - space * m);
                    theta = v.heading();
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    n++;
                }
                m++;
            }
            p.noLoop();
        },
        curl: function() {
            var space = 20,
                size = space - 10,
                arrow = size/2,
                margin = 30,
                xm = Math.floor((p.width - margin) / space),
                ym = Math.floor((p.height - margin) / space),
                chr = 80,
                lit = 65,
                m = 0,
                cos60 = Math.cos(60);
            if (data.overlay) { display['pixels'](); p.background(40, 160); }
            else { p.background(40); }
            for (var y = p.height/2 + space/2; y < p.height - ym/2 - size/2; y += space) {
                var n = 0,
                    noise, theta, color;
                for (var x = p.width/2 + space/2; x < p.width - xm/2 - size/2; x += space) {
                    var v = curl(x, y, data.zoom);
                    p.push();
                    p.translate(x, y);
                    theta = v.heading();
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    p.push();
                    v = curl(p.width/2 - space/2 - space * n, y, data.zoom);
                    p.translate(p.width/2 - space/2 - space * n, y);
                    theta = v.heading();
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    p.push();
                    v = curl(x, p.height/2 - space/2 - space * m, data.zoom);
                    p.translate(x, p.height/2 - space/2 - space * m);
                    theta = v.heading();
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    p.push();
                    v = curl(p.width/2 - space/2 - space * n, p.height/2 - space/2 - space * m, data.zoom);
                    p.translate(p.width/2 - space/2 - space * n, p.height/2 - space/2 - space * m);
                    theta = v.heading();
                    color = chroma.hcl(p.degrees(theta) % 360, chr, lit).hex();
                    p.rotate(theta);
                    p.stroke(color);
                    p.strokeWeight(1);
                    p.line(-size/2, 0, size/2, 0);
                    p.translate(-size/2, 0);
                    p.fill(color);
                    p.triangle( (cos60 * arrow)/2, 0, -(cos60 * arrow)/2, arrow/2, (-cos60 * arrow)/2, -arrow/2);
                    p.pop();

                    n++;
                }
                m++;
            }
            p.noLoop();
        },
        histogram: function() {
            var buckets = {},
                colors = {},
                num = 999,
                sampling = 4,
                max = 0;
            p.background('#DCDCDC');
            p.strokeWeight(1);
            for (var i = 0; i < p.width; i += sampling) {
                for (var j = 0; j < p.height; j += sampling) {
                    var n = p.noise(i/data.zoom, j/data.zoom),
                        c = scale(n).rgb();
                        key = Math.round(p.map(n, 0, 1, 0, num));
                    colors[key] ? chroma.mix(colors[key], c) : colors[key] = c;
                    buckets[key] ? buckets[key] += 1 : buckets[key] = 1;
                    if (buckets[key] > max) { max = buckets[key]; }
                }
            }
            for (var key = 0; key <= num; key++) {
                var v = buckets[key] ? buckets[key] : 0,
                    c = colors[key],
                    x = p.map(key, 0, num, 0, p.width),
                    h = p.map(v, 0, max, p.height, 20);
                c ? p.stroke(c) : p.stroke(0, 0);
                p.line(x, p.height, x, h);
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

    // Computes the gradient at the sampled point in perlin space. Returns a vector.
    function gradient(x, y, zoom) {
        var eps = 1,
            n1, n2, a, b;
        n1 = p.noise(x/zoom, (y + eps)/zoom);
        n2 = p.noise(x/zoom, (y - eps)/zoom);
        // change in field wrt y.
        a = (n1 - n2)/2 * eps;
        n1 = p.noise((x + eps)/zoom, y/zoom);
        n2 = p.noise((x - eps)/zoom, y/zoom);
        // change in field wrt x.
        b = (n1 - n2)/2 * eps;
        return p.createVector(b, a);
    }

    // Computes the curl at a sampled point in perlin space. Returns a vector.
    function curl(x, y, zoom) {
        var eps = 1,
            n1, n2, a, b;
        n1 = p.noise(x/zoom, (y + eps)/zoom);
        n2 = p.noise(x/zoom, (y - eps)/zoom);
        // change in field wrt y.
        a = (n1 - n2)/2 * eps;
        n1 = p.noise((x + eps)/zoom, y/zoom);
        n2 = p.noise((x - eps)/zoom, y/zoom);
        // change in field wrt x.
        b = (n1 - n2)/2 * eps;
        return p.createVector(a, -b);
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');