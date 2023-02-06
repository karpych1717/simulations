'use strict'

//files prep
const negSmallPic = new Image();
const negBigPic   = new Image();
const posSmallPic = new Image();
const posBigPic   = new Image();

const arrowPic    = new Image();


negSmallPic.src   = './img/negative_small.png';
negBigPic.src     = './img/negative_big.png';
posSmallPic.src   = './img/positive_small.png';
posBigPic.src     = './img/positive_big.png';

arrowPic.src      = './img/arrow.png';


//class prep
class Circle {
    constructor(x, y, r) {
        this.offsetX = x;
        this.offsetY = y;
        this.r = r;
    }

    midpointDistanceTo(obj) {
        return Math.sqrt( (obj.offsetX - this.offsetX)**2 + (obj.offsetY - this.offsetY)**2 );
    }

    isUnder(obj) {
        return this.midpointDistanceTo(obj) <= this.r ? true : false;
    }
}

class Rectangle {
    constructor(x, y, width, height) {
        this.offsetX = x;
        this.offsetY = y;
        this.width   = width;
        this.height  = height;

        this.left  = x;
        this.right = x + width;
        this.top   = y;
        this.bot   = y + height;
    }

    isUnder(obj) {
        if ( obj.offsetX < this.left ) {
            return false;
        }
        if ( obj.offsetY < this.top ) {
            return false;
        }
        if ( obj.offsetX > this.right ) {
            return false;
        }
        if ( obj.offsetY > this.bot ) {
            return false;
        }

        return true;
    }
}

class ChargedBall extends Circle {
    constructor(x, y, r, charge, isImmobile, relatives, box) {
        super(x + box.offsetX, y + box.offsetY, r);

        this.box = box;

        this.Vx = 0;
        this.Vy = 0;

        this.Fx = 0;
        this.Fy = 0;

        this.charge = charge;
        this.isImmobile = isImmobile;
        this.relatives = relatives;

        this.picture = isImmobile ?
            ( (charge > 0) ? posSmallPic : negSmallPic )
            :
            ( (charge > 0) ? posSmallPic : negSmallPic );
    }

    drawIt(ctx) {
        ctx.drawImage( this.picture,
                       Math.floor(this.offsetX - this.r),
                       Math.floor(this.offsetY - this.r)
                     );
    }

    countForce() {
        this.Fx = 0;
        this.Fy = 0;

        for(const ball of this.relatives) {
            if (ball === this) continue;

            tempRx = this.offsetX - ball.offsetX;
            tempRy = this.offsetY - ball.offsetY;

            tempR  = Math.sqrt( tempRx**2 + tempRy**2 );

            tempFx = this.charge * ball.charge / tempR**3 * tempRx;
            tempFy = this.charge * ball.charge / tempR**3 * tempRy;

            this.Fx += tempFx;
            this.Fy += tempFy;
        }
    }

    moveByField(dt) {
        this.Vx += dt * this.Fx;
        this.Vy += dt * this.Fy;

        this.offsetX  += dt * this.Vx;
        this.offsetY  += dt * this.Vy;


        this.box.wallEffect(this);
    }

}

class Box extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    wallEffect(ball) {
        if ( ball.offsetX < this.left + ball.r  && ball.Vx < 0 ) {
            ball.Vx *= -1;
        } else if ( ball.offsetX < this.left + ball.r && ball.Vx === 0) {
            ball.Vx = 100;
        }

        if ( ball.offsetY < this.top + ball.r && ball.Vy < 0 ) {
            ball.Vy *= -1;
        } else if ( ball.offsetY < this.top + ball.r && ball.Vy === 0) {
            ball.Vy = 100;
        }

        if ( ball.offsetX > this.right - ball.r && ball.Vx > 0 ) {
            ball.Vx *= -1;
            console.log('mmm');
        } else if ( ball.offsetX > this.right - ball.r && ball.Vx === 0 ) {
            ball.Vx = -100;
            console.log('wow');
        }

        if ( ball.offsetY > this.bot - ball.r  && ball.Vy > 0 ) {
            ball.Vy *= -1;
        } else if ( ball.offsetY > this.bot - ball.r  && ball.Vy === 0 ) {
            ball.Vy = -100;
        }
    }
}

class Arrow {
    constructor(x, y, angle, balls, opacity = 1, box) {
        this.offsetX = x + box.offsetX;
        this.offsetY = y + box.offsetY;

        this.Fx = 0;
        this.Fy = 0;

        this.angle   = angle;
        this.opacity = opacity;

        this.picture = arrowPic;

        //this.relatives = relatives;
        this.balls   = balls;
    }

    countForceAndAngle() {
        this.Fx = 0;
        this.Fy = 0;


        for(const ball of balls) {
            tempRx = this.offsetX + 13 - ball.offsetX;
            tempRy = this.offsetY + 4 - ball.offsetY;

            tempR  = Math.sqrt( tempRx**2 + tempRy**2 );

            tempFx = ball.charge / tempR**3 * tempRx;
            tempFy = ball.charge / tempR**3 * tempRy;

            this.Fx += tempFx;
            this.Fy += tempFy;
        }


        this.angle = Math.atan(this.Fy / this.Fx);
        if(this.Fx < 0) {
            this.angle += Math.PI;
        }

        this.opacity = 1 - Math.exp( -1000 *(Math.abs(this.Fx) + Math.abs(this.Fy)) );
    }

    drawIt(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.offsetX + 13, this.offsetY + 4);
        ctx.rotate(this.angle);
        ctx.translate(-13 - this.offsetX, -4 - this.offsetY);

        ctx.drawImage(this.picture, this.offsetX, this.offsetY);

        ctx.translate(this.offsetX + 13, this.offsetY + 4);
        ctx.rotate(-this.angle);
        ctx.translate(-13 - this.offsetX, -4 - this.offsetY);
        ctx.globalAlpha = 1;
    }
}


//will be used in force counting
let tempR;
let tempRx;
let tempRy;

let tempF;
let tempFx;
let tempFy;


const mainBox = new Box(10, 10, 500, 500);

//canvas
const cvs = document.getElementById('boxCanvas');
const ctx = cvs.getContext('2d');

cvs.width  = 645;
cvs.height = 520;
cvs.style.border  = '2px solid green';


const pre_cvs = document.createElement("canvas");
const pre_ctx = pre_cvs.getContext('2d');

pre_cvs.height = 520;
pre_cvs.width  = 645;

pre_ctx.fillStyle = 'white';


let movingBall = null;
let relativeX = 0;
let relativeY = 0;


//events
cvs.addEventListener('pointerdown', targetOnClick);

cvs.addEventListener('pointermove', moveByMouse);

window.addEventListener('pointerup', releaseTarget);



const balls = [];

for(let i = 0; i < 3; i++) {
    balls.push(new ChargedBall(100 + Math.random()*300, 100 + Math.random()*300,
                                10, 1, true,
                                  balls, mainBox) );
}

const arrows = [];

for(let i = 0; i < 500; i += 25) {
    for(let j = 8; j < 500; j += 25) {
        arrows.push( new Arrow(i, j, 0, balls, 1, mainBox) );
    }
}



// Time watch;
let now    = new Date().getTime();
let dt     = 0;
let dtHalf = 0
let prev   = now;

const maxDt = 33;


//render function
function render() {
    now  = new Date().getTime();
    dt   = now - prev;
    dt   = Math.min(dt, maxDt);
    prev = now;

    dtHalf = dt / 2;

    pre_ctx.fillRect(0, 0, 645, 520);

    for(const arrow of arrows) {
        arrow.drawIt(pre_ctx);
    }

    for(const ball of balls) {
        ball.drawIt(pre_ctx);
    }


    ctx.drawImage(pre_cvs, 0, 0);


    for(const ball of balls) {
        if( ball === movingBall ) continue;
        ball.countForce();
    }


    for(const ball of balls) {
        if( ball === movingBall ) continue;
        ball.moveByField(dtHalf);
    }

    for(const ball of balls) {
        if( ball === movingBall ) continue;
        ball.countForce();
    }

    for(const arrow of arrows) {
        arrow.countForceAndAngle();
    }

    for(const ball of balls) {
        if( ball === movingBall ) continue;
        ball.moveByField(dtHalf);
    }

    requestAnimationFrame(render);
}

render();




function targetOnClick(event) {
    for(let i = 0; i < balls.length; i++ ) {
        if( balls[balls.length - 1 - i].midpointDistanceTo(event) < balls[balls.length - 1 - i].r) {
            movingBall = balls[balls.length - 1 - i];

            movingBall.Vx = 0;
            movingBall.Vy = 0;
            movingBall.Fx = 0;
            movingBall.Fy = 0;

            relativeX = movingBall.offsetX - event.offsetX;
            relativeY = movingBall.offsetY - event.offsetY;

            break;
        }
    }

    if ( movingBall !== null && balls.indexOf(movingBall) !== balls.length - 1 ) {
        for(let i = balls.indexOf(movingBall); i < balls.length - 1; i++) {
            balls[i] = balls[i + 1];
        }

        balls[balls.length - 1] = movingBall;
    }
}

function moveByMouse(event) {
    if (movingBall !== null) {
        movingBall.offsetX = event.offsetX + relativeX;
        movingBall.offsetY = event.offsetY + relativeY;
    }
}

function releaseTarget(event) {
    if (movingBall !== null) {
        movingBall.offsetX = event.offsetX + relativeX;
        movingBall.offsetY = event.offsetY + relativeY;

        movingBall = null;
        relativeX = 0;
        relativeY = 0;
    }
}