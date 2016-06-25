var sketch = function (p) {
    var colors = {
        CREAM: '#FFEEB0',
        GREEN: "#A2D49F",
        YELLOW: "#E3DF64",
        ORANGE: "#F26247",
        PINK: "#EA2145",
        BLUE: "#2C82C9",
        GRAY: "#D9D9D9",
        MID_GRAY: "#515151"
    };

    var game = {},
        state = {},
        player = {},
        message;

    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        player.loc = new p5.Vector(p.width/2, p.height/2);
        player.vel = new p5.Vector(0, 0);
        player.acc = new p5.Vector(0, 0);
        player.offset = new p5.Vector(0, 0);
        player.size = 50;
        player.maxSpeed = 5;
        player.emotes = [];

        if (!navigator.getGamepads){
            message = "Your browser does not support gamepads.\nPlease try again using Chrome.";
            game = state.error;
        } else {
            var error = "Please connect your gamepad and refresh the page.";
            gamepadReady(function() { game = state.calibrate; }, error);
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
            p.background(colors.GRAY);
            p.noStroke();
            
            if (gamepad.buttons[0].pressed) {
                buttonApressed(player);
            }
            player.acc.set(gamepad.axes[0], gamepad.axes[1]);
            if (player.acc.magSq() < 1) {
                player.acc = player.vel.copy();
                player.acc.rotate(Math.PI);
                player.acc.mult(0.05);
            }
            player.vel.add(player.acc);
            player.vel.limit(player.maxSpeed);
            player.loc.add(player.vel);
            var cantMove = blocked(player.loc, player.size);
            if (cantMove) {
                player.loc = cantMove.copy();
            }
            if (player.vel.magSq() < 0.01) { player.vel.set(0, 0); }
            emote(player);
            p.fill(colors.GRAY);
            p.ellipse(player.loc.x, player.loc.y, player.size + 5, player.size + 5);
            p.fill(colors.MID_GRAY);
            p.ellipse(player.loc.x, player.loc.y, player.size, player.size);
        }, error);
    };

    function emote(obj) {
        for (var i = 0; i < obj.emotes.length; i++) {
            var e = obj.emotes[i];
            p.fill(44,130,201, e.alpha);
            p.ellipse(obj.loc.x, obj.loc.y, e.size, e.size);
            e.size++;
            e.alpha-=5;
        }
        if (obj.emotes.length > 0 && obj.emotes[obj.emotes.length - 1].alpha <= 0) {
            obj.emotes.pop();
        }
    }

    function buttonApressed(obj) {
        for (var i = 0; i < obj.emotes.length; i++) {
            if (obj.emotes[i].type == 0) {
                return;
            }
        }
        var emote = {
            type: 0,
            size: obj.size,
            alpha: 255
        };
        obj.emotes.push(emote);
    }

    function blocked(pos, size) {
        var v = pos.copy(),
            blocked = false;
        if (pos.x < size/2) {
            v.x = size/2;
            blocked = true;
        } else if (pos.x > p.width - size/2) {
            v.x = p.width - size/2;
            blocked = true;
        } 
        if (pos.y < size/2) {
            v.y = size/2;
            blocked = true;
        } else if (pos.y > p.height - size/2) {
            v.y = p.height - size/2;
            blocked = true;
        } 
        if (blocked) {
            return v;
        } else {
            return null;
        }
    }
};

window.onload = function() {
    var p5sketch = new p5(sketch, 'p5-sketch');
};