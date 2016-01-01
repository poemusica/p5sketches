var sketch = function (p) {
    var 
        // Render arrays
        positions,
        rotations,
        palette,
        targetPos = null,
        targetRot = null,
        // Config data
        config = {
            width: null,
            height: null,
            tranSpeed: 4,
            chromaA: null,
            chromaB: null,
            chromaC: null,
            chromaD: null,
        },
        // GUI and GUI data
        gui,
        data = {
            swatchA: '#FFFFFF',
            swatchB: '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6),
            swatchC: '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6),
            swatchD: '#000000',
            randomize: function() { randomize(); p.loop(); },
            shuffle: false,
            tidy: false,
            hex: true
        };

    p.setup = function () {
        var guiElt,
            a, b, c, d;
        // Set up sketch.
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER);
        p.noLoop();
        p.noStroke();
        p.textSize(12);
        p.textFont("Lucida Grande");
        p.textAlign(p.CENTER);
        p.textStyle(p.BOLD);
        // Set up config width and height.
        config.width = p.max(p.width/3, 200);
        config.height = p.max(p.height/8, 45);
        // Set up render arrays.
        positions = setPositions();
        rotations = setRotations(positions.length);
        palette = setPalette();
        targetPos = copy(positions);
        targetRot = rotations.slice();
        // Set up GUI in DOM.
        gui = new dat.GUI( { autoPlace: false } );
        guiElt = gui.domElement;
        document.getElementById('p5-sketch').appendChild(guiElt);
        guiElt.style.position = 'fixed';
        guiElt.style.left = '0px';
        guiElt.style.top = '0px';
        // Set up GUI color swatches.
        a = gui.addColor(data, 'swatchA').name("Color");
        b = gui.addColor(data, 'swatchB').name("Color");
        c = gui.addColor(data, 'swatchC').name("Color");
        d = gui.addColor(data, 'swatchD').name("Color");
        a.onChange( function() { palette = setPalette(); p.loop(); } );
        a.onFinishChange(function(){ sortUI(); p.loop(); });
        b.onChange( function() { palette = setPalette(); p.loop(); } );
        b.onFinishChange(function(){ sortUI(); p.loop(); });
        c.onChange( function() { palette = setPalette(); p.loop(); } );
        c.onFinishChange(function(){ sortUI(); p.loop(); });
        d.onChange( function() { palette = setPalette(); p.loop(); } );
        d.onFinishChange(function(){ sortUI(); p.loop(); });
        // Set up new palette button.
        gui.add(data,'randomize').name('New Palette');
        // Set up toggles.
        gui.add(data, 'shuffle').name('Shuffle').onFinishChange( function() {
            if (data.shuffle) { targetPos = shuffleY(targetPos); }
            else { targetPos = sortY(targetPos); }
            p.loop();
        });
        gui.add(data,'tidy').name('Tidy').onFinishChange( function() {
            if (data.tidy) { 
                targetPos = centerPositions(targetPos);
                targetRot = resetRotations(rotations.length);
            } else { 
                targetPos = setPositions();
                targetRot = setRotations(rotations.length);
            }
            p.loop();
        });
        gui.add(data, 'hex').name('Hex Codes').onFinishChange( function() {
            p.loop();
        });
        // Sort GUI color swatches.
        sortUI();
    };

    p.draw = function () {
        var loop = false,
            tran = translate(),
            rot = rotate();
        p.background('#DCDCDC');
        for (var i = 0; i < positions.length; i++) {
            var color = palette[i];
            p.fill(color);
            p.push();
            p.translate(positions[i].x, positions[i].y);
            p.rotate(rotations[i]);
            p.rect(0, 0, config.width, config.height);
            if (data.hex) {
                var textColor = (chroma.contrast('black', color) < 4.5) ? 255: 0;
                p.fill(textColor);
                p.text(palette[i], 0, -config.height/4, config.width, 0);
            }
            p.pop();
        }
        overwriteTextColor();
        if (!tran && !rot) { p.noLoop(); }
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        config.width = p.max(p.width/3, 200);
        config.height = p.max(p.height/8, 45);
        positions = setPositions();
        rotations = setRotations(positions.length);
        if (data.tidy) { 
            positions = centerPositions(positions);
            rotations = resetRotations(positions.length);
        }
        targetPos = copy(positions);
        targetRot = rotations.slice();
        if (data.shuffle) { targetPos = shuffleY(targetPos); }
        palette = setPalette();
        p.textSize(12);
        p.textFont("Lucida Grande");
        p.textAlign(p.CENTER);
        p.textStyle(p.BOLD);
        p.loop();
    };

    // Returns a deep copy of a vector array.
    function copy(array) {
        var result = [];
        for (var i = 0; i < array.length; i++) {
            result.push(array[i].copy());
        }
        return result;
    }

    // Updates positions array toward targetPos locations.
    function translate() {
        var loop = false;
        for (var i = 0; i < positions.length; i++) {
            var pos = positions[i];
                target = targetPos[i]
                stepx = 0,
                stepy = 0;
            if (target.x > pos.x) { stepx = 1; }
            if (target.x < pos.x) { stepx = -1; }
            stepx *= config.tranSpeed;
            if (p5.Vector.dist(target, pos) <= stepx) { positions[i].x = target.x; }
            else { positions[i].x += stepx; loop = true; }
            if (target.y > pos.y) { stepy = 1; }
            if (target.y < pos.y) { stepy = -1; }
            stepy *= 3 * config.tranSpeed;
            if (p5.Vector.dist(target, pos) <= stepy) { positions[i].y = target.y; }
            else { positions[i].y += stepy; loop = true; }
        }
        if (!loop) { return false; }
        else { return true; }
    }

    // Updates rotations array toward targetRot angles.
    function rotate() {
        var loop = false;
        for (var i = 0; i < rotations.length; i++) {
            var r = rotations[i],
                target = targetRot[i],
                step = 0;
            if (target > r) { step = 1; }
            if (target < r) { step = -1; }
            step = p.radians(step);
            if ( rotations[i].between(target + step, target - step, true) ) { rotations[i] = target; }
            else { rotations[i] += step; loop = true; }
        }
        if (!loop) { return false; }
        else { return true; }
    }

    // Returns a vector array of positions based on window dimensions.
    function setPositions() {
        var result = [],
            x = p.width/2,
            y = config.height * 1.25;
        while (y < p.windowHeight - config.height) {
            var xoff = p.random(-50, 50);
            result.push( new p5.Vector(x + xoff, y) );
            y += config.height * 0.75;
        }
        return result;
    }

    // Returns a copy of the input vector array sorted by lightness on the y-axis.
    function sortY(array) {
        var result = copy(array)
            home = setPositions();
        for (var i = 0; i < result.length; i++) {
            // Reassign current target y-position to home y-position.
            result[i].y = home[i].y;
        }
        return result;
    }

    // Returns a copy of the input vector array with the y-axis values shuffled.
    function shuffleY(array) {
        var result = copy(array),
            home = shuffleArray(setPositions());
        for (var i = 0; i < result.length; i++) {
            // Reassign current target y-position to a random home y-position.
            result[i].y = home[i].y;
        }
        return result;
    }

    // Returns an x-axis centered copy of input vector array based on sketch width.
    function centerPositions(array) {
        var result = copy(array);
        for (var i = 0; i < result.length; i++) {
            result[i].x = p.width/2;
        }
        return result;
    }

    // Returns an array of rotations (radians) of specified length.
    function setRotations(n) {
        var result = [];
        for (var i = 0; i < n; i++) {
            result.push(p.random(-p.PI/8, p.PI/8));
        }
        return result;
    }

    // Returns an array of 0s of specified length.
    function resetRotations(n) {
        var result = [];
        for (var i = 0; i < n; i++) {
            result.push(0);
        }
        return result;
    }

    // Generate new random swatches and palette.
    function randomize() {
        // TODO: Animate lerping from current to new color?
        data.swatchA = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        data.swatchB = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        data.swatchC = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        data.swatchD = '#' + ('00000' + Math.floor(Math.random()*16777216).toString(16)).substr(-6);
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
        palette = setPalette();
        if (data.shuffle) { targetPos = shuffleY(targetPos); }
        sortUI();
    }

    // Returns array of hex colors from chroma scale.
    function setPalette() {
        var l = [],
            bezInterpolator = null;
        config.chromaA = chroma(data.swatchA);
        config.chromaB = chroma(data.swatchB);
        config.chromaC = chroma(data.swatchC);
        config.chromaD = chroma(data.swatchD);
        l = [config.chromaA, config.chromaB, config.chromaC, config.chromaD];
        l.sort(function(a, b) {
          return b.get('hcl.l') - a.get('hcl.l');
        });
        bezInterpolator = chroma.bezier([l[0], l[1], l[2], l[3]])
        return chroma.scale(bezInterpolator).padding(0).correctLightness(true).colors(positions.length);
    }

    // Returns a shuffled copy of input array using Fisher-Yates method.
    // Caution: Uses a shallow copy of input.
    function shuffleArray (array) {
        var result = array.slice(),
            i = 0, 
            j = 0,
            temp = null;
        for (var i = result.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1));
            temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
        return result;
    }

    function overwriteTextColor() {
        var items = document.getElementsByClassName('color'),
            ul = items[0].parentElement,
            button = ul.getElementsByClassName('function')[0];
        for (var i = 0; i < items.length; i++) {
            var item = items[i],
                color = item.getElementsByClassName('c')[0].firstChild.value,
                input = item.getElementsByTagName('input')[0]
                flip = (chroma.contrast('black', color) < 4.5) ? 255 : 0,
                _flip = (flip === 0) ? 255 : 0;
            input.style.color = 'rgb(' + flip + ',' + flip + ',' + flip +')';
            input.style.textShadow = '0 1px 1px ' + 'rgba(' + _flip + ',' + _flip + ',' + _flip +', .7)';
        }
    }

    // Rearrange swatch list items in DOM according to lightness.
    function sortUI() {
        var items = document.getElementsByClassName('color'),
            ul = items[0].parentElement,
            button = ul.getElementsByClassName('function')[0],
            itemList = [];
        for (var i = 0; i < items.length; i++) {
            itemList.push(items[i]); 
        }
        itemList.sort( function(a, b) {
            var chromaA = chroma(a.getElementsByClassName('c')[0].firstChild.value),
                chromaB = chroma(b.getElementsByClassName('c')[0].firstChild.value);
            return chromaB.get('hcl.l') - chromaA.get('hcl.l');
        });
        for (var i = 0; i < itemList.length; i++) {
            ul.insertBefore(itemList[i], button);
        }
    }

    Number.prototype.between = function(a, b, inclusive) {
        var min = Math.min(a, b),
            max = Math.max(a, b);
        return inclusive ? this >= min && this <= max : this > min && this < max;
    }

}

window.onload = function() {
    // Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
    var p5sketch = new p5(sketch, 'p5-sketch');
};