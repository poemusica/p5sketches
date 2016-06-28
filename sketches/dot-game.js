var sketch = function (p) {
    /***************************************************************************
    Sketch globals
    ***************************************************************************/
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
        ECS = {
            Components: {},
            systems: {},
            entities: {}
        },
        message;

    /***************************************************************************
    Native p5 commands
    ***************************************************************************/
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);

        var player = new ECS.Assemblages.Player({
            loc: new p5.Vector(p.width/2, p.height/2),
            inventory: [colors.BLUE, colors.GREEN, colors.YELLOW, colors.ORANGE, colors.RED]
        });
        ECS.entities[player.id] = player;
        for (var i = 0; i < 10; i++) {
            var npc = new ECS.Assemblages.NPC();
            ECS.entities[npc.id] = npc;
        }

        if (!navigator.getGamepads){
            message = "Your browser does not support gamepads.\nPlease try again using Chrome.";
            game = state.error;
        } else {
            var error = "Please connect your gamepad and refresh the page.";
            gamepadReady(function() { game = state.ready; }, error);
        }
    };

    p.draw = function () {
        game();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
    /***************************************************************************
    Gamepad utils
    ***************************************************************************/
    function gamepadReady(callback, error) {
        if (navigator.getGamepads()[0] == undefined) {
            message = error;
            game = state.error;
        } else {
            callback();
        }
    }
    /***************************************************************************
    Other utils
    ***************************************************************************/
    function randomLoc() {
        return new p5.Vector(p.random(0, p.width), p.random(0, p.height));
    }
    /***************************************************************************
    Program states
    ***************************************************************************/
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
            p.background(colors.GRAY);
            p.fill(255);
            p.textAlign(p.CENTER);
            p.textSize(36);
            p.text("Title Screen", p.width/2, p.height/2);
            p.textSize(18);
            p.text("Press A to start.", p.width/2, p.height/2 + 36);
            if (gamepad.buttons[0].pressed) {
                game = state.play;
            }
        }, error);
    };

    state.play = function() {
        var error = "Gamepad disconnected.\nPlease reconnect your gamepad and refresh the page."
        gamepadReady(function() {

            p.background(colors.GRAY);

            ECS.systems.updateAcceleration(ECS.entities);
            ECS.systems.updateLocation(ECS.entities);
            ECS.systems.detectCollisions(ECS.entities);
            ECS.systems.resizeInventory(ECS.entities);
            ECS.systems.updateEquipped(ECS.entities);
            ECS.systems.renderDot(ECS.entities);
            ECS.systems.renderInventory(ECS.entities);

        }, error);
    };
    /***************************************************************************
    Entity definitions
    ***************************************************************************/
    ECS.Entity = function() {
        this.id = ECS.Entity.prototype.generateUUID();
        this.components = {};
        ECS.Entity.prototype.count++;
        return this;
    };

    ECS.Entity.prototype.count = 0;

    ECS.Entity.prototype.generateUUID = function () {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r&0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    ECS.Entity.prototype.addComponent = function (component) {
        this.components[component.name] = component;
        return this;
    };

    ECS.Entity.prototype.removeComponent = function(component) {
        var name = component;
        if (typeof component === 'function') {
            name = component.prototype.name;
        }
        delete this.components[name];
        return this;
    };

    ECS.Entity.prototype.print = function() {
        console.log(JSON.stringify(this, null, 2));
    };
    /***************************************************************************
    Component definitions
    ***************************************************************************/
    ECS.Components.Appearance = function( params ) {
        this.size = params ? params.size || 50 : 50;
        this.fill = params ? params.fill || colors.MID_GRAY : colors.MID_GRAY;
        this.stroke = params ? params.stroke || colors.MID_GRAY : colors.MID_GRAY;
        this.strokeWeight = params ? params.strokeWeight || 4 : 4;
        return this;
    };
    ECS.Components.Appearance.prototype.name = 'appearance';

    ECS.Components.BoundByScreen = function( params ) {
        this.bound = true;
        return this;
    };
    ECS.Components.BoundByScreen.prototype.name = 'boundByScreen';

    ECS.Components.Collider = function() {
        this.collides = true;
        this.hit = false;
        return this;
    };
    ECS.Components.Collider.prototype.name = 'collider';

    ECS.Components.Emoter = function() {
        this.emotes = true;
        return this;
    };
    ECS.Components.Emoter.prototype.name = 'emoter';

    ECS.Components.HasInventory = function( params ) {
        this.inventory = params && params.inventory ? params.inventory.slice() : [];
        this.equipped = params ? params.equipped || false : false;
        this.open = params ? params.open || 0 : 0;
        return this;
    };
    ECS.Components.HasInventory.prototype.name = 'hasInventory';

    ECS.Components.Location = function( params ) {
        this.loc = params && params.loc ? params.loc.copy() : randomLoc();
        return this;
    };
    ECS.Components.Location.prototype.name = 'location';

    ECS.Components.Mover = function( params ) {
        this.vel = params && params.vel ? params.vel.copy() : new p5.Vector(0, 0);
        this.acc = params && params.acc ? params.acc.copy() : new p5.Vector(0, 0);
        this.maxSpeed = params ? params.maxSpeed || 5 : 5;
        this.moves = true;
        return this;
    };
    ECS.Components.Mover.prototype.name = 'mover';

    ECS.Components.PlayerControlled = function() {
        this.player = true;
        return this;
    };
    ECS.Components.PlayerControlled.prototype.name = 'playerControlled';
    /***************************************************************************
    Assemblage definitions
    ***************************************************************************/
    ECS.Assemblages = {
        Player: function ( params ) {
            var entity = new ECS.Entity();
            entity.addComponent( new ECS.Components.Appearance(params) );
            entity.addComponent( new ECS.Components.BoundByScreen(params) );
            entity.addComponent( new ECS.Components.Collider(params) );
            entity.addComponent( new ECS.Components.Emoter(params) );
            entity.addComponent( new ECS.Components.HasInventory(params) );
            entity.addComponent( new ECS.Components.Location(params) );
            entity.addComponent( new ECS.Components.Mover(params) );
            entity.addComponent( new ECS.Components.PlayerControlled(params) );
            return entity;
        },
        NPC: function (params) {
            var entity = new ECS.Entity();
            entity.addComponent( new ECS.Components.Appearance(params) );
            entity.addComponent( new ECS.Components.BoundByScreen(params) );
            entity.addComponent( new ECS.Components.Collider(params) );
            entity.addComponent( new ECS.Components.Emoter(params) );
            entity.addComponent( new ECS.Components.HasInventory(params) );
            entity.addComponent( new ECS.Components.Location(params) );
            entity.addComponent( new ECS.Components.Mover(params) );
            return entity;
        }
    };
    /***************************************************************************
    System definitions
    ***************************************************************************/
    ECS.systems.renderDot = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (e.components.appearance && e.components.location) {
                var fill = e.components.appearance.fill,
                    stroke = e.components.appearance.stroke;
                if (e.components.hasInventory) {
                    var equipped = e.components.hasInventory.equipped;
                    stroke = equipped || stroke;
                }
                if (e.components.collider) {
                    fill = e.components.collider.hit ? [0, 0, 0] : fill;
                }
                p.push();
                p.translate(e.components.location.loc.x, 
                            e.components.location.loc.y);
                p.fill(fill);
                p.stroke(stroke);
                p.strokeWeight(e.components.appearance.strokeWeight);
                p.ellipse(0, 0, e.components.appearance.size, 
                          e.components.appearance.size);
                p.pop();
            }
        }
    };

    ECS.systems.renderInventory = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (e.components.appearance && e.components.location 
                && e.components.hasInventory 
                && e.components.hasInventory.open > e.components.appearance.size) {
                var length = e.components.hasInventory.inventory.length,
                    size = e.components.appearance.size,
                    open = e.components.hasInventory.open,
                    alpha = Math.ceil(200 * (open/(size * 3))),
                    fill = null,
                    stroke = [0, 0],
                    expand = 50;
                p.push();
                p.translate(e.components.location.loc.x, 
                            e.components.location.loc.y);
                if (length > 1) {
                    // Split into arcs.
                    var equipped = e.components.hasInventory.equipped,
                        startArc = 0,
                        stepArc = length > 0 ? p.TWO_PI/length : 0;
                    for (var i = 0; i < length; i++) {
                        var a = alpha,
                            outline = stroke,
                            diameter = open;
                        fill = e.components.hasInventory.inventory[i];
                        if (open >= size * 3) {
                            outline = colors.GRAY;
                            if (equipped == fill) {
                                diameter += expand;
                                a = 255;
                            }
                        } else if (diameter <= size) {
                            a = 0;
                        }
                        p.fill( fill.concat(a) );
                        p.stroke(outline);
                        p.strokeWeight(e.components.appearance.strokeWeight);
                        p.arc(0, 0, diameter, diameter, 
                              startArc, startArc + stepArc, p.PIE);
                        startArc = stepArc * (i+1);
                    }
                } else if (length > 0) {
                    // Draw circle.
                    fill = e.components.hasInventory.inventory[0];
                    if (open >= size * 3) {
                        alpha = 255;
                        open += expand;
                        stroke = colors.GRAY;
                    }
                    p.fill( fill.concat(alpha) );
                    p.stroke(stroke);
                    p.strokeWeight(e.components.appearance.strokeWeight);
                    p.ellipse(0, 0, open, open);
                }
                p.pop();
            }
        }
    };

    ECS.systems.resizeInventory = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (e.components.hasInventory && e.components.appearance) {
                var size = e.components.appearance.size;
                // Player logic
                if (e.components.playerControlled) {
                    var gamepad = navigator.getGamepads()[0],
                        rJoy = new p5.Vector(gamepad.axes[2], gamepad.axes[3]);
                    if (Math.abs(rJoy.x) > 0.25 || Math.abs(rJoy.y) > 0.25) {
                        if (e.components.hasInventory.open < size * 3) {
                            e.components.hasInventory.open += 15; 
                        }
                    } else if (e.components.hasInventory.open > size) { 
                        e.components.hasInventory.open -= 15;
                    }
                } else {
                    // TODO: NPC logic
                }
                e.components.hasInventory.open = 
                    p.constrain(e.components.hasInventory.open, size, size * 3);
            }
        }
    };

    ECS.systems.updateEquipped = function(entities) {
        // Set equipped and update appearance variables
        for (var id in entities) {
            var e = entities[id];
            if (e.components.hasInventory && e.components.appearance) {
                var length = e.components.hasInventory.inventory.length;
                // Player logic
                if (e.components.playerControlled && length > 0 && 
                    e.components.hasInventory.open >= e.components.appearance.size * 3) {
                    var gamepad = navigator.getGamepads()[0],
                        rJoy = new p5.Vector(gamepad.axes[2], gamepad.axes[3]),
                        dir = rJoy.heading() > 0 ? rJoy.heading() : p.TWO_PI + rJoy.heading(),
                        theta = p.TWO_PI / length,
                        idx = Math.floor(dir / theta);
                    e.components.hasInventory.equipped = 
                        e.components.hasInventory.inventory[idx];
                } else {
                    // TODO: NPC logic
                }
            }
        }
    };

    ECS.systems.updateAcceleration = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (e.components.location && e.components.mover) {
                // Player logic
                if (e.components.playerControlled) {
                    var gamepad = navigator.getGamepads()[0];
                    e.components.mover.acc.set(gamepad.axes[0], gamepad.axes[1]);
                    if (e.components.mover.acc.magSq() < 1) {
                        e.components.mover.acc = e.components.mover.vel.copy();
                        e.components.mover.acc.rotate(Math.PI);
                        e.components.mover.acc.mult(0.05);
                    }
                } else {
                    // TODO: autonomous behaviors
                }
            }
        }
    };

    ECS.systems.detectCollisions = function(entities) {
        // TODO: spatial hash optimization
        for (var id1 in entities) {
            var e1 = entities[id1],
                hit = false;
            if (!e1.components.collider || !e1.components.appearance) { continue; }
            for (var id2 in entities) {
                if (id1 === id2) { continue; }
                var e2 = entities[id2];
                if (!e2.components.collider || !e2.components.appearance) { continue; }
                var larger = p.max(e1.components.appearance.size, 
                                    e2.components.appearance.size),
                    d = p5.Vector.dist(e1.components.location.loc, 
                                       e2.components.location.loc);
                if (d <= larger) {
                    hit = true;
                }
            }
            e1.components.collider.hit = hit;
        }
    };

    ECS.systems.updateLocation = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (e.components.mover && e.components.location) {
                e.components.mover.vel.add(e.components.mover.acc);
                e.components.mover.vel.limit(e.components.mover.maxSpeed);
                e.components.location.loc.add(e.components.mover.vel);
                if (e.components.boundByScreen.bound && e.components.appearance) {
                    e.components.location.loc.x = 
                        p.constrain(e.components.location.loc.x, 
                                    e.components.appearance.size/2, 
                                    p.width - e.components.appearance.size/2);
                    e.components.location.loc.y = 
                        p.constrain(e.components.location.loc.y, 
                                    e.components.appearance.size/2, 
                                    p.height - e.components.appearance.size/2);
                }    
                // Eliminate very small numbers
                if (e.components.mover.vel.magSq() < 0.01) { 
                    e.components.mover.vel.set(0, 0); 
                }
            }
        }        
    };
    /**************************************************************************/
};
/*******************************************************************************
Main
*******************************************************************************/
window.onload = function() {
    var p5sketch = new p5(sketch, 'p5-sketch');
};
/*******************************************************************************
Notes
*******************************************************************************
Supported shapes: 
* Circles only. Single size parameter used for rendering and collision checks.
/*******************************************************************************
References
********************************************************************************
Gamepad API:
* https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/
UUID:
* http://stackoverflow.com/a/8809472
ECS:
* http://vasir.net/blog/game-development/how-to-build-entity-component-system-in-javascript
*******************************************************************************/