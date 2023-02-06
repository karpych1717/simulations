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
    }

    isUnder(obj) {
        if ( obj.offsetX < this.offsetX ) {
            return false;
        }
        if ( obj.offsetY < this.offsetY ) {
            return false;
        }
        if ( obj.offsetX > this.offsetX + this.width ) {
            return false;
        }
        if ( obj.offsetY > this.offsetY + this.height ) {
            return false;
        }

        return true;
    }
}

class ChargedBall extends Circle {
    constructor(x, y, r, charge, isImmobile, relatives) {
        this.offsetX = x;
        this.offsetY = y;
        this.r = r;

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

    move(dt) {
        this.Vx += dt * this.Fx;
        this.Vy += dt * this.Fy;

        this.offsetX  += dt * this.Vx;
        this.offsetY  += dt * this.Vy;


        if ( this.offsetY < 0 && this.Vy < 0 ) {
            this.Vy *= -1;
        }

        if ( this.offsetY < 0  && this.Vx < 0 ) {
            this.Vx *= -1;
        }

        if ( this.offsetY > BoxHeight  && this.Vy > 0 ) {
            this.Vy *= -1;
        }

        if ( this.offsetX > BoxWidth && this.Vx > 0 ) {
            this.Vx *= -1;
        }
    }

}

class Arrow {
    constructor(x, y, angle, balls, opacity = 1) {
        this.offsetX = x;
        this.offsetY = y;

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


//canvas
const cvs = document.getElementById('boxCanvas');
const ctx = cvs.getContext('2d');

const BoxWidth  = 500;
const BoxHeight = 500;

cvs.width  = BoxWidth;
cvs.height = BoxHeight;
cvs.style.border  = '2px solid green';


const pre_cvs = document.createElement("canvas");
const pre_ctx = pre_cvs.getContext('2d');

pre_cvs.height = BoxHeight;
pre_cvs.width  = BoxWidth;

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
    balls.push(new ChargedBall(100 + Math.random()*300, 100 + Math.random()*300, 10, 1, true, balls));
}

const arrows = [];

for(let i = 0; i < 500; i += 25) {
    for(let j = 8; j < 500; j += 25) {
        arrows.push( new Arrow(i, j, 0, balls, 1) );
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

    pre_ctx.fillRect(0, 0, BoxWidth, BoxHeight);

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
        ball.move(dtHalf);
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
        ball.move(dtHalf);
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