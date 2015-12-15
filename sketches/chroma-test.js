var sketch = function (p) {
    var positions,
        palette,
        colors,
        config = {
            width: 50,
            height: 50,
            colorStart: null, 
            colorEnd: null,
            colorMid1: null,
            colorMid2: null,
            satStep: 0,
            litStep: 0
        },
        data = {
            saturation: 80,
            lightness: 80,
            hueA: null,
            hueB: null,
            hueC: null,
            hueD: null,
            refresh: function() { refresh(); },
        },
        gui;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        gui = new dat.GUI( { autoPlace: false } );
        var guiElt = gui.domElement;
        document.getElementById('p5-sketch').appendChild(guiElt);
        guiElt.style.position = 'fixed';
        guiElt.style.left = '0px';
        guiElt.style.top = '0px';
        config.colorStart = chroma.random().set('hcl.c', data.saturation - config.satStep).set('hcl.l', data.lightness - config.litStep);
        config.colorMid1 = chroma.hcl((config.colorStart.get('hcl.h') + 60) % 360, data.saturation - config.satStep, data.lightness - config.litStep);
        config.colorMid2 = chroma.hcl((config.colorStart.get('hcl.h') + 120) % 360, data.saturation - config.satStep, data.lightness - config.litStep);
        config.colorEnd = chroma.hcl((config.colorStart.get('hcl.h') + 180) % 360, data.saturation, data.lightness);
        data.hueA = config.colorStart.get('hcl.h');
        data.hueB = config.colorMid1.get('hcl.h');
        data.hueC = config.colorMid2.get('hcl.h');
        data.hueD = config.colorEnd.get('hcl.h');
        gui.add(data, 'saturation', 31, 100).onChange(function() { updatePalette(); });
        gui.add(data, 'lightness', 25, 100).onChange(function() { updatePalette(); });
        gui.add(data, 'hueA', 0, 360).name('start hue').onChange(function() { updatePalette(); });
        gui.add(data, 'hueB', 0, 360).name('blend hue 1').onChange(function() { updatePalette(); });
        gui.add(data, 'hueC', 0, 360).name('blend hue 2').onChange(function() { updatePalette(); });
        gui.add(data, 'hueD', 0, 360).name('end hue').onChange(function() { updatePalette(); });
        gui.add(data,'refresh').name('refresh palette');
        positions = setPositions();
        palette = setPalette();
        colors = setColors(positions.length);
    };

    p.draw = function () {
        p.background('#DCDCDC');
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
    };

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

    // Returns array of colors from chroma.
    function setPalette() {
        config.colorStart = chroma.hcl(data.hueA, data.saturation - config.satStep, data.lightness - config.litStep);
        config.colorMid1 = chroma.hcl(data.hueB, data.saturation - config.satStep, data.lightness - config.litStep);
        config.colorMid2 = chroma.hcl(data.hueC, data.saturation - config.satStep, data.lightness - config.litStep);
        config.colorEnd = chroma.hcl(data.hueD, data.saturation, data.lightness);
        var result,
            bezInterpolator = chroma.bezier([config.colorStart, config.colorMid1, config.colorMid2, config.colorEnd])
        return chroma.scale(bezInterpolator).padding(0).correctLightness(true).colors(9);
    }

    // Returns an array of colors of specified length.
    function setColors(n) {
        var result = [];
        for (var i = 0; i < n; i++) {
            var index = i % palette.length,
                // index = Math.round(p.random(0, 4)),
                c = palette[ index ];
            result.push(c);
        }
        return result;
    }

    function updatePalette(n) {
        palette = setPalette();
        colors = setColors(positions.length);
    }

    function refresh() {
        config.colorStart = chroma.random().set('hcl.c', data.saturation - config.satStep).set('hcl.l', data.lightness - config.litStep);
        config.colorMid1 = chroma.hcl((config.colorStart.get('hcl.h') + 60) % 360, data.saturation - config.satStep, data.lightness - config.litStep);
        config.colorMid2 = chroma.hcl((config.colorStart.get('hcl.h') + 120) % 360, data.saturation - config.satStep, data.lightness - config.litStep);
        config.colorEnd = chroma.hcl((config.colorStart.get('hcl.h') + 180) % 360, data.saturation, data.lightness);
        data.hueA = config.colorStart.get('hcl.h');
        data.hueB = config.colorMid1.get('hcl.h');
        data.hueC = config.colorMid2.get('hcl.h');
        data.hueD = config.colorEnd.get('hcl.h');
        palette = setPalette();
        colors = setColors(positions.length);
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    }

}


window.onload = function() {
    // Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
    var p5sketch = new p5(sketch, 'p5-sketch');
};

