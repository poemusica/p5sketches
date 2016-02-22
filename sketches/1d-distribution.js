var sketch = function (p) {
    var distributor;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        d1 = makeDistributor(p.width);
        d2 = makeDistributor(p.width);
        d3 = makeDistributor(p.width);
        d4 = makeDistributor(p.width);

        distributor = makeDistributor2(p.width)
    };

    p.draw = function () {
        p.background(255);
        p.line(0, p.height * 0.25, p.width, p.height * 0.25);
        // p.line(0, p.height * 0.5, p.width, p.height * 0.5);
        // p.line(0, p.height * 0.75, p.width, p.height * 0.75);
        // p.line(0, p.height, p.width, p.height);
        drawRects(0, p.height * 0.25, 0.85, distributor);
        // drawRects(p.height * 0.25, p.height * 0.5, 0.8, d2);
        // drawRects(p.height * 0.5, p.height * 0.75, 0.75, d3);
        // drawRects(p.height * 0.75, p.height, 0, d4);
        p.noLoop();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    // p.mouseClicked = function() {
    //     var x = distributor();
    //     p.line(x, 0, x, p.height);
    // };

    function drawRects(y, h, prob, distributor) {
        var count = 0;
        while (count < 20) {
            var x = distributor(),
                height = (h - y) * p.random(0.2, 0.8),
                width = p.random(50, 100);
            p.rectMode(p.CENTER);
            if (prob === 0) {
                p.fill(p.random(0, 255));
                p.rect(p.random(0, p.width), h - height/2, width, height);
                count++;
                continue;
            }
            p.stroke(0);
            // p.line(x, y, x, h);
            if (Math.random() < prob) {
                p.fill(p.random(0, 255));
                p.rect(x, h - height/2, width, height);
                count++;
            }
        }
    }

    function makeDistributor2(w) {
        var divisor = 6,
            xDivs = [],
            start = 0,
            sign = -1,
            j = 1,
            end = 0;
        return function () {
            var x;
            if (xDivs.length < 2) {
                x = w/2 + (w/divisor) * sign;
                xDivs.push(x);
                sign *= -1;
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
            // console.log(x, j, start, end, divisor, sign, xDivs);
            return x;
        };
    }

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
            return x;
        };
    }

}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');