var sketch = function (p) {
    var positions,
        palette,
        colors,
        config = {
            width: 50,
            height: 50,
            colorA: chroma('#000000'),
            colorB: chroma('#000000'),
            colorC: chroma('#FFFFFF'),
            colorD: chroma('#FFFFFF'),
        },
        data = {
            colorA: config.colorA.hex(),
            colorB: config.colorB.hex(),
            colorC: config.colorC.hex(),
            colorD: config.colorD.hex(),
            randomize: function() { randomize(); },
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
        var a = gui.addColor(data, 'colorA'),
            b = gui.addColor(data, 'colorB'),
            c = gui.addColor(data, 'colorC'),
            d = gui.addColor(data, 'colorD');
        a.onChange( function() { updatePalette(); } );
        b.onChange( function() { updatePalette(); } );
        c.onChange( function() { updatePalette(); } );
        d.onChange( function() { updatePalette(); } );
        gui.add(data,'randomize').name('random colors');
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
        config.colorA = chroma(data.colorA);
        config.colorB = chroma(data.colorB);
        config.colorC = chroma(data.colorC);
        config.colorD = chroma(data.colorD);
        var l = [config.colorA, config.colorB, config.colorC, config.colorD];
        l.sort(function(a, b) {
          return b.get('hcl.l') - a.get('hcl.l');
        });
        var bezInterpolator = chroma.bezier([l[0], l[1], l[2], l[3]])
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

    function updatePalette() {
        palette = setPalette();
        colors = setColors(positions.length);
    }

    function randomize() {
        data.colorA = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        data.colorB = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        data.colorC = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        data.colorD = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
        updatePalette();
    }

    function reorder() {
        var l = [config.colorA, config.colorB, config.colorC, config.colorD];
            l.sort(function(a, b) {
            return b.get('hcl.l') - a.get('hcl.l');
        });
        config.colorA = l[0];
        config.colorB = l[1];
        config.colorC = l[2];
        config.colorD = l[3];
        data.colorA = config.colorA.hex(),
        data.colorB = config.colorB.hex(),
        data.colorC = config.colorC.hex(),
        data.colorD = config.colorD.hex();
    }

}

window.onload = function() {
    // Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
    var p5sketch = new p5(sketch, 'p5-sketch');
};

