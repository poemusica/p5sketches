var sketch = function (p) {
    var positions,
        rotations,
        colors,
        config = {
            width: 50,
            height: 100
        };

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        init();
    };

    p.draw = function () {
        p.background(0);
        for (var i = 0; i < positions.length; i++) {
            //p.noStroke();
            p.fill(colors[i]);
            p.push();
            p.translate(positions[i].x + config.width/2, positions[i].y + config.height/2);
            //rotations[i] +=  p.radians(1);
            p.rotate(rotations[i]);
            p.translate(-config.width/2, -config.height/2);
            p.rect(0, 0, config.width, config.height);
            p.pop();
        }
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        init();
    };

    function init() {
        positions = [];
        rotations = [];
        colors = [];
        var y = -config.height,
            stepx = 0.01,
            stepy = 100,
            prevR = p.random(-p.PI/12, p.PI/12);
        while (y < p.windowHeight + config.height) {
            var x = 0;
            while(x < p.windowWidth) {
                var newR = prevR + p.map(p.noise(stepx, stepy), 0, 1, -p.PI/6, p.PI/6);
                positions.push( new p5.Vector(x, y) );
                rotations.push(newR);
                //rotations.push( p.map(Math.sin(x % p.windowWidth/3), -1, 1, -p.PI/2, p.PI/2) );
                //rotations.push( p.map(p.noise(x, y), 0, 1, -p.radians(20), p.radians(20)) );
                //rotations.push( p.map(p.noise(x, y), 0, 1, -p.PI, p.PI) );
                colors.push( p.color(Math.random() * 255, Math.random() * 255, Math.random() * 255) );
                x += config.width * 0.25;
                stepx += 0.001;
                prevR = newR;
            }
            y += config.height * 0.25;
            stepy += 0.001;
        }

    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');