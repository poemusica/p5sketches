var sketch = function (p) {
    var locations = [],
        // range 1-5
        distances =  [],
        colors = [],
        velocities = [],
        acceleration;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (var i = 0; i < 500; i++) {
            locations.push(p.createVector(Math.floor(Math.random() * p.width), Math.floor(Math.random() * p.height)));
            distances.push(Math.random() * 4 + 1);
            colors.push(p.color(p.random(220, 255), p.random(220, 255), p.random(220, 255), p.lerp(0, 255, 1/distances[i])));
            velocities.push(p.createVector(0, 0));
        }
        acceleration = p.createVector(0, 0);
        velocity = p.createVector(0, 0);
    };

    p.draw = function () {
        var dir, acc, m;
        p.background(0, 200);
        for (var i = 0; i < locations.length; i++) {
            var loc = locations[i];
            velocities[i].add(acceleration);
            velocities[i].limit(5 * 1/distances[i]);
            loc.add(velocities[i]);
            locations[i] = loc;
            if (loc.x > p.width) {
                locations[i].x = 0;
                locations[i].y = Math.floor(Math.random() * p.height);
            }
            else if (loc.x < 0) {
                locations[i].x = p.width;
                locations[i].y = Math.floor(Math.random() * p.height);
            }
            else if (loc.y > p.height) {
                locations[i].y = 0;
                locations[i].x = Math.floor(Math.random() * p.width);
            }
            if (loc.y < 0) {
                locations[i].y = p.height;
                locations[i].x = Math.floor(Math.random() * p.width);
            }
            p.stroke(colors[i]);
            p.strokeWeight(5 * (1/distances[i]));
            p.point(locations[i].x, locations[i].y);
        }
        dir = p.createVector(p.mouseX, p.mouseY);
        dir.sub(p.width/2, p.height/2);
        acc = acceleration.copy();
        acceleration = p.createVector(p.abs(p.mouseX - p.width/2), p.abs(p.mouseY - p.height/2));
        m = acceleration.mag();
        prevm = acc.mag();
        m = p.map(m, 0, p.max(p.width/2, p.height/2), 0, 5);
        acceleration = dir.setMag(m);
    };

    p.mouseMoved = function() {
        var prev = p.createVector(p.prevMouseX, p.prevMouseY),
            mouse = p.createVector(p.mouseX, p.mouseY);
            v = p5.Vector.sub(prev, mouse);
    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');