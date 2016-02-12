var sketch = function (p) {
    var scale,
        bg,
        fg,
        stars;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        scale = setScale();
        bg = makeBackground();
        fg = makeForeground();
        stars = makeStars();
        stars.rotation = 0;
    };

    p.draw = function () {
        p.imageMode(p.CORNER);
        p.image(bg, 0, 0, bg.width, bg.height, 0, 0, p.width, p.height);
        p.stroke(255);
        p.push();
        p.rotate(stars.rotation);
        for (var i = 0; i < stars.length; i++) {
            var v = stars[i];
            p.strokeWeight(v.size + p.random(-0.5, 0.5));
            p.point(v.x, v.y);
        }
        stars.rotation -= 0.0003;
        p.pop();

        p.image(fg, 0, 0, fg.width, fg.height, 0, 0, p.width, p.height);
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        bg = makeBackground();
        fg = makeForeground();
        stars = makeStars();
        stars.rotation = 0;
    };

    function makeBackground() {
        var graphic = p.createGraphics(p.width * 2, p.height * 2);
        for (var y = 0; y <= p.height; y++) {
            var c = scale(y/p.height).rgb();
            graphic.stroke(c);
            graphic.line(0, y, p.width, y);
        }
        return graphic;
    }

    function makeForeground() {
        var graphic = p.createGraphics(p.width * 2, p.height * 2);
        graphic.fill(scale(0.65).darken(2).rgb());
        graphic.noStroke(0);
        for (var i = 0; i < 10; i++) {
            var x = p.random(-50, p.width - 150),
                y = p.height,
                w = p.random(100, 300),
                h = p.random(p.height * 0.75, p.height/6);
            graphic.rect(x, y, w, -h);
        }
        graphic.fill(0);
        graphic.stroke(scale(0.5).rgb());
        graphic.strokeWeight(3);
        for (var i = 0; i < 10; i++) {
            var x = p.random(-50, p.width - 150),
                y = p.height,
                w = p.random(100, 300),
                h = p.random(p.height * 0.65, p.height/6);
            graphic.rect(x, y, w, -h);
        }
        return graphic;

    }

    function makeStars() {
        var result = [],
            radius = p.max(p.width, p.height) * 2;
        for (var i = 0; i < 10000; i++) {
            var v = p.createVector(p.random(-radius, radius), p.random(-radius, radius));
            v.size = p.random(1, 5);
            result.push(v);
        }
        return result;
    }

    // function makeStars() {
    //     var graphic = p.createGraphics(200, 200);
    //     graphic.noFill();
    //     graphic.stroke(0);
    //     graphic.strokeWeight(2);
    //     graphic.ellipse(graphic.width/2, graphic.height/2, 10, 10);
    //     return graphic;
    // }

    function setScale() {
        var l = [chroma.random(), chroma.random(), chroma.random(), chroma.random()],
            bezInterpolator = null;
        l.sort(function(a, b) {
          return b.get('hcl.l') - a.get('hcl.l');
        });
        bezInterpolator = chroma.bezier([l[0], l[1], l[2], l[3]]);
        return chroma.scale(bezInterpolator).correctLightness(true);
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');