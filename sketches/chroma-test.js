var sketch = function (p) {
    var positions,
        rotations,
        palette,
        colors,
        config = {
            width: 400,
            height: 75,
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
            randomize: function() { randomize(); p.loop(); },
            sort: function() { colors = setColors(positions.length); p.loop();},
            shuffle: function () { shuffleArray(colors); p.loop();},
            tidy: function() { centerPositions(); rotations = resetRotations(positions.length); p.loop();},
            messy: function() { positions = setPositions(); rotations = setRotations(positions.length); p.loop();},
        },
        gui;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER);
        gui = new dat.GUI( { autoPlace: false } );
        var guiElt = gui.domElement;
        document.getElementById('p5-sketch').appendChild(guiElt);
        guiElt.style.position = 'fixed';
        guiElt.style.left = '0px';
        guiElt.style.top = '0px';
        var a = gui.addColor(data, 'colorA').name("Color");
            b = gui.addColor(data, 'colorB').name("Color");
            c = gui.addColor(data, 'colorC').name("Color");
            d = gui.addColor(data, 'colorD').name("Color");
        a.onChange( function() { updatePalette(); p.loop(); } );
        a.onFinishChange(function(){ sortUI(); p.loop(); });
        b.onChange( function() { updatePalette(); p.loop(); } );
        b.onFinishChange(function(){ sortUI(); p.loop(); });
        c.onChange( function() { updatePalette(); p.loop(); } );
        c.onFinishChange(function(){ sortUI(); p.loop(); });
        d.onChange( function() { updatePalette(); p.loop(); } );
        d.onFinishChange(function(){ sortUI(); p.loop(); });
        gui.add(data,'randomize').name('Get Random');
        gui.add(data,'sort').name('Sort Palette');
        gui.add(data,'shuffle').name('Shuffle Palette');
        gui.add(data,'tidy').name('Tidy Palette');
        gui.add(data,'messy').name('Messy Palette');
        positions = setPositions();
        rotations = setRotations(positions.length);
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
            p.translate(positions[i].x, positions[i].y);
            p.rotate(rotations[i]);
            p.rect(0, 0, config.width, config.height);
            p.pop();
        }
        p.noLoop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        positions = setPositions();
        rotations = setRotations(positions.length);
        updatePalette();
        p.loop();
    };

    // Returns an array of positions based on window dimensions.
    function setPositions() {
        var result = [],
            x = p.width/2,
            y = config.height;
        while (y < p.windowHeight - config.height) {
            var xoff = p.random(-50, 50);
            result.push( new p5.Vector(x + xoff, y) );
            y += config.height * 0.75;
        }
        return result;
    }

    // Centers x-values in positions array based on window size.
    function centerPositions() {
        for (var i = 0; i < positions.length; i++) {
            positions[i].x = p.width/2;
        } 
    }

    // Returns an array of rotations of specified length.
    function setRotations(n) {
        var result = [];
        for (var i = 0; i < n; i++) {
            result.push(p.random(-p.PI/12, p.PI/12));
        }
        return result;
    }

    // Returns an array of 0 rotations of specified length.
    function resetRotations(n) {
        var result = [];
        for (var i = 0; i < n; i++) {
            result.push(0);
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
        return chroma.scale(bezInterpolator).padding(0).correctLightness(true).colors(positions.length);
    }

    // Returns an array of colors of specified length.
    function setColors(n) {
        var result = [];
        for (var i = 0; i < n; i++) {
            var c = palette[i];
            result.push(c);
        }
        return result;
    }


    function updatePalette() {
        palette = setPalette();
        colors = setColors(positions.length);
    }

    // Generate new random palette of colors.
    function randomize() {
        data.colorA = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        data.colorB = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        data.colorC = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        data.colorD = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
        updatePalette();
        sortUI();
    }

    // Shuffle an array in place using Fisher-Yates method.
    function shuffleArray (array) {
        var i = 0, 
            j = 0,
            temp = null;
        for (var i = array.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    // Rearrange color list items in DOM according to lightness.
    function sortUI() {
        var items = document.getElementsByClassName('color'),
            ul = items[0].parentElement,
            button = ul.getElementsByClassName('function')[0],
            itemList = [];
        for (var i = 0; i < items.length; i++) {
            itemList.push(items[i]); 
        }
        itemList.sort( function(a, b) {
            var colorA = chroma(a.getElementsByClassName('c')[0].firstChild.value),
                colorB = chroma(b.getElementsByClassName('c')[0].firstChild.value);
            return colorB.get('hcl.l') - colorA.get('hcl.l');
        });
        for (var i = 0; i < itemList.length; i++) {
            ul.insertBefore(itemList[i], button);
        }
    }

    // Rearrange data colors according to lightness.
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

