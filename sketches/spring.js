// Port of soft-body-square toxiclibs.js tutorial.
// http://haptic-data.com/toxiclibsjs/examples/soft-body-square
var sketch = function (p) {
    var
        // Short names
        GravityBehavior = toxi.physics2d.behaviors.GravityBehavior,
        VerletParticle2D = toxi.physics2d.VerletParticle2D,
        VerletSpring2D = toxi.physics2d.VerletConstrainedSpring2D,
        Vec2D = toxi.geom.Vec2D,
        Rect =toxi.geom.Rect,
        // Sketch variables
        physics,
        head,
        tail,
        DIM = 15,
        REST_LENGTH = 10,
        STRENGTH = 1,
        INNER_STRENGTH = 2;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.smooth();
        physics = new toxi.physics2d.VerletPhysics2D();
        physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.1)));
        physics.setWorldBounds(new Rect(0, 0, p.width, p.height));
        for(var y = 0, idx = 0; y < DIM; y++) {
            for(var x = 0; x < DIM; x++) {
                vp = new VerletParticle2D(x * REST_LENGTH, y * REST_LENGTH);
                physics.addParticle(vp);
                if (x > 0) {
                    vs = new VerletSpring2D(vp, physics.particles[idx-1], REST_LENGTH, STRENGTH);
                    physics.addSpring(vs);
                }
                if (y > 0) {
                    vs = new VerletSpring2D(vp, physics.particles[idx-DIM], REST_LENGTH, STRENGTH);
                    physics.addSpring(vs);
                }
                idx++;
            }
        }

        vp = physics.particles[0];
        vq = physics.particles[physics.particles.length-1];
        len = p.sqrt(p.sq(REST_LENGTH * (DIM - 1)) * 2);
        vs = new VerletSpring2D(vp, vq, len, INNER_STRENGTH);
        physics.addSpring(vs);
        vp = physics.particles[DIM-1];
        vq = physics.particles[physics.particles.length-DIM];
        vs = new VerletSpring2D(vp, vq, len, INNER_STRENGTH);
        physics.addSpring(vs);
        var headIdx = (DIM-1)/2;
        console.log(headIdx)
        head = physics.particles[Math.floor(headIdx)];
        head.lock();
    }

    p.draw = function () {
        p.background(0);
        p.stroke(255);
        head.set(p.mouseX, p.mouseY);
        physics.update();
        for(var i = 0; i < physics.springs.length; i++) {
            vs = physics.springs[i];
            p.line(vs.a.x, vs.a.y, vs.b.x, vs.b.y);
        }
    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');