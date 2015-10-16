// References
//  *   Directrix-focus equation for parabola:
//      http://hotmath.com/hotmath_help/topics/finding-the-equation-of-a-parabola-given-focus-and-directrix.html
var sketch = function (p) {
    var foci = [],
        directrices = [],
        orientations = [],
        colors = [],
        directrix,
        orientation = 'H',
        drawArcs = {},
        getVertex = {},
        drawDirectrix = {},
        mouseStart,
        mouseEnd,
        drawArcHoriz,
        drawArcVert,
        getVertexHoriz,
        getVertexVert,
        drawDirectixHoriz,
        drawDirectrixVert;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        directrix = p.height/2;
        drawArcs['H'] = drawArcHoriz;
        drawArcs['V'] = drawArcVert;
        getVertex['H'] = getVertexHoriz;
        getVertex['V'] = getVertexVert;
        drawDirectrix['H'] = drawDirectixHoriz;
        drawDirectrix['V'] = drawDirectrixVert;
    };

    p.draw = function () {
        var others = foci.slice(),
            vertex;
        p.background(0);
        // Draw foci and parabolas.
        for (var i = 0; i < foci.length; i++) {
            var vertex,
                focus = foci[i],
                direct = directrices[i],
                orient = orientations[i];
            // Draw parabola.
            p.noFill();
            p.stroke(colors[i]);
            p.strokeWeight(2);
            drawArcs[orient](focus, direct);
            // Draw focus-vertex line.
            vertex = getVertex[orient](focus, direct);
            p.stroke(colors[i]);
            p.strokeWeight(1);
            p.line(focus.x, focus.y, vertex.x, vertex.y);
            // Draw vertex.
            p.stroke(colors[i]);
            p.strokeWeight(5);
            p.point(vertex.x, vertex.y);
            // Draw focus.
            p.stroke(colors[i]);
            p.strokeWeight(5);
            p.point(focus.x, focus.y);
        }
        // Draw directrix.
        p.stroke(255);
        p.strokeWeight(1);
        drawDirectrix[orientation]();
        // Draw hypothetical parabola based on mouse position.
        p.stroke(0, 255, 255, 150);
        p.strokeWeight(5);
        p.point(p.mouseX, p.mouseY);
        p.strokeWeight(1);
        vertex = getVertex[orientation](p.createVector(p.mouseX, p.mouseY), directrix);
        p.line(p.mouseX, p.mouseY, vertex.x, vertex.y);
        p.strokeWeight(2);
        p.noFill();
        drawArcs[orientation](p.createVector(p.mouseX, p.mouseY), directrix);
    };

    getVertexHoriz = function(focus, direct) {
        var v = p.createVector(focus.x, direct - (direct - focus.y)/2)
        return v;
    };
    getVertexVert = function(focus, direct) {
        var v = p.createVector(direct - (direct - focus.x)/2, focus.y);
        return v;
    };

    drawArcHoriz = function(focus, direct) {
        var x = 0;
        p.beginShape();
        while (x <= p.width) {
            var y = (p.sq(x - focus.x) + p.sq(focus.y) - p.sq(direct)) / (2 * (focus.y - direct));
            // Draw parabola point sample.
            p.curveVertex(x, y);
            // Sample in increments of 5px.
            x += 5;
        }
        p.endShape();
    };
    drawArcVert = function(focus, direct) {
        var y = 0;
        p.beginShape();
        while (y <= p.height) {
            var x = (p.sq(y - focus.y) + p.sq(focus.x) - p.sq(direct)) / (2 * (focus.x - direct));
            // Draw parabola point sample.
            p.curveVertex(x, y);
            // Sample in increments of 5px.
            y += 5;
        }
        p.endShape();
    };

    function drawDirectrixVert() {
        p.stroke(255);
        p.strokeWeight(1);
        p.line(directrix, 0, directrix, p.height);
    }
    function drawDirectixHoriz() {
        p.stroke(255);
        p.strokeWeight(1);
        p.line(0, directrix, p.width, directrix);
    }

    // Workaround for p5 mouseDragged bug.
    p.mousePressed = function() {
        mouseStart = p.createVector(p.mouseX, p.mouseY);
    };
    p.mouseReleased = function() {
        mouseEnd = p.createVector(p.mouseX, p.mouseY);
        if (mouseStart.equals(mouseEnd)) {
            foci.push(p.createVector(p.mouseX, p.mouseY));
            directrices.push(directrix);
            orientations.push(orientation.slice(0));
            colors.push(p.color(p.random(0, 255), p.random(0, 255), p.random(0, 255), 200));
        }
    };

    p.keyPressed = function() {
        if (p.keyCode == p.UP_ARROW) {
            if (orientation == 'H') { orientation = 'V'; }
            else { orientation = 'H'; }
        }
    }

    // p5 bug: This function triggers even if the mouse was only clicked and not dragged.
    p.mouseDragged = function() {
        if (p.mouseX != p.pmouseX && p.mouseY != p.pmouseY) {
            if (orientation == 'H') { directrix = p.mouseY; };
            if (orientation == 'V') {directrix = p.mouseX; }
        }
    };

}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');