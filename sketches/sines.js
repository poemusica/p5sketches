var sketch = function (p) {
	var waves = [];

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        var n = 20;
        for (var i = 0; i < n; i++) {
        	var amp  = p.height/ (n + 1) - 10;
        	waves.push(makeWave(amp/2, p.floor(p.random() * 4 + 1), i/n));
        }
    };

    p.draw = function () {
        p.background(255);
        p.stroke(0);
        p.strokeWeight(10);

        for (var i = 0; i < waves.length; i++) {
        	var w = waves[i],
        		h = p.height/ (waves.length + 1) - 10;
        	p.push();
	        p.translate(0, p.height/ (waves.length + 1) * (i + 1) );
	        w.draw(p.width);
	        p.pop();
        }
    };

    function makeWave(amp, per, off) {
    	var detail = 100,
    		radian = p.radians(1),
    		// t = off * p.TWO_PI,
    		t = p.random() * p.TWO_PI,
    		f = p.floor(p.noise(amp, t) * 255),
    		speed = radian * p.random(0.5,4);
    	return {
    		draw: function(w) {
	    		p.fill(f);
	    		p.beginShape();
		        p.vertex(0, amp * 4);
		        for (var i = -1; i <= detail + 1; i++) {
		        	var x = i * w/detail;
		        		y = p.sin( (per * x/w * p.TWO_PI + t) % p.TWO_PI) * amp;
		        	p.curveVertex(x, y);
		        }
		        p.vertex(w, amp * 4);
		        p.endShape(p.CLOSE);
		        t += speed;
		        t = t % p.TWO_PI;
    		},
    	}
    }

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');