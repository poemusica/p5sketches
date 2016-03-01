var sketch = function (p) {
    var scale,
        bg,
        fg,
        // patterns = ['gridOfHBands', 'hStripes', 'vStripes'],
        // patterns = ['grid', 'rowsOfGrids', 'hBands', 'vBands'],
        caps = ['rectangle', 'triangle', 'dome', 'trapezoid'],
        drawPattern,
        drawCap,
        stars,
        textures;

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
        var graphic = p.createGraphics(p.width, p.height);
        graphic.fill(175);
        graphic.rect(100, 100, 100, 150);
        textures.rects(p.createVector(100, 100), 100, 150, graphic);
        graphic.rect(300, 100, 100, 150);
        textures.vLines(p.createVector(300, 100), 100, 150, graphic);
        graphic.rect(500, 100, 100, 150);
        textures.hLines(p.createVector(500, 100), 100, 150, graphic);
        graphic.rect(700, 100, 100, 150);
        textures.colsOfHLines(p.createVector(700, 100), 100, 150, graphic);
        graphic.rect(900, 100, 100, 150);
        textures.rowsOfVLines(p.createVector(900, 100), 100, 150, graphic);
        graphic.rect(100, 350, 100, 150);
        textures.rowsOfRects(p.createVector(100, 350), 100, 150, graphic);
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

    textures = function(){
        var module = {};
        module.index = [];

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
            graphic.fill(255);
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
            graphic.fill(255);
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
            var rows = Math.round(p.random(10, h/5)),
                cols = 1,
                margin = p.createVector(3, 3),
                offset = p5.Vector.add(loc, margin),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y);
            graphic.strokeJoin(p.BEVEL);
            graphic.stroke(0);
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
            var rows = 1,
                cols = Math.round(p.random(10, w/5)),
                margin = p.createVector(3, 3),
                offset = p5.Vector.add(loc, margin),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y);
            graphic.strokeJoin(p.BEVEL);
            graphic.stroke(0);
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

        module.rects = function(loc, w, h, graphic) {
            graphic.push();
            var rows = Math.round(p.random(3, 10)),
                cols = Math.round(p.random(3, 10)),
                margin = p.createVector(p.random(0, w * 0.05),
                                        p.random(0, h * 0.05)),
                padding = p.createVector(
                        p.random(5, (w - 2 * margin.x)/cols * 0.25),
                        p.random(5, (h - 2 * margin.y)/rows * 0.25));

            while ((w - 2*margin.x - 2*padding.x*cols)/cols < 5) { cols--; }
            while ((h - 2*margin.y - 2*padding.y*rows)/rows < 5) { rows--; }
            var grid = makeGrid(rows, cols,
                                w - 2*margin.x - 2*padding.x,
                                h - 2*margin.y - 2*padding.y);
            var offset = p5.Vector.add(loc, margin);
            offset.add(padding);
            graphic.fill(255);
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
            var rows = Math.round(p.random(3, h/15)),
                cols = 1,
                margin = p.createVector(3, 3),
                padding = p.createVector(4, 4),
                offset = p5.Vector.add(loc, margin),
                grid = makeGrid(rows, cols, w - 2*margin.x, h - 2*margin.y),
                innerRows = 3, //Math.round(p.random(3, 10)),
                innerCols = 3, //Math.round(p.random(3, 10)),
                innerMargin = p.createVector(2, 2),
                innerPadding = p.createVector(2, 2),
                innerGrid = makeGrid(innerRows, innerCols,
                                     grid.cellWidth - 2*innerMargin.x,
                                     grid.cellHeight - 2*innerMargin.y);
            offset.add(padding);
            graphic.translate(offset.x, offset.y);
            for (var i = 0; i < grid.grid.length; i++) {
                var cell = grid.grid[i],
                    innerOffset = p5.Vector.add(cell, innerMargin);
                innerOffset.add(innerPadding);
                graphic.push()
                graphic.translate(innerOffset.x, innerOffset.y);
                for (var j = 0; j < innerGrid.grid.length; j++) {
                    graphic.fill(255);
                    var innerCell = innerGrid.grid[j];
                    graphic.rect(innerCell.x,
                                 innerCell.y,
                                 innerGrid.cellWidth - 2 * innerPadding.x,
                                 innerGrid.cellHeight - 2 * innerPadding.y);
                }
                graphic.pop();
            }
            graphic.pop();
        };
        module.index.push(module.rowsOfRects);

        return module;
    }();
}


// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');