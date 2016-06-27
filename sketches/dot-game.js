var sketch = function (p) {
    var colors = {
        BLUE: [44,130,201],
        GREEN: [44,201,144],
        YELLOW: [238,230,87],
        ORANGE: [252,185,65],
        RED: [252,96,66],
        GRAY: [137,137,137],
        MID_GRAY: [70,70,70]
    };

    var game = {},
        state = {},
        player = {},
        message;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        player = initializePlayer();

        if (!navigator.getGamepads){
            message = "Your browser does not support gamepads.\nPlease try again using Chrome.";
            game = state.error;
        } else {
            var error = "Please connect your gamepad and refresh the page.";
            gamepadReady(function() { game = state.play; }, error);
        }
    };

    p.draw = function () {
        game();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    function gamepadReady(callback, error) {
        if (navigator.getGamepads()[0] == undefined) {
            message = error;
            game = state.error;
        } else {
            callback();
        }
    }

    state.error = function() {
        p.background(0);
        p.fill(255);
        p.textSize(18);
        p.textAlign(p.CENTER);
        p.text(message, p.width/2, p.height/2);
        p.noLoop();
    };

    state.calibrate = function () {
        setTimeout(function() {
            var error = "Gamepad disconnected.\nPlease reconnect your gamepad and refresh the page.";
            gamepadReady(function() {
                var gamepad = navigator.getGamepads()[0];
                player.offset.set(gamepad.axes[0], gamepad.axes[1]);
                game = state.ready;
                p.loop();
            }, error);
        }, 2000);
        p.background(0);
        p.fill(255);
        p.textSize(18);
        p.textAlign(p.CENTER);
        p.text("Calibrating controller.\nPlease do not touch joystick.",
        p.width/2, p.height/2);
        p.noLoop();
    };

    state.ready = function() {
        var error = "Gamepad disconnected.\nPlease reconnect your gamepad and refresh the page."
        gamepadReady(function(){
            var gamepad = navigator.getGamepads()[0];
            p.background(0);
            p.fill(255);
            p.textSize(18);
            p.textAlign(p.CENTER);
            p.text("Ready!\nPress A to start.", p.width/2, p.height/2);
            if (gamepad.buttons[0].pressed) {
                game = state.play;
            }
        }, error);
    };

    state.play = function() {
        var error = "Gamepad disconnected.\nPlease reconnect your gamepad and refresh the page."
        gamepadReady(function() {
            var gamepad = navigator.getGamepads()[0];
            player.acc.set(gamepad.axes[0], gamepad.axes[1]);
            move(player);
            p.background(colors.GRAY);
            displayDot(player);


            // set emote and display inventory
            var rightJoystick = new p5.Vector(gamepad.axes[2], gamepad.axes[3]);
            if (Math.abs(rightJoystick.x) > 0.25 || Math.abs(rightJoystick.y) > 0.25) {
                if (player.open < player.size * 3) {
                    player.open += 15;
                }
            } else if (player.open > player.size) {
                player.open -= 15;
            }
            player.open = p.constrain(player.open, player.size, player.size * 3);
            var startArc = 0, 
                stepArc = player.inventory.length > 0 ? p.TWO_PI/player.inventory.length : 0,
                alpha = Math.ceil(200 * (player.open/(player.size * 3))),
                stroke = colors.GRAY;
                selected = rightJoystick.heading() > 0 ? rightJoystick.heading() : p.TWO_PI + rightJoystick.heading();
            for (var i = 0; i < player.inventory.length; i++) {
                var a = alpha,
                    fill = player.inventory[i].concat(a),
                    outline = stroke,
                    expand = 0;
                if (selected >= startArc && selected < startArc + stepArc && player.open >= player.size * 3) {
                    a = 255;
                    fill = player.inventory[i].concat(a);
                    expand = 50;
                    player.emote = player.inventory[i];
                }
                else if (player.open + expand <= player.size) {
                    outline = [0, 0];
                    fill = [0, 0];
                }
                p.strokeWeight(4);
                p.stroke(outline);
                p.fill(fill);
                p.arc(player.loc.x, player.loc.y, player.open + expand, player.open + expand,
                        startArc, startArc + stepArc, p.PIE);
                startArc = stepArc * (i+1);
            }

            // displayRightJoystick(player, gamepad);

        }, error);
    };

    function displayRightJoystick(obj, gamepad) {
        var rightJoystick = new p5.Vector(gamepad.axes[2], gamepad.axes[3]);
        p.stroke(0);
        p.push();
        p.translate(obj.loc.x, obj.loc.y);
        rightJoystick.setMag(obj.open/2);
        p.line(0, 0, rightJoystick.x, rightJoystick.y);
        p.pop();
    }

    function displayDot(obj) {
        var stroke = obj.emote ? obj.emote : colors.MID_GRAY;
        p.strokeWeight(4);
        p.stroke(stroke);
        p.fill(colors.MID_GRAY);
        p.ellipse(obj.loc.x, obj.loc.y, obj.size, obj.size);
    }

    function move(obj) {
        if (obj.acc.magSq() < 1) {
                obj.acc = obj.vel.copy();
                obj.acc.rotate(Math.PI);
                obj.acc.mult(0.05);
            }
            obj.vel.add(obj.acc);
            obj.vel.limit(obj.maxSpeed);
            obj.loc.add(obj.vel);
            obj.loc.x = p.constrain(obj.loc.x, obj.size/2, p.width - obj.size/2);
            obj.loc.y = p.constrain(obj.loc.y, obj.size/2, p.height - obj.size/2);
            if (obj.vel.magSq() < 0.01) { obj.vel.set(0, 0); }
    }

    function initializePlayer() {
        return {
            loc: new p5.Vector(p.width/2, p.height/2),
            vel: new p5.Vector(0, 0),
            acc: new p5.Vector(0, 0),
            offset: new p5.Vector(0, 0),
            size: 50,
            maxSpeed: 5,
            emote: null,
            inventory: [colors.BLUE, colors.GREEN, colors.YELLOW, colors.ORANGE, colors.RED],
            open: 0
        }
    }

    function emote(obj) {
        // p.fill(obj.emote.concat(obj.emote.alpha));
        p.ellipse(obj.loc.x, obj.loc.y, obj.emote.size, obj.emote.size);
        obj.emote.size++;
        obj.emote.alpha-=5;
        if (obj.emote.alpha <= 0) { obj.emote = null; }
    }

    function addEmote(obj) {
        if (obj.emote != null) { return; }
        var emote = {
            type: 0,
            size: obj.size,
            alpha: 255
        };
        obj.emote = emote;
    }

};

window.onload = function() {
    var p5sketch = new p5(sketch, 'p5-sketch');
};

/*******************************************************************************
REFERENCES:
Gamepad API:
* https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/
UUID:
* http://stackoverflow.com/a/8809472
ECS:
* http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript
*******************************************************************************/