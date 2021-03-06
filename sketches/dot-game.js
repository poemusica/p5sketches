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

    var game = {
            state: null,
            systems: [],
            entities: {},
            color: null,
            over: false,
        },
        ECS = {
            Entity: {},
            Components: {},
            Assemblages: {},
            systems: {},
            entities: {}
        },
        state = {},
        error = {},
        timeoutID;
    /***************************************************************************
    Native p5 commands
    ***************************************************************************/
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        
        game.entities = game.initializeEntities();
        ECS.entities = game.entities;
        game.systems = [
            'wander',
            'seek',
            'detectCollisions',
            'updateAcceleration',
            'updateLocation',
            'resizeInventory',
            'updateEquipped',
            'updateEmote',
            'renderBoundaries',
            'renderCircle',
            'renderEmote',
            'renderInventory'
        ];

        checkBrowserSupport();
    };

    p.draw = function () {
        game.state();
    };

    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        // TODO: resize walls
    };
    /***************************************************************************
    Gamepad utils
    ***************************************************************************/
    function checkBrowserSupport() {
        if (!navigator.getGamepads){
            game.state = state.error(error.unsupported);
        } else {
            gamepadReady(function() { game.state = state.ready; }, 
                         error.disconnected);
        }
    }

    function gamepadReady(callback, error) {
        if (navigator.getGamepads()[0] == undefined) {
            game.state = state.error(error);
        } else {
            callback();
        }
    }
    /***************************************************************************
    Game logic
    ***************************************************************************/
    game.alternateColor = function() {
        var normalInterval = getRandomInt(5000, 10000);
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
            var swappingInterval = getRandomInt(500, 3000);
            game.state = state.colorSwap;
            clearTimeout(timeoutID);
            timeoutID = setTimeout(function() { 
                var choices = [colors.BLUE, colors.GREEN, colors.YELLOW,
                               colors.ORANGE, colors.RED],
                idx = getRandomInt(0, choices.length);
                game.fill = choices[idx];
                ECS.systems.uniformFill(ECS.entities);
                game.state = state.play;
                game.alternateColor();
            }, swappingInterval);

        }, normalInterval);
    };

    game.initializeEntities = function() {
        var entities = {};
        // Note: Assumes default rect and ellipse modes.
        // Make player.
        var player = new ECS.Assemblages.Player({
            loc: new p5.Vector(p.width/2, p.height/2),
            inventory: [colors.BLUE, colors.GREEN, colors.YELLOW, colors.ORANGE,
                        colors.RED],
            shape: 'circle',
            size: 50,
        });
        entities[player.id] = player;
        // Make NPCs.
        for (var i = 0; i < 10; i++) {
            var npc = new ECS.Assemblages.NPC({
                shape: 'circle', 
                size: 50,
                fill: [0,0],
                maxSpeed: 2
            });
            entities[npc.id] = npc;
        }
        // Make walls.
        var walls = [
            {x: 10, y: 10, width: p.width - 20, height: 10},
            {x: 10, y: p.height - 20, width: p.width - 20, height: 10},
            {x: 10, y: 10, width: 10, height: p.height - 20},
            {x: p.width - 20, y: 10, width: 10, height: p.height - 20}, 
        ];
        for (var i = 0; i < walls.length; i++) {
                var data = walls[i],
                    wall = new ECS.Assemblages.StaticBoundary({
                        loc: new p5.Vector(data.x, data.y),
                        shape: 'rectangle',
                        width: data.width,
                        height: data.height,
                    });
            entities[wall.id] = wall;
        }

        return entities;
    };
    /***************************************************************************
    Error messages
    ***************************************************************************/
    error.generic = "An error has occurred."
                    + "\nPlease reconnect your gamepad and refresh the page."
    error.disconnected = "Gamepad disconnected." +
                        "\nPlease reconnect your gamepad and refresh the page.";
    error.unsupported = "Your browser does not support gamepads."
                        + "\nPlease try again using Chrome."
    /***************************************************************************
    Program states
    ***************************************************************************/
    state.error = function(msg) {
        var message = msg || error.generic;
        p.background(0);
        p.fill(255);
        p.textSize(18);
        p.textAlign(p.CENTER);
        p.text(message, p.width/2, p.height/2);
        p.noLoop();
    };

    state.calibrate = function () {
        setTimeout(function() {
            gamepadReady(function() {
                var gamepad = navigator.getGamepads()[0];
                game.state = state.ready;
                p.loop();
            }, error.disconnected);
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
                game.state = state.play;
                game.alternateColor();
            }
        }, error.disconnected);
    };

    state.play = function() {
        gamepadReady(function() {

            p.background(colors.GRAY);

            for (var i = 0; i < game.systems.length; i++) {
                var wait = ECS.systems[game.systems[i]](ECS.entities);
            }

            if (game.over) { game.state = state.over; }

        }, error.disconnected);
    };

    state.over = function() {
        gamepadReady(function() {

            clearTimeout(timeoutID);

            p.background(colors.GRAY.concat(150));
            p.fill(255);
            p.textAlign(p.CENTER);
            p.textSize(36);
            p.text("Game Over", p.width/2, p.height/2);
            p.textSize(18);
            p.text("Thanks for playing.", p.width/2, p.height/2 + 36);
            p.noLoop();

        }, error.disconnected);
    };

    state.colorSwap = function() {
        gamepadReady(function() {

            p.background(colors.GRAY);
            ECS.systems.randomFill(ECS.entities);

            for (var i = 0; i < game.systems.length; i++) {
                ECS.systems[game.systems[i]](ECS.entities);
            }

            if (game.over) { game.state = state.over; }

        }, error.disconnected);
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
        this.shape = params ? params.shape || false : false;
        this.size = params ? params.size || false : false;
        this.width = params ? params.width || false : false;
        this.height = params ? params.height || false : false;
        this.base = params ? params.base || false : false;
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

    ECS.Components.Collider = function( params ) {
        this.hit = false;
        this.collisionForce = new p5.Vector(0, 0);
        return this;
    };
    ECS.Components.Collider.prototype.name = 'collider';

    ECS.Components.Wanderer = function( params ) {
        this.wanderTheta = 0;
        this.wanderForce = new p5.Vector(0, 0);
        return this;
    };
    ECS.Components.Wanderer.prototype.name = 'wanderer';

    ECS.Components.Seeker = function( params ) {
        this.seekForce = new p5.Vector(0, 0);
        return this;
    };
    ECS.Components.Seeker.prototype.name = 'seeker';

    ECS.Components.Emoter = function( params ) {
        this.emoting = false;
        this.size = 0;
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
            entity.addComponent( new ECS.Components.Wanderer(params) );
            entity.addComponent( new ECS.Components.Seeker(params) );
            return entity;
        },
        StaticBoundary: function ( params ) {
            var entity = new ECS.Entity();
            entity.addComponent( new ECS.Components.Appearance(params) );
            entity.addComponent( new ECS.Components.Collider(params) );
            entity.addComponent( new ECS.Components.Location(params) );
            return entity;            
        }
    };
    /***************************************************************************
    System definitions
    ***************************************************************************/
    ECS.systems.renderCircle = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (e.components.appearance && e.components.appearance.size 
                && e.components.location) {
                var fill = e.components.appearance.fill,
                    stroke = e.components.appearance.stroke;
                if (e.components.hasInventory && e.components.playerControlled) {
                    var equipped = e.components.hasInventory.equipped;
                    stroke = equipped || stroke;
                } else if (e.components.hasInventory) {
                    var equipped = e.components.hasInventory.equipped;
                    fill = equipped || fill;
                }
                p.push();
                p.translate(e.components.location.loc.x, 
                            e.components.location.loc.y);
                p.fill(fill);
                p.stroke(stroke);
                p.strokeWeight(e.components.appearance.strokeWeight);
                p.ellipse(0, 0, e.components.appearance.size, 
                          e.components.appearance.size);
                if (e.components.collider && e.components.collider.hit) {
                    p.fill(stroke);
                    p.stroke(stroke);
                    p.ellipse(0, 0, 5, 5);
                }
                p.pop();
            }
        }
    };

    ECS.systems.renderEmote = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (e.components.emoter && e.components.emoter.emoting
                && e.components.location && e.components.appearance
                && e.components.hasInventory && e.components.hasInventory.equipped) {
                var alpha = p.map(e.components.emoter.size, 
                                  e.components.appearance.size,
                                  e.components.appearance.size * 3, 255, 0),
                    stroke = e.components.hasInventory.equipped;
                p.push();
                p.translate(e.components.location.loc.x, 
                            e.components.location.loc.y);
                p.noFill();
                p.stroke(stroke.concat(alpha));
                p.strokeWeight(e.components.appearance.strokeWeight);
                p.ellipse(0, 0, e.components.emoter.size, e.components.emoter.size);
                p.pop();
            }
        }
    };

    ECS.systems.renderBoundaries = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (e.components.appearance && e.components.location 
                && !e.components.mover) {
                p.push();
                p.translate(e.components.location.loc.x, 
                            e.components.location.loc.y);
                p.fill(e.components.appearance.fill);
                p.stroke(e.components.appearance.stroke);
                p.strokeWeight(e.components.appearance.strokeWeight);
                p.rect(0, 0, e.components.appearance.width,
                        e.components.appearance.height);
                p.pop();
            }
        }
    };

    ECS.systems.renderInventory = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (e.components.location && e.components.appearance
                && e.components.appearance.size
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
            if (!e.components.hasInventory || !e.components.appearance) { continue; }
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
    };

    ECS.systems.uniformFill = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (!e.components.hasInventory
                || e.components.playerControlled) { continue; }
            e.components.hasInventory.equipped = game.fill || false;
        }
    };

    ECS.systems.randomFill = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (!e.components.hasInventory
                || e.components.playerControlled) { continue; }
            var choices = [colors.BLUE, colors.GREEN, colors.YELLOW,
                           colors.ORANGE, colors.RED],
                idx = getRandomInt(0, choices.length);
            if (Math.random() > 0.98) {
                e.components.hasInventory.equipped = choices[idx];
            }
        }
    };

    ECS.systems.updateEmote = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (!e.components.emoter || !e.components.appearance) { continue; }
            if (e.components.emoter.emoting) {
                var min = e.components.appearance.size,
                    max = e.components.appearance.size * 3;
                e.components.emoter.size += 2;
                e.components.emoter.size = p.constrain(
                    e.components.emoter.size, min, max);
                if (e.components.emoter.size >= max) {
                    e.components.emoter.emoting = false;
                    e.components.emoter.size = 0;
                }
            }
            // Player logic
            if (e.components.playerControlled && !e.components.emoter.emoting 
                && e.components.hasInventory && e.components.hasInventory.equipped) {
                var gamepad = navigator.getGamepads()[0],
                    rTrigger = gamepad.buttons[7].value;
                if (rTrigger > 0.5) {
                    e.components.emoter.emoting = true;
                }
            } else {
                // TODO: NPC logic
            }
            
        }
    };

    ECS.systems.updateEquipped = function(entities) {
        // Set equipped and update appearance variables
        for (var id in entities) {
            var e = entities[id];
            if (!e.components.hasInventory || !e.components.appearance) { continue; }
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
    };

    ECS.systems.updateAcceleration = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (!e.components.location || !e.components.mover) { continue; }
            // Reset acceleration
            e.components.mover.acc.set(0, 0);
            // Player logic
            if (e.components.playerControlled) {
                var gamepad = navigator.getGamepads()[0],
                    playerForce = new p5.Vector(gamepad.axes[0], gamepad.axes[1]);
                e.components.mover.acc.add(playerForce);
            } else {
                // TODO: autonomous behaviors
                if (!e.components.wanderer) { continue; }
                var wanderForce = e.components.wanderer.wanderForce;
                e.components.mover.acc.add(wanderForce);
                if (!e.components.seeker) { continue; }
                var seekForce = e.components.seeker.seekForce;
                e.components.mover.acc.add(seekForce);
            }
            // Apply collision forces
            if (e.components.collider) {
                var collisionForce = e.components.collider.collisionForce;
                e.components.mover.acc.add(collisionForce);
            }
            // Friction / Moving objects naturally come to rest.
            if (e.components.mover.acc.magSq() < 1) {
                e.components.mover.acc = e.components.mover.vel.copy();
                e.components.mover.acc.rotate(Math.PI);
                e.components.mover.acc.mult(0.05);
            }
        }
    };

    ECS.systems.seek = function(entities) {
        for (var id1 in entities) {
            var e1 = entities[id1];
            if (!e1.components.seeker) { continue; }
            e1.components.seeker.seekForce.set(0, 0);
            for (var id2 in entities) {
                if (id1 === id2) { continue; }
                var e2 = entities[id2];
                if (!e1.components.location || !e1.components.mover
                    || !e2.components.location) { continue; }
                if (!e1.components.hasInventory || !e2.components.hasInventory
                    || !e1.components.hasInventory.equipped)
                { continue; }
                if (e1.components.hasInventory.equipped == 
                    e2.components.hasInventory.equipped) { continue; }
                var desired = p5.Vector.sub(e2.components.location.loc,
                                            e1.components.location.loc),
                    steer = p5.Vector.sub(desired, e1.components.mover.vel);
                steer.limit(5);
                e1.components.seeker.seekForce.add(steer);
            }
            e1.components.seeker.seekForce.normalize();
        }
    };  

    ECS.systems.wander = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (!e.components.wanderer || !e.components.mover) { continue; }
            var desired = new p5.Vector(100, 0);
            desired.rotate(e.components.mover.vel.heading());
            e.components.wanderer.wanderTheta += p.random(-p.PI/8, p.PI/8);
            var offset = new p5.Vector(25 * Math.cos(e.components.wanderer.wanderTheta),
                                       25 * Math.sin(e.components.wanderer.wanderTheta));
            desired.add(offset);
            var steer = p5.Vector.sub(desired, e.components.mover.vel);
            steer.limit(5);
            e.components.wanderer.wanderForce = steer;
        }
    };

    ECS.systems.detectCollisions = function(entities) {
        // TODO: spatial hash optimization
        for (var id1 in entities) {
            var e1 = entities[id1],
                hit = false,
                collisionForce = new p5.Vector(0, 0);
            if (!e1.components.collider || !e1.components.appearance
                || !e1.components.mover) { continue; }
            for (var id2 in entities) {
                if (id1 === id2) { continue; }
                var e2 = entities[id2];
                if (!e2.components.collider || !e2.components.appearance) { continue; }
                // Circle hits
                if (e1.components.appearance.shape == 'circle' && 
                    e1.components.appearance.shape == e2.components.appearance.shape) {
                    var rebound = circleCircle(e1.components.location.loc, 
                        e1.components.appearance.size, e2.components.location.loc,
                        e2.components.appearance.size);
                    if (rebound) {
                        collisionForce.add(rebound.normalize());
                        hit = true;
                    }
                    if (rebound && e1.components.playerControlled 
                        && e1.components.hasInventory
                        && e2.components.hasInventory
                        && e2.components.hasInventory.equipped
                        && e1.components.hasInventory.equipped 
                           != e2.components.hasInventory.equipped) {
                        game.over = true;
                    }
                }
                // Rectangle hits
                if (e1.components.appearance.shape == 'circle' && 
                    e2.components.appearance.shape == 'rectangle') {

                    var rebound = circleRect(e1.components.location.loc, 
                                    e1.components.appearance.size,
                                    e2.components.location.loc, 
                                    e2.components.appearance.width, 
                                    e2.components.appearance.height);
                    if (rebound) {
                        collisionForce.add(rebound.normalize());
                        hit = true;
                    }
                }
            }
            e1.components.collider.hit = hit;
            e1.components.collider.collisionForce = collisionForce;
        }
    };

    ECS.systems.updateLocation = function(entities) {
        for (var id in entities) {
            var e = entities[id];
            if (!e.components.mover || !e.components.location) { continue; }
            //TODO: Limit acceleration steering here?
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
    };
    /***************************************************************************
    Collisions
    ***************************************************************************/
    // Note: Assumes default ellipse mode (center) and rect mode (corner).
    function circleCircle(center1, size1, center2, size2) {
        var rebound = p5.Vector.sub(center1, center2),
            d = rebound.mag();
            if (d <= size1/2 + size2/2) { return rebound; }
            return false;
    }

    function circleRect(center, size, corner, w, h) {
        var test = new p5.Vector(center.x, center.y);
        // which edge is closest?
        if (center.x < corner.x) { test.x = corner.x; } // test left edge
        else if (center.x > corner.x + w) { test.x = corner.x + w; } // right edge
        if (center.y < corner.y) { test.y = corner.y; } // top edge
        else if (center.y > corner.y + h) { test.y = corner.y + h; } // bottom edge

        // get distance from closest edges
        var rebound = p5.Vector.sub(center, test),
            d = rebound.mag();
        
        // if the distance is less than the radius, collision!
        if (d <= size/2) { return rebound; }
        return false;
    }
    /***************************************************************************
    Other utils
    ***************************************************************************/
    function randomLoc() {
        return new p5.Vector(p.random(0, p.width), p.random(0, p.height));
    }
    // Returns a random integer between min (included) and max (excluded)
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
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
Collisions:
* http://www.jeffreythompson.org/collision-detection/table_of_contents.php
Random Integer Generator:
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
*******************************************************************************/