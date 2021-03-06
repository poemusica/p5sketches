var sketch = function (p) {
    var positions = [],
        rotations = [],
        colors = [],
        strokes = [],
        config = {
            width: 50,
            height: 50, //100,
            colors: [],
            alpha: 0.5
        };

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.ellipseMode(p.CORNER);
        init();
    };

    p.draw = function () {
        var s1 = colors.slice(0, positions.length/2),
            s2 = colors.slice(positions.length/2, positions.length - 1)
            index = 0;
        for (var i = 0; i < positions.length; i++) {
            p.noStroke();
            //p.stroke(colors[i]);
            //if (i % 2) { p.stroke(s1[i % s1.length]); }
            //else { p.stroke(s2[i % s2.length]); }
            index = Math.round(p.map(p.noise(positions[i].x/500, positions[i].y/500, p.frameCount/100), 0, 1, 0, colors.length - 1));
            p.fill(colors[index]);
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
        colors = setPalette();
    }

    // Returns an array of positions based on window dimensions.
    function setPosAndRot() {
        var y = -config.height,
            stepx = 0.01,
            stepy = 100,
            prevR = p.random(-p.PI/12, p.PI/12);
        positions = [];
        rotations = [];
        while (y < p.height + config.height) {
            var x = 0;
            while(x < p.width) {
                var newR = prevR + p.map(p.noise(stepx, stepy), 0, 1, -p.PI/6, p.PI/6);
                rotations.push(newR);
                positions.push( new p5.Vector(x, y) );
                x += config.width * 0.25;
                stepx += 0.005;
                prevR = newR;
            }
            y += config.height * 0.25;
            stepy += 0.005;
        }
    }

    // COLOR
    // Returns array of hex colors from chroma scale.
    function setPalette() {
        var bases = [],
            bezInterpolator = null,
            bez2 = null;
        for (var i = 0; i < 7; i++) {
            bases.push(chroma.random());
        }
        bases.sort(function(a, b) {
          return b.get('hcl.l') - a.get('hcl.l');
        });
        bezInterpolator = chroma.bezier([bases[0], bases[2], bases[4], bases[6]]);
        bez2 = chroma.bezier([bases[0], bases[1], bases[3], bases[5]]);
        var scale1 = chroma.scale(bezInterpolator).padding(0).correctLightness(true).colors(positions.length/2),
            scale2 = chroma.scale(bez2).padding(0).correctLightness(true).colors(positions.length/2)
            result = scale1.reverse().concat(scale2);
        if (Math.random() > 0.5) { result.reverse(); }
        return result;
    }

}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');