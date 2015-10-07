var sketch = function (p) {
    var foci = [],
        directrix,
        dragged = false;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        directrix = 0;
    }

    p.draw = function () {
        p.background(0);
        p.stroke(255, 0, 255);
        p.strokeWeight(5);
        for (var i = 0; i < foci.length; i++) {
            var f = foci[i];
            parabola(f);
            p.point(f.x, f.y);
        }
        p.stroke(255);
        p.strokeWeight(1);
        p.line(0, directrix, p.width, directrix);
    }

    p.mouseDragged = function() {
        directrix = p.mouseY;
        dragged = true;
        // prevent default
        return false;
    }

    p.mouseClicked = function() {
        if (!dragged) {
            foci.push(p.createVector(p.mouseX, p.mouseY));
        }
        dragged = false;
        // prevent default
        return false;
    }

    function parabola(focus) {
        var x = 0;
        p.noFill();
        p.stroke(0, 255, 255);
        p.strokeWeight(2);
        p.beginShape();
        while (x < p.width) {
            var y = (p.sq(x - focus.x) + p.sq(focus.y) - p.sq(directrix)) / (2 * (focus.y - directrix)),
                vertex = p.createVector(x, y);
            p.curveVertex(x, y);
            // Sample in increments of 5px.
            x += 5;
        }
        p.endShape();
    }

}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');