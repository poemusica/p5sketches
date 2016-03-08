var sketch = function (p) {
    var angle = {
            x: 0,
            y: 0,
            z: 0
        },
        position =  {
            x: 0,
            y: 0,
            z: 0
        },
        grid;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        grid = makeGrid(10, 10, p.width, p.height);
    };

    p.draw = function () {
        p.background(255);
        p.push();
        p.translate(-p.width/2, -p.height/2, 0);
        for (var i = 0; i < grid.grid.length; i++) {
            var cell = grid.grid[i];
            p.push();
            p.translate(cell.x + grid.cellWidth/2, cell.y + grid.cellHeight/2, position.z);
            p.rotateX(p.radians(angle.x));
            p.rotateY(p.radians(angle.y));
            p.box(25, 25, 25);
            p.pop();
        }
        p.pop();

    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.mouseDragged = function(event) {
        angle.x += event.movementY;
        angle.y += event.movementX;
    };

    p.mouseWheel = function(event) {
        position.z += event.delta;
        return false;
    };


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