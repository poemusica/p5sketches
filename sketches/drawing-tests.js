var sketch = function (p) {
    var N,
        list = [],
        vel = [];


    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        N = 5000;
        for (var i = 0; i < N; i++) {
            list.push(p.createVector(Math.random() * p.windowWidth, Math.random() * p.windowHeight));
            vel.push(p5.Vector.random2D());
        }
    };

    p.draw = function () {
        p.background(0);
        p.stroke(255);
        var a = list[0];
        a.add(vel[0]);
        if (a.x > p.windowWidth) { a.x = 0; }
        if (a.x < 0) { a.x = p.windowWidth; }
        if (a.y > p.windowHeight) { a.y = 0; }
        if (a.y < 0) { a.y = p.windowHeight; }
        for (var i = 1; i < list.length; i++) {
            var e = list[i],
                f = list[i-1];
            e.add(vel[i]);
            if (e.x > p.windowWidth) { e.x = 0; }
            if (e.x < 0) { e.x = p.windowWidth; }
            if (e.y > p.windowHeight) { e.y = 0; }
            if (e.y < 0) { e.y = p.windowHeight; }
            p.line(e.x, e.y, f.x, f.y);
        }
    };

}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');