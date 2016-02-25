var sketch = function (p) {

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = function () {
        p.background(255);
        p.fill(175);
        var data = makeData(new p5.Vector(100, 100)),
            width = data.width - 2 * data.margin.x - 2 * data.padding.x,
            height = data.height - 2 * data.margin.y - 2 * data.padding.y,
            grid = makeGrid(data.rows, data.cols, width, height);
        p.rect(data.loc.x, data.loc.y, data.width, data.height);
        drawRects(grid, data);

        var data = makeVertData(new p5.Vector(300, 100)),
             width = data.width - 2 * data.margin.x - 2 * data.padding.x,
             height = data.height - 2 * data.margin.y - 2 * data.padding.y,
             grid = makeGrid(data.rows, data.cols, width, height);
        p.rect(data.loc.x, data.loc.y, data.width, data.height);
        drawVerticals(grid, data);

        var data = makeHorizData(new p5.Vector(500, 100)),
             width = data.width - 2 * data.margin.x - 2 * data.padding.x,
             height = data.height - 2 * data.margin.y - 2 * data.padding.y,
             grid = makeGrid(data.rows, data.cols, width, height);
        p.rect(data.loc.x, data.loc.y, data.width, data.height);
        drawHorizontals(grid, data);


        p.noLoop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    function makeData(pos) {
        var data = {
            loc: pos,
            width: p.random(100, 150),
            height: p.random(100, 200),
            rows: Math.floor(p.random(3, 10)),
            cols: Math.floor(p.random(3, 10)),
            },
            xmarginLimit = data.width/2,
            ymarginLimit = data.height/2;
        if (data.width > data.height && data.rows > data.cols) {
            var temp = data.cols;
            data.cols = data.rows;
            data.rows = temp;
        }
        if (data.height > data.width && data.cols > data.rows) {
            var temp = data.cols;
            data.cols = data.rows;
            data.rows = temp;
        }
        data.margin = p.createVector(p.random(0, xmarginLimit * 0.1), p.random(0, ymarginLimit * 0.1));
        var xpaddingLimit = (data.width - 2 * data.margin.x)/data.cols,
            ypaddingLimit = (data.height - 2 * data.margin.y)/data.rows;
        data.padding = p.createVector(p.random(5, xpaddingLimit * 0.25), p.random(5, ypaddingLimit * 0.25));

        while ((data.width - 2 * data.margin.x - 2 * data.padding.x)/data.cols < 10) { data.cols--; }
        while ((data.height - 2 * data.margin.y - 2 * data.padding.y)/data.rows < 10) { data.rows--; }
        return data;
    }

    function makeVertData(pos) {
        var data = {
            loc: pos,
            width: p.random(100, 150),
            height: p.random(100, 200),
            rows: 1,
            cols: Math.floor(p.random(10, 30)),
        };
        data.margin = p.createVector(0, 0);
        var xpaddingLimit = (data.width - 2 * data.margin.x)/data.cols,
            ypaddingLimit = (data.height - 2 * data.margin.y)/data.rows;
        data.padding = p.createVector(p.random(2, xpaddingLimit * 0.25), 2);

        while ((data.width - 2 * data.margin.x - 2 * data.padding.x)/data.cols < 5) { data.cols--; }
        while ((data.height - 2 * data.margin.y - 2 * data.padding.y)/data.rows < 5) { data.rows--; }
        return data;
    }

    function makeHorizData(pos) {
        var data = {
            loc: pos,
            width: p.random(100, 150),
            height: p.random(100, 200),
            rows: Math.floor(p.random(25, 50)),
            cols: 1,
        };
        data.margin = p.createVector(0, 0);
        var xpaddingLimit = (data.width - 2 * data.margin.x)/data.cols,
            ypaddingLimit = (data.height - 2 * data.margin.y)/data.rows;
        data.padding = p.createVector(2, p.random(2, ypaddingLimit * 0.25));

        while ((data.width - 2 * data.margin.x - 2 * data.padding.x)/data.cols < 5) { data.cols--; }
        while ((data.height - 2 * data.margin.y - 2 * data.padding.y)/data.rows < 5) { data.rows--; }
        return data;
    }

    function drawRects(grid, data) {
        var offset = p5.Vector.add(data.loc, data.margin);
        offset.add(data.padding);
        p.push();
        p.fill(255);
        p.translate(offset.x, offset.y);
         for (var i = 0; i < grid.grid.length; i++) {
            var cell = grid.grid[i];
            p.rect(cell.x + data.padding.x, cell.y + data.padding.y, grid.cellWidth - 2 * data.padding.x, grid.cellHeight - 2 * data.padding.y);
        }
        p.pop();
    }

    function drawVerticals(grid, data) {
        var offset = p5.Vector.add(data.loc, data.margin);
        offset.add(data.padding);
        p.push();
        p.strokeJoin(p.BEVEL);
        p.stroke(0);
        p.translate(offset.x, offset.y);
        for (var i = 0; i < grid.grid.length; i++) {
            var cell = grid.grid[i];
            p.push();
            //Without outer margin and padding
            p.translate(cell.x + grid.cellWidth/2, cell.y - data.padding.y);
            p.line(0, 0, 0, grid.cellHeight + data.padding.y * 2);
            // With outer margin and padding
            // p.translate(cell.x + grid.cellWidth/2, cell.y + data.padding.y);
            // p.line(0, 0, 0, grid.cellHeight - 2 * data.padding.y);
            p.pop();
        }
        p.pop();
    }

    function drawHorizontals(grid, data) {
        var offset = p5.Vector.add(data.loc, data.margin);
        offset.add(data.padding);
        p.push();
        p.strokeJoin(p.BEVEL);
        p.stroke(0);
        p.translate(offset.x, offset.y);
        for (var i = 0; i < grid.grid.length; i++) {
            var cell = grid.grid[i];
            p.push();
            // Without outer margin and padding
            p.translate(cell.x - data.padding.x, cell.y + grid.cellHeight/2);
            p.line(0, 0, grid.cellWidth + data.padding.x * 2, 0);
            // With outer margin and padding
            // p.translate(cell.x + data.padding.x, cell.y + grid.cellHeight/2);
            // p.line(0, 0, grid.cellWidth - 2 * data.padding.x, 0);
            p.pop();
        }
        p.pop();
    }

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
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');