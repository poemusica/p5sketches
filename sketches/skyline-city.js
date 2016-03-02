var sketch = function (p) {
    var scale,
        gradient,
        city,
        stars,
        caps,
        textures,
        distributors;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        scale = setScale();
        gradient = makeGradient();
        city = makeCity();
        stars = makeStars();
        stars.rotation = 0;
    };

    p.draw = function () {
        p.imageMode(p.CORNER);
        p.image(gradient, 0, 0, gradient.width, gradient.height, 0, 0, p.width, p.height);
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

        p.image(city, 0, 0, city.width, city.height, 0, 0, p.width, p.height);
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        gradient = makeGradient();
        city = makeCity();
        stars = makeStars();
        stars.rotation = 0;
    };

    function makeGradient() {
        var graphic = p.createGraphics(p.width, p.height);
        for (var y = 0; y <= p.height; y++) {
            var c = scale(y/p.height).rgb();
            graphic.stroke(c);
            graphic.line(0, y, p.width, y);
        }
        return graphic;
    }

    function makeCity() {
        var graphic = p.createGraphics(p.width, p.height),
            bgDistributor = distributors.makeThirds(graphic.width),
            fgDistributor = distributors.makeHalves(graphic.width),
            bgProb = p.random(0.5, 0.85),
            fgProb = p.random(0.5, 0.85),
            bgCount= 0,
            fgCount = 0;
        graphic.fill(scale(0.65).darken(2).rgb());
        graphic.noStroke(0);
        while (bgCount < 15) {
            var x = bgDistributor();
            if (p.random() < bgProb) {
                var width = p.random(50, 100),
                    height = p.random(graphic.height/6, graphic.height * 0.4)
                    loc = p.createVector(x - width/2, graphic.height);
                graphic.rect(loc.x, loc.y - height, width, height);
                bgCount++;
            }
        }

        graphic.fill(0);
        graphic.stroke(scale(0.5).brighten().rgb());
        graphic.strokeWeight(2);
        textures.color = p.color(scale(0.5).rgb());
        caps.stroke = p.color(scale(0.5).brighten().rgb());
        caps.fill = p.color(scale(0.5).rgb());

        while (fgCount < 20) {
            var x = fgDistributor();
            if (p.random() < fgProb) {
                var width = p.random(50, 125),
                    height = p.random(graphic.height/6, graphic.height * 0.4)
                    loc = p.createVector(x - width/2, graphic.height),
                    capH = p.random() > 0.3 ? p.ceil(height * (p.random(5, 10)/100)) : 0;
                    bodyH = height - capH,
                    bodyTx = textures.index[Math.floor(Math.random() * textures.index.length)];
                graphic.rect(loc.x, loc.y - bodyH, width, bodyH);
                bodyTx(p.createVector(loc.x, loc.y - bodyH), width, bodyH, graphic);
                if (capH > 0) {
                    capTx = caps.index[Math.floor(Math.random() * caps.index.length)];
                    capTx(p.createVector(loc.x, loc.y - bodyH), width, capH, graphic);
                }
                fgCount++;
            }
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

    distributors = function() {
        var module = {};
        module.index = [];

        module.makeHalves = function(w) {
            var divisor = 2,
                xDivs = [],
                start = 0,
                sign = -1,
                j = 0,
                end = 0;
            return function () {
                var x;
                if (xDivs.length === 0) {
                    x = w/2;
                    xDivs.push(x);
                    divisor *= 2;
                } else {
                    var prev = xDivs[j],
                        space = w/divisor * sign;
                    x = prev + space;
                    xDivs.push(x);
                    if (sign > 0) { j--; }
                    sign *= -1;
                }
                if (j < end) {
                    end = xDivs.length - divisor/2;
                    start = xDivs.length - 1;
                    divisor *= 2;
                    j = start;
                }
                return x;
            };
        };
        module.index.push(module.halves);

        module.makeThirds = function(w) {
            var divisor = 3,
                xDivs = [],
                start = 0,
                end = -1,
                j = 0;
            return function() {
                var x;
                if (xDivs.length === 0) { x = w/divisor; }
                else if (j == end) { x = w - w/divisor; }
                else { x = xDivs[j] - w/divisor; }
                xDivs.push(x);
                j--;
                if (j < end) {
                    end = -1;
                    start = xDivs.length - 1;
                    j = start;
                    divisor *= 2;
                }
                return x;
            };
        };
        module.index.push(module.thirds);

        return module;
    }();

    caps = function() {
        var module = {};
        module.index = [];
        module.stroke = null;
        module.fill = null;

        module.rectangle = function(loc, w, h, graphic) {
            graphic.push();
            Math.random() > 0.5 ?  graphic.fill(module.fill) : graphic.fill(0);
            graphic.stroke(module.stroke);
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.MITER);
            graphic.translate(loc.x, loc.y - h);
            graphic.rect(0, 0, w, h);
            graphic.pop();
        };
        module.index.push(module.rectangle);

        module.trapezoid = function(loc, w, h, graphic) {
            graphic.push();
            var incline = p.random(w * 0.05, w * 0.4),
                // points counterclockwise
                // left base
                x1 = loc.x,
                y1 = loc.y,
                // right base
                x2 = x1 + w,
                y2 = y1,
                // top right
                x3 = x2 - incline,
                y3 = y1 - h,
                // top left
                x4 = x1 + incline,
                y4 = y3;
            Math.random() > 0.5 ?  graphic.fill(module.fill) : graphic.fill(0);
            graphic.stroke(module.stroke);
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.BEVEL);
            graphic.quad(x1, y1, x2, y2, x3, y3, x4, y4);
            graphic.pop();
        };
        module.index.push(module.trapezoid);

        module.triangle = function(loc, w, h, graphic) {
            graphic.push();
            Math.random() > 0.5 ?  graphic.fill(module.fill) : graphic.fill(0);
            graphic.stroke(module.stroke);
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.BEVEL);
            var chance = Math.random(),
                x1 = loc.x,
                y1 = loc.y,
                x2 = x1 + w,
                y2 = y1,
                x3 = x2, // default left corner 90
                y3 = y1 - h;
            // isos
            if (chance < 1/3) { x3 = x1 + w/2; }
            // right corner 90
            if (chance > 2/3) { x3 = x1; }
            graphic.triangle(x1, y1, x2, y2, x3, y3);
            graphic.pop();
        };
        module.index.push(module.triangle);

        module.dome = function(loc, w, h, graphic) {
            graphic.push();
            Math.random() > 0.5 ?  graphic.fill(module.fill) : graphic.fill(0);
            graphic.stroke(module.stroke);
            graphic.strokeWeight(2);
            graphic.strokeJoin(p.BEVEL);
            var x = loc.x + w/2,
                y = loc.y;
            graphic.arc(x, y, w, h, p.PI, 0, p.CHORD);
            graphic.pop();
        };
        module.index.push(module.dome);

        return module;
    }();

    textures = function(){
        var module = {};
        module.index = [];
        module.color = null;

        function makeGrid(rows, cols, width, height) {
            var grid = {
                grid: [],
                rows: rows,
                cols: cols,
                width: width,
                height: height,
                cellWidth: width/cols,
                cellHeight: height/rows,
                },
                y = 0;
            for (var r = 0; r < rows; r++) {
                var x = 0;
                for (var c = 0; c < cols; c++) {
                    grid.grid.push(p.createVector(x, y));
                    x += width/cols;
                }
            y += height/rows;
            }
            return grid;
        }

        module.colsOfHLines = function(loc, w, h, graphic) {
            graphic.push();
            graphic.stroke(module.color);
            var rows = Math.round(p.random(25, 50)),
                cols = Math.round(p.random(3, 8));
            var margin = p.createVector(2, 2),
                padding = p.createVector(
                        p.random(2, (w - 2 * margin.x)/cols * 0.25), 0);
            while ((w - 2*margin.x - 2*padding.x*cols)/cols < 5) { cols--; }
            while ((h - 2*margin.y - 2*padding.y*rows)/rows < 5) { rows--; }
            var grid = makeGrid(rows, cols,
                                w - 2*margin.x - 2*padding.x,
                                h - 2*margin.y - 2*padding.y);
            var offset = p5.Vector.add(loc, margin);
            offset.add(padding);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i];
                graphic.line(cell.x + padding.x,
                             cell.y + grid.cellHeight/2,
                             cell.x + grid.cellWidth - padding.x,
                             cell.y + grid.cellHeight/2);
            }
            graphic.pop();
        };
        module.index.push(module.colsOfHLines);

        module.rowsOfVLines = function(loc, w, h, graphic) {
            graphic.push();
            graphic.stroke(module.color);
            var rows = Math.round(p.random(3, 10)),
                cols = Math.round(p.random(10, 30));
            var margin = p.createVector(2, 2),
                padding = p.createVector(
                        0, p.random(2, (h - 2 * margin.y)/rows * 0.25));
            while ((w - 2*margin.x - 2*padding.x*cols)/cols < 5) { cols--; }
            while ((h - 2*margin.y - 2*padding.y*rows)/rows < 5) { rows--; }
            var grid = makeGrid(rows, cols,
                                w - 2*margin.x - 2*padding.x,
                                h - 2*margin.y - 2*padding.y);
            var offset = p5.Vector.add(loc, margin);
            offset.add(padding);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i];
                graphic.line(cell.x + grid.cellWidth/2,
                             cell.y + padding.y,
                             cell.x + grid.cellWidth/2,
                             cell.y + grid.cellHeight - padding.y);
            }
            graphic.pop();
        };
        module.index.push(module.rowsOfVLines);

        module.hLines = function(loc, w, h, graphic) {
            graphic.push();
            graphic.stroke(module.color);
            var rows = Math.round(p.random(10, h/5)),
                cols = 1,
                margin = p.createVector(3, 3),
                offset = p5.Vector.add(loc, margin),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y);
            graphic.strokeJoin(p.BEVEL);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i];
                graphic.line(cell.x,
                             cell.y + grid.cellHeight/2,
                             cell.x + grid.cellWidth,
                             cell.y + grid.cellHeight/2);
            }
            graphic.pop();
        };
        module.index.push(module.hLines);

        module.vLines = function(loc, w, h, graphic) {
            graphic.push();
            graphic.stroke(module.color);
            var rows = 1,
                cols = Math.round(p.random(10, w/5)),
                margin = p.createVector(3, 3),
                offset = p5.Vector.add(loc, margin),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y);
            graphic.strokeJoin(p.BEVEL);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i];
                graphic.line(cell.x + grid.cellWidth/2,
                             cell.y,
                             cell.x + grid.cellWidth/2,
                             cell.y + grid.cellHeight);
            }
            graphic.pop();
        };
        module.index.push(module.vLines);

        module.hStripes = function(loc, w, h, graphic) {
            graphic.push();
            graphic.stroke(module.color);
            var rows = Math.round(p.random(h/60, h/50)),
                cols = 1,
                margin = p.createVector(3, 3),
                offset = p5.Vector.add(loc, margin),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y),
                thins = [0, 1, 2, 3, 4, 5],
                fixed = Math.floor(Math.random() * thins.length),
                pattern = [fixed],
                weight = 2;
            thins.splice(fixed, 1);
            for (var i = 0; i < 3; i++) {
                var index = Math.floor(Math.random() * thins.length);
                if ( p.random() > 0.5) {
                    pattern.push(thins[index]);
                    thins.splice(index, 1);
                }
            }
            pattern.push(2.5);
            pattern.sort();
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i],
                    yoff = grid.cellHeight/(pattern.length + 1);
                graphic.stroke(module.color);
                for (var j = 0; j < pattern.length; j++) {
                    if (pattern[j] === 2.5) {
                        graphic.strokeWeight(8);
                        graphic.strokeCap(p.SQUARE);
                        graphic.line(cell.x, cell.y + yoff * (j + 1),
                                 cell.x + grid.cellWidth, cell.y + yoff * (j + 1));
                    } else {
                        graphic.strokeCap(p.ROUND);
                        graphic.strokeWeight(2);
                        graphic.line(cell.x + 2, cell.y + yoff * (j + 1),
                                 cell.x - 2 + grid.cellWidth, cell.y + yoff * (j + 1));
                    }
                }
            }
            graphic.pop();
        };
        module.index.push(module.hStripes);


        module.rects = function(loc, w, h, graphic) {
            graphic.push();
            graphic.fill(module.color);
            graphic.noStroke();
            var rows = Math.round(p.random(3, 10)),
                cols = Math.round(p.random(3, 10)),
                margin = p.createVector(p.random(0, w * 0.15),
                                        p.random(0, h * 0.05)),
                padding = p.createVector(
                        p.random(5, (w - 2 * margin.x)/cols * 0.25),
                        p.random(5, (h - 2 * margin.y)/rows * 0.25));

            while ((w - 2*margin.x - 2*padding.x*cols)/cols < 5) { cols--; }
            while ((h - 2*margin.y - 2*padding.y*rows)/rows < 5) { rows--; }
            var grid = makeGrid(rows, cols,
                                w - 2 * margin.x,
                                h - 2 * margin.y);
            var offset = p5.Vector.add(loc, margin);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i];
                graphic.rect(cell.x + padding.x,
                             cell.y + padding.y,
                             grid.cellWidth - 2 * padding.x,
                             grid.cellHeight - 2 * padding.y);
            }
            graphic.pop();
        };
        module.index.push(module.rects);

        module.rowsOfRects = function(loc, w, h, graphic) {
            graphic.push();
            graphic.fill(module.color);
            graphic.noStroke();
            var rows = Math.round(p.random(h/60, h/45)),
                cols = 1,
                margin = p.createVector(8, 8),
                padding = p.createVector(0, 6),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y),
                innerRows = Math.round(p.random(2, 4)),
                innerCols = Math.round(p.random(3, 5)),
                innerPadding = p.createVector(2, 2),
                innerGrid = makeGrid(innerRows, innerCols,
                                     grid.cellWidth - 2*padding.x,
                                     grid.cellHeight - 2*padding.y);
            graphic.translate(loc.x, loc.y);
            graphic.translate(margin.x, margin.y);
            for (var i = 0; i < grid.grid.length; i++) {
                graphic.push();
                var cell = grid.grid[i];
                graphic.translate(cell.x, cell.y);
                graphic.translate(padding.x, padding.y);
                for (var j = 0; j < innerGrid.grid.length; j++) {
                    var innerCell = innerGrid.grid[j];
                    graphic.rect(innerCell.x + innerPadding.x,
                                 innerCell.y + innerPadding.y,
                                 innerGrid.cellWidth - 2 * innerPadding.x,
                                 innerGrid.cellHeight - 2 * innerPadding.y);
                }
                graphic.pop();
            }
            graphic.pop();
        };
        module.index.push(module.rowsOfRects);

        module.rowsOfRectsDivided = function(loc, w, h, graphic) {
            graphic.push();
            graphic.fill(module.color);
            graphic.noStroke();
            var rows = Math.round(p.random(h/60, h/45)),
                cols = 1,
                margin = p.createVector(8, 8),
                padding = p.createVector(0, 6),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y),
                innerRows = Math.round(p.random(2, 4)),
                innerCols = Math.round(p.random(3, 5)),
                innerPadding = p.createVector(2, 2),
                innerGrid = makeGrid(innerRows, innerCols,
                                     grid.cellWidth - 2*padding.x,
                                     grid.cellHeight - 2*padding.y);
            graphic.translate(loc.x, loc.y);
            graphic.translate(margin.x, margin.y);
            for (var i = 0; i < grid.grid.length; i++) {
                graphic.push();
                var cell = grid.grid[i];
                graphic.translate(cell.x, cell.y);
                if (i !== 0) {
                    graphic.push();
                    graphic.stroke(module.color);
                    graphic.line(-margin.x+2, 0, grid.cellWidth + margin.x-2, 0);
                    graphic.pop();
                }
                graphic.translate(padding.x, padding.y);
                for (var j = 0; j < innerGrid.grid.length; j++) {
                    var innerCell = innerGrid.grid[j];
                    graphic.rect(innerCell.x + innerPadding.x,
                                 innerCell.y + innerPadding.y,
                                 innerGrid.cellWidth - 2 * innerPadding.x,
                                 innerGrid.cellHeight - 2 * innerPadding.y);
                }
                graphic.pop();
            }
            graphic.pop();
        };
        module.index.push(module.rowsOfRectsDivided);

        return module;
    }();
}


// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');