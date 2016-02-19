var sketch = function (p) {
    var scale,
        bg,
        fg,
        // patterns = ['gridOfHBands', 'hStripes', 'vStripes'],
        patterns = ['grid', 'rowsOfGrids', 'hBands', 'vBands'],
        caps = ['rectangle', 'triangle', 'dome', 'trapezoid'],
        drawPattern,
        drawCap,
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
        var graphic = p.createGraphics(p.width, p.height);
        for (var y = 0; y <= p.height; y++) {
            var c = scale(y/p.height).rgb();
            graphic.stroke(c);
            graphic.line(0, y, p.width, y);
        }
        return graphic;
    }

    function makeForeground() {
        var graphic = p.createGraphics(p.width, p.height),
            setPos = makeSetPos(p.width);
        graphic.fill(scale(0.65).darken(2).rgb());
        graphic.noStroke(0);
        // DISTANT BUILDINGS
        for (var i = 0; i < 10; i++) {
            var x = p.random(-50, p.width - 100),
                y = p.height,
                w = p.random(50, 150),
                h = p.random(p.height/6, p.height * 0.5);
            graphic.rect(x, y, w, -h);
        }
        // CLOSE BUILDINGS
        for (var i = 0; i < 20; i++) {
            var pos = setPos(p.width, p.height);
            drawBuilding(graphic, pos, i);
        }
        return graphic;
    }

    function makeSetPos(width) {
        var buckets = [],
            limit = 1,
            numBuckets = Math.floor(width/50);
        for (var i = 0; i < numBuckets; i++) { buckets.push(0); }
        return function (w, y) {
            var tries = numBuckets/2,
                x, index;
            while (tries > 0) {
                x = p.random(0, w - 150);
                index = Math.floor(p.map(x, 0, w - 150, 0, buckets.length-1));
                if ( buckets[index] < limit ) {
                    buckets[index]++;
                    return p.createVector(x, y);
                }
                tries--;
            }
            limit++;
            buckets[index]++;
            return p.createVector(x, y);
        };

    }

    function drawBuilding(graphic, pos, n) {
        var lowerLeft = pos,
            w = p.random(50, 150),
            h = p.random(p.height/6, p.height * 0.5),
            cap = { bool: false, height: 0, pattern: undefined },
            body = { height: 0, pattern: undefined },
            base = { bool: false, height: 0, pattern: undefined };
        if (Math.random() > 0.3) {
            cap.bool = true;
            cap.height = p.ceil(h * (p.random(5, 10)/100));
            cap.width = w;
            cap.lowerLeft = p.createVector(lowerLeft.x, lowerLeft.y - h + cap.height);
            cap.pattern = caps[Math.floor(Math.random() * caps.length)];
        }
        // if (Math.random() > 0.5) {
        //     base.bool = true;
        //     base.height = p.ceil(h * (p.random(15, 20)/100));
        // }
        body.width = w;
        body.height = h - cap.height - base.height;
        body.pattern = patterns[Math.floor(Math.random() * patterns.length)];
        body.lowerLeft = p.createVector(lowerLeft.x, lowerLeft.y - base.height);

        // OUTLINES
        graphic.fill(0);
        graphic.stroke(scale(0.5).rgb());
        graphic.strokeWeight(2);
        graphic.strokeJoin(p.MITER);
        if (base.bool) { graphic.rect(lowerLeft.x, lowerLeft.y, w, -base.height); }
        drawPattern[body.pattern](body, graphic);
        graphic.noFill();
        graphic.stroke(scale(0.5).rgb());
        graphic.strokeWeight(2);
        graphic.strokeJoin(p.MITER);
        graphic.rect(body.lowerLeft.x, body.lowerLeft.y, body.width, -body.height);
        if (cap.bool) { drawCap[cap.pattern](cap, graphic); }

        // debug
        // graphic.text(n, lowerLeft.x, lowerLeft.y - h + cap.height);
        // console.log(n, body.pattern, body.width);
    }

    drawCap = {
        rectangle: function(component, graphic) {
            Math.random() > 0.5 ? graphic.fill(scale(0.5).darken().rgb()) : graphic.fill(0);
            graphic.stroke(scale(0.5).rgb());
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.MITER);
            graphic.rect(component.lowerLeft.x, component.lowerLeft.y, component.width, -component.height);
        },
        trapezoid: function(component, graphic) {
            var incline = p.random(component.width * 0.05, component.width * 0.4),
                // points counterclockwise
                // left base
                x1 = component.lowerLeft.x,
                y1 = component.lowerLeft.y,
                // right base
                x2 = x1 + component.width,
                y2 = y1,
                // top right
                x3 = x2 - incline,
                y3 = y1 - component.height,
                // top left
                x4 = x1 + incline,
                y4 = y3;
            Math.random() > 0.5 ? graphic.fill(scale(0.5).darken().rgb()) : graphic.fill(0);
            graphic.stroke(scale(0.5).rgb());
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.BEVEL);
            graphic.quad(x1, y1, x2, y2, x3, y3, x4, y4);
        },
        triangle: function(component, graphic) {
            Math.random() > 0.5 ? graphic.fill(scale(0.5).darken().rgb()) : graphic.fill(0);
            graphic.stroke(scale(0.5).rgb());
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.BEVEL);
            var chance = Math.random(),
                x1 = component.lowerLeft.x,
                y1 = component.lowerLeft.y,
                x2 = x1 + component.width,
                y2 = y1,
                x3 = x2, // default left corner 90
                y3 = y1 - component.height;
            // isos
            if (chance < 1/3) { x3 = x1 + component.width/2; }
            // right corner 90
            if (chance > 2/3) { x3 = x1; }
            graphic.triangle(x1, y1, x2, y2, x3, y3);
        },
        dome: function(component, graphic) {
            Math.random() > 0.5 ? graphic.fill(scale(0.5).darken().rgb()) : graphic.fill(0);
            graphic.stroke(scale(0.5).rgb());
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.BEVEL);
            var x = component.lowerLeft.x + component.width/2,
                y = component.lowerLeft.y;
            graphic.arc(x, y, component.width, component.height, p.PI, 0, p.CHORD);
        },

    };

    drawPattern = {
        rowsOfGrids: function(component, graphic) {
            var rows = Math.floor(Math.random() * ( Math.floor(component.height/50) - 2 + 1)) + 2,
                margin = p.random(10, 30),
                space = Math.ceil((component.width - margin)/p.random(4,8)),
                size = space * p.random(0.25, 0.5),
                divider = Math.random() > 0.5 ? true : false;
            // graphic.stroke(scale(0.5).rgb());
            // graphic.strokeWeight(3);
            // graphic.rect(component.lowerLeft.x, component.lowerLeft.y, component.width, -component.height);
            for (var i = 0; i < rows; i++) {
                var body = {
                        width: component.width,
                        height: component.height/rows,
                        lowerLeft: p.createVector(component.lowerLeft.x, component.lowerLeft.y - (component.height/rows) * i),
                        space: space,
                        size: size,
                        margin: margin,
                        divider: divider,
                    };
                this.grid(body, graphic);
            }
            graphic.noFill();
            graphic.stroke(scale(0.5).rgb());
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.MITER);
            graphic.rect(component.lowerLeft.x, component.lowerLeft.y, component.width, -component.height);
        },
        grid: function(component, graphic) {
            var margin = component.margin || p.random(10, 30),
                space = component.space || Math.ceil((component.width - margin)/p.random(4,8)),
                size = component.size || space * p.random(0.25, 0.5),
                xm = Math.ceil((component.width - margin) / space),
                ym = Math.ceil((component.height - margin) / space),
                h = component.height,
                w = component.width - xm/2,
                m = 0;
            if ( component.divider !== false) {
                graphic.stroke(scale(0.5).darken().rgb());
            }
            else { graphic.stroke(0); }
            graphic.strokeWeight(2);
            graphic.fill(0);
            graphic.strokeJoin(p.MITER);
            graphic.rect(component.lowerLeft.x, component.lowerLeft.y, component.width, -component.height);
            //debug
            // graphic.stroke(scale(0.5).darken().rgb());
            // graphic.rect(component.lowerLeft.x + margin/2, component.lowerLeft.y - margin/2, component.width - margin, -component.height + margin);

            graphic.push();
            graphic.translate(component.lowerLeft.x, component.lowerLeft.y - component.height);
            graphic.rectMode(graphic.CENTER);
            graphic.stroke(scale(0.5).darken().rgb());
            graphic.fill(scale(0.5).darken().rgb());
            graphic.strokeJoin(p.MITER);
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
            graphic.fill(0);
            graphic.stroke(scale(0.5).rgb());
            graphic.strokeWeight(2);
            graphic.rect(component.lowerLeft.x, component.lowerLeft.y, component.width, -component.height);
            graphic.stroke(scale(0.5).darken().rgb());
            graphic.strokeWeight(2);
            // graphic.rect(component.lowerLeft.x + xmargin/2, component.lowerLeft.y - ymargin/2, component.width - xmargin, -component.height + ymargin);
            for (var i = 0; i < cols - 1; i++) {
                var x = component.lowerLeft.x + xmargin/2 + w/cols + (w/cols) * i;
                graphic.line(x, y1, x, y2);
            }
            graphic.noFill();
            graphic.stroke(scale(0.5).rgb());
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.MITER);
            graphic.rect(component.lowerLeft.x, component.lowerLeft.y, component.width, -component.height);
        },
        hBands: function(component, graphic) {
            var xmargin = p.ceil(component.width * (p.random(1, 20)/100)),
                ymargin = p.ceil(component.height * (p.random(1, 20)/100)),
                h = component.height - ymargin,
                rows = Math.floor(p.constrain(p.random(5, 20), 5, h/3)),
                x1 = component.lowerLeft.x + xmargin/2,
                x2 = x1 + component.width - xmargin;
            graphic.fill(0);
            graphic.stroke(scale(0.5).rgb());
            graphic.strokeWeight(2);
            graphic.rect(component.lowerLeft.x, component.lowerLeft.y, component.width, -component.height);
            graphic.stroke(scale(0.5).darken().rgb());
            graphic.strokeWeight(2);
            // graphic.rect(component.lowerLeft.x + xmargin/2, component.lowerLeft.y - ymargin/2, component.width - xmargin, -component.height + ymargin);
            for (var i = 0; i < rows - 1; i++) {
                var y = component.lowerLeft.y - ymargin/2 - h/rows - (h/rows) * i;
                graphic.line(x1, y, x2, y);
            }
            graphic.noFill();
            graphic.stroke(scale(0.5).rgb());
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.MITER);
            graphic.rect(component.lowerLeft.x, component.lowerLeft.y, component.width, -component.height);
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