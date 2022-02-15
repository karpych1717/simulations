//balls prep
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


//will be used in force countings
let tempR;
let tempRx;
let tempRy;

let tempF;
let tempFx;
let tempFy;


//classes
class ChargedBall {
    constructor(x, y, r, charge, isImmobile, relatives) {
        this.x = x;
        this.y = y;
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

    distance(ball) {
        return Math.sqrt( (ball.x - this.x)**2 + (ball.y - this.y)**2 );
    }

    drawIt(ctx) {
        ctx.drawImage( this.picture, Math.floor(this.x - 10), Math.floor(this.y - 10) );
    }

    countForce() {
        this.Fx = 0;
        this.Fy = 0;

        for(const ball of this.relatives) {
            if (ball === this) continue;

            tempRx = this.x - ball.x;
            tempRy = this.y - ball.y;

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

        this.x  += dt * this.Vx;
        this.y  += dt * this.Vy;


        if ( this.y < 0   && this.Vy < 0 ) {
            this.Vy *= -1;
        }

        if ( this.x < 0  && this.Vx < 0 ) {
            this.Vx *= -1;
        }

        if ( this.y > BoxHeight  && this.Vy > 0 ) {
            this.Vy *= -1;
        }

        if ( this.x > BoxWidth && this.Vx > 0 ) {
            this.Vx *= -1;
        }
    }

}

class Arrow {
    constructor(x, y, angle, balls, opacity = 1) {
        this.x = x;
        this.y = y;

        this.angle   = angle;
        this.opacity = opacity;

        this.picture = arrowPic;

        this.balls = balls;
    }
}


//canvas
const cvs = document.getElementById('boxCanvas');
const ctx = cvs.getContext('2d');

const BoxWidth  = 500;
const BoxHeight = 500;

cvs.width  = BoxWidth;
cvs.height = BoxHeight;
cvs.style.border  = '2px solid green';

let movingBall = null;
let relativeX = 0;
let relativeY = 0;


//events
cvs.addEventListener('mousedown', targetOnClick);

cvs.addEventListener('mousemove', moveByMouse);

window.addEventListener('mouseup', releaseTarget);



const balls = [];

for(let i = 0; i < 5; i++) {
    balls.push(new ChargedBall(100 + Math.random()*300, 100 + Math.random()*300, 10, -1, true, balls));
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

    ctx.clearRect(0, 0, BoxWidth, BoxHeight);
    for(const ball of balls) {
        ball.drawIt(ctx);
    }

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

    for(const ball of balls) {
        if( ball === movingBall ) continue;
        ball.move(dtHalf);
    }

    requestAnimationFrame(render);
}

render();




function targetOnClick(event) {
    for(let i = 0; i < balls.length; i++ ) {
        if( balls[balls.length - 1 - i].distance({x: event.offsetX, y: event.offsetY}) < balls[balls.length - 1 - i].r) {
            movingBall = balls[balls.length - 1 - i];

            movingBall.Vx = 0;
            movingBall.Vy = 0;
            movingBall.Fx = 0;
            movingBall.Fy = 0;

            relativeX = movingBall.x - event.offsetX;
            relativeY = movingBall.y - event.offsetY;

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
        movingBall.x = event.offsetX + relativeX;
        movingBall.y = event.offsetY + relativeY;
    }
}

function releaseTarget(event) {
    if (movingBall !== null) {
        movingBall.x = event.offsetX + relativeX;
        movingBall.y = event.offsetY + relativeY;

        movingBall = null;
        relativeX = 0;
        relativeY = 0;
    }
}