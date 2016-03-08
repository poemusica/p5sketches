var sketch = function (p) {
    var angle,
        position,
        grid,
        target;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        grid = makeGrid(10, 10, p.width, p.height);
        angle = p.createVector();
        position = p.createVector();
        target = p.createVector();
        target.normalize();
    };

    p.draw = function () {
        p.background(255);
        p.push();
        p.translate(position.x, position.y, position.z);
        p.rotateX(angle.x);
        p.rotateY(angle.y);
        p.rotateZ(angle.z);


        p.push();
        p.translate(0, 25, 0);
        p.rotateX(p.PI/2);
        p.plane(grid.width/2, grid.height/2);
        p.pop();

        p.push();
        p.translate(-p.width/2, 0, -p.height/2);
        for (var i = 0; i < grid.grid.length; i++) {
            var cell = grid.grid[i];
            p.push();
            p.translate(cell.x + grid.cellWidth/2, 0, cell.y + grid.cellHeight/2);
            p.box(25, 25, 25);
            p.pop();
        }
        p.pop();
        p.pop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.mouseDragged = function(event) {
        angle.x += p.radians(event.movementY);
        angle.y += p.radians(event.movementX);
    };


    p.keyPressed = function () {
      if (p.keyCode === p.DOWN_ARROW) {
        position.z -= 10;
      } else if (p.keyCode === p.UP_ARROW) {
        position.z += 10;
      } else if (p.keyCode === p.RIGHT_ARROW) {
        angle.y += p.radians(1);
        target.rotate(angle.y);
      } else if (p.keyCode === p.LEFT_ARROW) {
        angle.y -= p.radians(1);
        target.rotate(angle.y);
      }
      return false;
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