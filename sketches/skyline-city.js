var sketch = function (p) {
    var scale,
        bg,
        fg,
        // patterns = ['gridOfHBands', 'hStripes', 'vStripes'],
        patterns = ['grid', 'hBands', 'vBands', 'rowsOfGrids'],
        drawPattern,
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
        // DISTANT BUILDINGS
        for (var i = 0; i < 10; i++) {
            var x = p.random(-50, p.width - 150),
                y = p.height,
                w = p.random(100, 300),
                h = p.random(p.height * 0.75, p.height/6);
            graphic.rect(x, y, w, -h);
        }
        // CLOSE BUILDINGS
        for (var i = 0; i < 10; i++) {
            drawBuilding(graphic);
        }
        return graphic;
    }

    function drawBuilding(graphic) {
        var lowerLeft = p.createVector(p.random(-50, p.width - 150), p.height),
            w = p.random(100, 300),
            h = p.random(p.height * 0.75, p.height/6),
            cap = { bool: false, height: 0, pattern: undefined },
            body = { height: 0, pattern: undefined },
            base = { bool: false, height: 0, pattern: undefined };
        if (Math.random() > 0.5) {
            cap.bool = true;
            cap.height = p.ceil(h * (p.random(15, 30)/100));
        }
        if (Math.random() > 0.5) {
            base.bool = true;
            base.height = p.ceil(h * (p.random(10, 20)/100));
        }
        body.width = w;
        body.height = h - cap.height - base.height;
        body.pattern = patterns[Math.floor(Math.random() * patterns.length)];
        body.lowerLeft = p.createVector(lowerLeft.x, lowerLeft.y - base.height);

        // OUTLINES
        graphic.fill(0);
        graphic.stroke(scale(0.5).rgb());
        graphic.strokeWeight(3);
        graphic.rect(lowerLeft.x, lowerLeft.y - base.height, w, -body.height);
        if (cap.bool) { graphic.rect(lowerLeft.x, lowerLeft.y - h, w, cap.height); }
        if (base.bool) { graphic.rect(lowerLeft.x, lowerLeft.y, w, -base.height); }
        drawPattern[body.pattern](body, graphic);
    }

    drawPattern = {
        rowsOfGrids: function(component, graphic) {
            var rows = 3,
                space = Math.floor(p.random(20, 30)),
                size = space - Math.floor(p.random(5, 10)),
                margin = p.random(10, 30);
            for (var i = 0; i < rows; i++) {
                var body = {
                        width: component.width,
                        height: component.height/3,
                        lowerLeft: p.createVector(component.lowerLeft.x, component.lowerLeft.y - (component.height/3) * i),
                        space: space,
                        size: size,
                        margin: margin,
                    };
                this.grid(body, graphic);
                graphic.line(body.lowerLeft.x, body.lowerLeft.y, body.lowerLeft.x + body.width, body.lowerLeft.y);
            }
        },
        grid: function(component, graphic) {
            var space = component.space || Math.floor(p.random(20, 30)),
                size = component.size || space - Math.floor(p.random(5, 10)),
                margin = component.margin || p.random(10, 30),
                xm = Math.ceil((component.width - margin) / space),
                ym = Math.ceil((component.height - margin) / space),
                h = component.height,
                w = component.width - xm/2,
                m = 0;
            graphic.stroke(scale(0.5).darken().rgb());
            // graphic.rect(component.lowerLeft.x + margin/2, component.lowerLeft.y - margin/2, component.width - margin, -component.height + margin);
            graphic.push();
            graphic.translate(component.lowerLeft.x, component.lowerLeft.y - component.height);
            graphic.rectMode(graphic.CENTER);
            graphic.fill(scale(0.5).darken().rgb());
            for (var y = h/2 + space/2; y < h - margin/2 - size/2; y += space) {
                var n = 0;
                for (var x = component.width/2 + space/2; x < component.width - margin/2 - size/2; x += space) {
                    graphic.push();
                    graphic.translate(x, y);
                    graphic.rect(0, 0, size, size),
                    graphic.pop();

                    graphic.push();
                    graphic.translate(component.width/2 - space/2 - space * n, y);
                    graphic.rect(0, 0, size, size),
                    graphic.pop();

                    graphic.push();
                    graphic.translate(x, h/2 - space/2 - space * m);
                    graphic.rect(0, 0, size, size),
                    graphic.pop();

                    graphic.push();
                    graphic.translate(component.width/2 - space/2 - space * n, h/2 - space/2 - space * m);
                    graphic.rect(0, 0, size, size),
                    graphic.pop();

                    n++;
                }
                m++;
            }
            graphic.pop();
        },
        vBands: function(component, graphic) {
            var xmargin = p.ceil(component.width * (p.random(1, 20)/100)),
                ymargin = p.ceil(component.height * (p.random(1, 20)/100)),
                w = component.width - xmargin,
                cols = Math.floor(p.constrain(p.random(5, 20), 5, w/3)),
                y1 = component.lowerLeft.y - ymargin/2,
                y2 = y1 - component.height + ymargin;
            graphic.stroke(scale(0.5).darken().rgb());
            graphic.strokeWeight(3);
            // graphic.rect(component.lowerLeft.x + xmargin/2, component.lowerLeft.y - ymargin/2, component.width - xmargin, -component.height + ymargin);
            for (var i = 0; i < cols - 1; i++) {
                var x = component.lowerLeft.x + xmargin/2 + w/cols + (w/cols) * i;
                graphic.line(x, y1, x, y2);
            }
        },
        hBands: function(component, graphic) {
            var xmargin = p.ceil(component.width * (p.random(1, 20)/100)),
                ymargin = p.ceil(component.height * (p.random(1, 20)/100)),
                h = component.height - ymargin,
                rows = Math.floor(p.constrain(p.random(5, 20), 5, h/3)),
                x1 = component.lowerLeft.x + xmargin/2,
                x2 = x1 + component.width - xmargin;
            graphic.stroke(scale(0.5).darken().rgb());
            graphic.strokeWeight(3);
            // graphic.rect(component.lowerLeft.x + xmargin/2, component.lowerLeft.y - ymargin/2, component.width - xmargin, -component.height + ymargin);
            for (var i = 0; i < rows - 1; i++) {
                var y = component.lowerLeft.y - ymargin/2 - h/rows - (h/rows) * i;
                graphic.line(x1, y, x2, y);
            }
        },

    };

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

    function setScale() {
        var l = [chroma.random(), chroma.random(), chroma.random(), chroma.random()],
            bezInterpolator = null
            chance = Math.random();
        if (chance > 0.5) {
            l.sort(function(a, b) {
              return b.get('hcl.l') - a.get('hcl.l');
            });
        } else {
            l.sort(function(a, b) {
                return a.get('hcl.l') - b.get('hcl.l');
            });
        }
        bezInterpolator = chroma.bezier([l[0], l[1], l[2], l[3]]);
        return chroma.scale(bezInterpolator).correctLightness(true);
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');