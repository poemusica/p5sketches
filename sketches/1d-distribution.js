var sketch = function (p) {
    var distributor;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        distributor = makeDistributor(p.width);
        p.background(255);
        p.line(0, p.height/4, p.width, p.height/4);
    };

    p.draw = function () {
        p.noLoop();
    };

    p.mouseClicked = function() {
        var x = distributor();
        p.line(x, 0, x, p.height/4);
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    function makeDistributor(w) {
        var divisor = 2,
            xDivs = [],
            start = 0,
            sign = -1,
            j = 0,
            end = 0;
        return function () {
            var x;
            if (xDivs.length === 0) {
                x = w/2;
                xDivs.push(x);
                divisor *= 2;
            } else {
                var prev = xDivs[j],
                    space = w/divisor * sign;
                x = prev + space;
                xDivs.push(x);
                if (sign > 0) { j--; }
                sign *= -1;
            }
            if (j < end) {
                end = xDivs.length - divisor/2;
                start = xDivs.length - 1;
                divisor *= 2;
                j = start;
            }
            console.log(x, divisor, start, end, j, xDivs);
            return x;
        };
    }

    function distributeByPows(n, w, h, y) {
        var divisor = 2,
            xDivs = [],
            i = 0;
        do {
            p.stroke(p.random(0, 255), p.random(0, 255), p.random(0, 255));
            for (var j = xDivs.length - 1; j >= 0; j--) {
                var prev = xDivs[j],
                    below = prev - w/divisor;
                    above = prev + w/divisor;
                xDivs.push(below, above);
                p.line(below, y, below, h);
                p.line(above, y, above, h);
            }
            if (xDivs.length === 0) {
                xDivs.push(w/2);
                p.line(w/2, y, w/2, h);
            }
            divisor *= 2;
            i++;
        } while (i < n);
        return xDivs;
    }
}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');