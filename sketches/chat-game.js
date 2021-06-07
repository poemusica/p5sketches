var sketch = function (p) {
    var colors = {
        BLUE: [44,130,201],
        GREEN: [44,201,144],
        YELLOW: [238,230,87],
        ORANGE: [252,185,65],
        RED: [252,96,66],
    };

    var colorArray = [
            colors.RED, colors.ORANGE, colors.YELLOW, colors.GREEN, colors.BLUE
        ],
        texts = [];

    var playerIdx = 0,
        lowestY = 100,
        inserted = 0,
        millis;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        updateDisplay();
        millis = p.millis();
    };

    p.draw = function () {
        var chance = p.random();
        if (p.millis() - millis > 5000 && chance > 0.5) {
            insertText();
            inserted++;
            millis = p.millis();
        }
        updateDisplay();
        inserted = 0;
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    p.keyPressed = function () {
        if (p.keyCode === p.DOWN_ARROW) {
            playerIdx -= 1;
            if (playerIdx < 0) { playerIdx = 4; }
        }
        if (p.keyCode === p.UP_ARROW) {
            playerIdx = (playerIdx + 1) % (colorArray.length);
        }
        if (p.keyCode === p.ENTER || p.keyCode === p.RETURN) {
            insertText(true);
            inserted++;
        }
    };

    function updateDisplay() {
        p.background(0);
        p.fill(colorArray[playerIdx]);
        p.rect(p.width - 100, p.height - 100, 50, 50 );

        for (var i = texts.length - 1; i >= 0; i--) {
            var text = texts[i];
            texts[i].y += 50 * inserted;
            if (p.height - text.y < 0) {
                texts.splice(i, 1);
                continue;
            };
            p.fill(text.color);
            var x = text.author ? p.width/2 + 20: p.width/2 - 220;
            p.rect(x, p.height - text.y, 200, 50);
            //p.text(text.text, x, p.height - text.y);
        }
    }

    function insertText (player) {
        var text = {};
        text.author = player || false;
        if (player) {
            text.color = colorArray[playerIdx];    
        } else {
            text.color = colorArray[getRandomInt(0, colorArray.length)];
        }
        text.text = getRandomText();
        text.y = lowestY;
        texts.push(text);
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getRandomText() {
        var len = getRandomInt(1, 10);
        var str = Math.random().toString(36).substring(len);
        return str;
    }

    function getRandomChar() {

    }

}

// Create a new canvas running 'sketch' as a child of the element with id 'p5-sketch'.
var p5sketch = new p5(sketch, 'p5-sketch');