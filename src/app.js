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

let engine = Engine.create();
let world = engine.world;
let entities = [];
let keyState = {};
let camera;


class PhysicsEntity {
    constructor(body) {
        this.body = body;
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
        endShape();
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
        super(Bodies.rectangle(dim.x, dim.y, dim.w, dim.h, { isStatic: true }));
    }
    update() {


    }
    draw() {
        fill(237, 34, 93);
        noStroke();
        this.drawBodyVertices();
    }
}

class Player extends PhysicsEntity {
    constructor(dim) {
        super(Bodies.rectangle(dim.x, dim.y, dim.w, dim.h, { isStatic: false, friction: .1, frictionAir: 0, inertia: Infinity }))
        this.jumping = false;

    }
    update() {
        this.body.angle = 0;
        this.body.angularVelocity = 0;

        if (keyState["ArrowRight"]) {


            Matter.Body.setVelocity(this.body, { x: 5, y: this.body.velocity.y });
        } else if (keyState["ArrowLeft"]) {

            Matter.Body.setVelocity(this.body, { x: -5, y: this.body.velocity.y });
        }

        if (keyState["Space"] && !this.jumping) {
            this.jumping = true;
            Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -10 });
            setTimeout(() => {
                this.jumping = false;
            }, 1000)
        }

        this.body.angle = 0;
        this.body.angularVelocity = 0;
        // Matter.Body.setAngle(this.body, 0);
        // this.body.angle = 0;




    }
    draw() {

        fill(0, 0, 255);
        noStroke();
        this.drawBodyVertices();
    }
}


function setup() {
    gameDimensions = generateGameDimensions();
    createCanvas(gameDimensions.width, gameDimensions.height);

    setTimeout(() => {
        const c = document.querySelector('canvas');
        c.style.width = '100%';
        c.style.height = '56%';
    })
    // engine = Engine.create();

    // create two boxes and a ground

    entities.push(
        new Ball({
            x: 100,
            y: 15,
            r: 20
        }),
        new Box({
            x: 500,
            y: 200,
            w: 80,
            h: 80
        }),
        new Box({
            x: 200,
            y: 50,
            w: 80,
            h: 80
        }),
        new Wall({
            x: 510,
            y: 500,
            w: 1000,
            h: 60
        }),
        new Player({
            x: 50,
            y: 200,
            w: 30,
            h: 80
        })
    );
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
