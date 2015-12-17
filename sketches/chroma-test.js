var sketch = function (p) {
    var positions,
        palette,
        colors,
        config = {
            width: 50,
            height: 50,
            colorA: chroma('#FFFFFF'),
            colorB: chroma('#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6)),
            colorC: chroma('#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6)),
            colorD: chroma('#000000'),
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
        var a = gui.addColor(data, 'colorA');
            b = gui.addColor(data, 'colorB');
            c = gui.addColor(data, 'colorC');
            d = gui.addColor(data, 'colorD');
        a.onChange( function() { updatePalette(); } );
        a.onFinishChange(function(){ sortUI(); });
        b.onChange( function() { updatePalette(); } );
        b.onFinishChange(function(){ sortUI(); });
        c.onChange( function() { updatePalette(); } );
        c.onFinishChange(function(){ sortUI(); });
        d.onChange( function() { updatePalette(); } );
        d.onFinishChange(function(){ sortUI(); });
        gui.add(data,'randomize').name('random colors');
        positions = setPositions();
        reorder();
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
        reorder();
        updatePalette();
    }

    function sortUI() { // wip
        var items = document.getElementsByClassName('color');
        for (var i = 0; i < items.length; i++) {
            console.log(items.cssStyle);
        }
    }

    function reorder() {
        var l = [chroma(data.colorA), chroma(data.colorB), chroma(data.colorC), chroma(data.colorD)];
            l.sort(function(a, b) {
            return b.get('hcl.l') - a.get('hcl.l');
        });
        data.colorA = l[0].hex();
        data.colorB = l[1].hex();
        data.colorC = l[2].hex();
        data.colorD = l[3].hex();
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    }

}

window.onload = function() {
    // Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
    var p5sketch = new p5(sketch, 'p5-sketch');
};

