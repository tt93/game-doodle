function generateGameDimensions() {
    const windowWidth = window.innerWidth;
    const targetWidth = 1024
    const targetHeight = (targetWidth * 9) / 16 // 16:9 ratio;
    return {
        width: targetWidth,
        height: targetHeight
    };
}

let gameDimensions = { width: 0, height: 0 };

let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Events = Matter.Events;

let engine = Engine.create();
let world = engine.world;
let entities = [];
let keyState = {};
let camera;


class PhysicsEntity {
    constructor(body) {
        this.body = body;
        this.body.entity = this;
        World.add(engine.world, [this.body]);
    }
    getPosition() {
        return this.body.bounds.min;
    }


    getVertices() {
        return this.body.vertices;
    }

    drawBodyVertices() {
        const vx = this.getVertices();
        beginShape();
        for (let i = 0; i < vx.length; i++) {
            vertex(vx[i].x, vx[i].y);
        }
        endShape(CLOSE);
    }
}

class Ball extends PhysicsEntity {
    constructor(dim) {
        super(Bodies.circle(dim.x, dim.y, dim.r, { isStatic: false }));

    }
    update() {

    }
    draw() {
        fill(0, 0, 0);
        noStroke();
        this.drawBodyVertices();
    }
}

class Box extends PhysicsEntity {
    constructor(dim) {
        super(Bodies.rectangle(dim.x, dim.y, dim.w, dim.h, { isStatic: false }));
    }
    update() {

    }
    draw() {

        fill(237, 34, 93);
        noStroke();
        this.drawBodyVertices();
    }
}

class Wall extends PhysicsEntity {
    constructor(dim) {
        super(Bodies.rectangle(dim.x, dim.y, dim.w, dim.h, { isStatic: true, angle: dim.a || 0 }));
    }
    update() {


    }
    draw() {
        fill(64);
        noStroke();
        this.drawBodyVertices();
    }
}


class Player extends PhysicsEntity {
    constructor(dim) {
        super(Bodies.rectangle(dim.x, dim.y, dim.w, dim.h, { isStatic: false, friction: .25, frictionAir: .02, inertia: Infinity }))

        this.jumping = false;
        this.camera = createCamera();
        setCamera(this.camera);
        this.camera.lookAt(0, 0, 0);

    }
    update() {
        this.body.angle = 0;
        this.body.angularVelocity = 0;

        if (keyState["ArrowRight"]) {


            Matter.Body.setVelocity(this.body, { x: 5, y: this.body.velocity.y });
            // Matter.Body.applyForce(this.body, this.getPosition(), { x: .01, y: 0 })
        } else if (keyState["ArrowLeft"]) {

            Matter.Body.setVelocity(this.body, { x: -5, y: this.body.velocity.y });
            // Matter.Body.applyForce(this.body, this.getPosition(), { x: -.01, y: 0 })
        }

        if (keyState["Space"] && !this.jumping) {
            this.jumping = true;
            // Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -10 });
            Matter.Body.applyForce(this.body, this.getPosition(), { x: 0, y: -.09 })

        }

        // this.body.angle = 0;
        // this.body.angularVelocity = 0;
        // Matter.Body.setAngle(this.body, 0);
        // this.body.angle = 0;
        const position = this.getPosition();
        this.camera.setPosition(position.x, position.y, 1000);



    }
    draw() {

        strokeWeight(2);
        stroke(20, 20, 20);
        fill(50, 200, 200);

        this.drawBodyVertices();
    }

    onCollide(body, entity) {
        // Check to reset jumpflag
        if (entity instanceof Wall) {
            this.jumping = false;
        }

    }
}




function setup() {
    gameDimensions = generateGameDimensions();
    createCanvas(gameDimensions.width, gameDimensions.height, WEBGL);

    setTimeout(() => {

        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;

        let aspectWidth = innerWidth;
        let aspectHeight = (innerWidth * 9) / 16;

        if (aspectHeight > innerHeight) {
            aspectHeight = innerHeight;
            aspectWidth = (innerHeight * 16) / 9;
        }

        const c = document.querySelector('canvas');

        c.style.width = `${aspectWidth}px`;
        c.style.height = `${aspectHeight}px`;
    });

    // engine = Engine.create();

    // create two boxes and a ground

    entities.push(
        new Ball({
            x: 100,
            y: -15,
            r: 20
        }),
        new Box({
            x: -500,
            y: 200,
            w: 80,
            h: 80
        }),
        new Box({
            x: 10,
            y: -50,
            w: 80,
            h: 80
        }),
        new Wall({
            x: 0,
            y: 0,
            w: 1000,
            h: 60
        }),
        new Wall({
            x: 1050,
            y: 10,
            w: 1000,
            h: 60,
            a: 3
        }),
        new Player({
            x: 35,
            y: -10,
            w: 30,
            h: 80
        })
    );

    Events.on(engine, "collisionStart", event => {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            if (bodyA.entity && bodyA.entity.onCollide) {
                bodyA.entity.onCollide(bodyB, bodyB.entity);
            }
            if (bodyB.entity && bodyB.entity.onCollide) {
                bodyB.entity.onCollide(bodyA, bodyA.entity);
            }
        });
    });

    Events.on(engine, "collisionEnd", event => {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
        });
    });
}

function draw() {
    background(222);
    entities.forEach(e => {
        e.update();
        e.draw();
    });



    // Engine.update(engine);
    // Engine.update(engine, 16);
    Engine.update(engine, 1000 / 60);
}

window.addEventListener('keydown', (evt) => {
    keyState[evt.code] = true;
});
window.addEventListener('keyup', (evt) => {
    keyState[evt.code] = false;
});
