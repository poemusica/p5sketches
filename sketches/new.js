var sketch = function (p) {
    var player = {},
        accForce = 0.5,
        colors = [],
        rects = [];
        points = [];

    // Preload assets using p5 *load functions.
    p.preload = function () {
    };

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(0);
        p.rectMode(p.CENTER);
        player.pos = new p5.Vector(p.width/2, p.height/2);
        player.vel = new p5.Vector(0, 0);
        player.acc = new p5.Vector(0, 0);
        for (var i=0; i < 300; i++) {
            rects.push(new p5.Vector(p.random(0, p.width), 
                                     -20, 
                                     p.random(5, 10)));
            colors.push(0.1);
        };

        for (var i=0; i<300; i++) {
            if (i < 100) {
                var y = p.map(p.noise(i/100), 0, 1, 0, p.height/2);
                points.push(new p5.Vector(p.width/100 * i, y));
            }
            else if (i < 200) {
                var low = points[i-100].y,
                    y = p.map(p.noise(i/100), 0, 1, low, p.height/2);
                points.push(new p5.Vector(p.width/100 * (i-100), y));
            }
            else {
                var low = points[i-100].y,
                    y = p.map(p.noise(i/100), 0, 1, low, p.height/2);
                points.push(new p5.Vector(p.width/100 * (i-200), y));
            }
        }

    };

    p.draw = function () {
        p.background(0);


        p.noStroke();
        for (var i=0; i<3; i++) {
            p.fill(0, 0, 255, 25);
            p.beginShape();
            p.vertex(0, p.height);
            var idx;
            for (var j=0; j<100; j++) {
                idx = 100 * i + j;
                p.vertex(points[idx].x, points[idx].y);
            }
            p.vertex(p.width, points[idx].y);
            p.vertex(p.width, p.height);
            //p.vertex(points[idx].x, p.height);
            p.endShape(p.CLOSE);
        }

        p.fill(0, 255, 0, 25);
        p.rect(p.width/2, p.height * 0.75, p.width, p.height * 0.5);

        p.noLoop();

        // p.noStroke();
        // for (var i=0; i < rects.length; i++) {
        //     p.fill(chroma('blue').brighten(colors[i]).rgb());
        //     colors[i] += 0.1;
        //     rects[i].add(new p5.Vector(0, rects[i].z, 0));
        //     p.rect(rects[i].x, rects[i].y, 5, 5);
        //     if (rects[i].y > p.height + 10) {
        //         rects[i].set(p.random(0, p.width), -20, p.random(5, 10));
        //         colors[i] = 0.1;
        //     }
        // }

        // player.vel.add(player.acc);
        // player.vel.mult(0.98);
        // player.vel.limit(5);
        // if (player.vel.magSq() < 0.01) {
        //     player.vel.mult(0);
        // }
        // player.pos.add(player.vel);
        // player.acc.mult(0);
        // p.fill('white');
        // p.ellipse(player.pos.x, player.pos.y, 10, 10);
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.keyPressed = function () {
        if (p.keyCode === p.DOWN_ARROW) {
            player.acc.add(new p5.Vector(0, accForce));
        }
        if (p.keyCode === p.UP_ARROW) {
            player.acc.add(new p5.Vector(0, -accForce));
        }
        if (p.keyCode === p.LEFT_ARROW) {
            player.acc.add(new p5.Vector(-accForce, 0));
        }
        if (p.keyCode === p.RIGHT_ARROW) {
            player.acc.add(new p5.Vector(accForce, 0));
        }
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');