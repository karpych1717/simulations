//canvas
const BoxCVS = document.getElementById('boxCanvas');
const BoxCTX = BoxCVS.getContext('2d');

const BoxHeight = 500;
const BoxWidth  = 500;

BoxCVS.height = BoxHeight;
BoxCVS.width  = BoxWidth;
BoxCVS.style.border  = '2px solid green';


const InfoCVS = document.getElementById('infoCanvas');
const InfoCTX = InfoCVS.getContext('2d');

const InfoWidth = 500;

InfoCVS.height = BoxHeight;
InfoCVS.width  = InfoWidth;
InfoCVS.style.border = '2px solid green';

InfoCTX.font = '25px Arial';


//physics
const GRAV   = 0.0003;


//drawing tha ball
const ballPic = new Image();
ballPic.src   = "img/ball.png";

const BallRadius   = 5;
const BallDiameter = 2 * BallRadius;

const TopBorder   = BallRadius;
const LeftBorder  = BallRadius;
const BotBorder   = BoxHeight - BallRadius;
const RightBorder = BoxWidth - BallRadius;


const drawBall  = (x, y) => {
    BoxCTX.drawImage(ballPic, x - BallRadius, y - BallRadius);
}

const clearBall = (x, y) => {
    BoxCTX.clearRect(x - BallRadius, y - BallRadius, BallDiameter, BallDiameter);
}


//init balls
const createBall = () => {
    const x  = Math.floor( BallRadius + Math.random() * (BoxWidth  - BallDiameter) );
    const y  = Math.floor( BallRadius + Math.random() * (BoxHeight - BallDiameter) );

    const vx = (Math.floor( Math.random() * 11 ) - 5)/50;
    const vy = 0;

    const e  = - 2 * GRAV * y;

    return {
        x,
        y,
        vx,
        vy,
        e,
    }
}
const AMOUNT = 10000;
const balls = [];

for (let i = 0; i < AMOUNT; i++) {
    balls.push( createBall() );
}


//table of infos
const AmountOfInfos = 20;
const StepInfos = BoxHeight / AmountOfInfos;

const createNumber = (index) => {
    return {y: StepInfos * index,
            val: [],
            ave: 0,
        }
}

const infos = [];

for (let i = 0; i < AmountOfInfos; i++) {
    infos.push(createNumber(i));
}

const clearInfos = () => {
    for (const info of infos) {
        InfoCTX.fillStyle = '#ffffff';
        InfoCTX.fillRect(0, info.y, 500, 25);
    }
}

const countInfos = () => {
    for (const key in infos) {
        infos[key].val.unshift(0);

        if (infos[key].val.length > 10) {
            infos[key].val.pop();
        }

        for (const ball of balls) {
            if (ball.y > infos[key].y && ball.y <= (infos[key].y + StepInfos) ) {
                infos[key].val[0] += 1;
            }
        }

        infos[key].ave = infos[key].val.reduce( (prevVal, curVal) => prevVal + curVal );
    }
}

const renderInfos = () => {
    let MaxInfo = 1;
    for (const info of infos) {
        if (info.ave > MaxInfo) {
            MaxInfo = info.ave;
        }
    }

    for (const info of infos) {
        InfoCTX.fillStyle = '#fff000';
        InfoCTX.fillRect(0, info.y, 500 * info.ave / MaxInfo, 25);
        InfoCTX.fillStyle = '#000fff';
        //InfoCTX.fillText(info.val, 0, info.y + 25);
    }
}


//render loop
let now = new Date().getTime();
let dt = 0;
let time = now;
const MaximumDT = 17;


function render() {
    //clear canvas
    for (const ball of balls) {
        clearBall(ball.x, ball.y);
    }


    //calculate movement
    now = new Date().getTime();
    dt  = now - time;
    time = now;

    if (dt > MaximumDT) {
        dt = MaximumDT;
    }


    for (const ball of balls) {
        ball.vy = ball.vy + GRAV * dt;

        ball.y  = Math.floor( (ball.vy * ball.vy - ball.e) / 2 / GRAV );

        ball.x += ball.vx * dt;
        

        if ( ball.y < TopBorder   && ball.vy < 0 ) {
            ball.vy *= -1;
        }

        if ( ball.x < LeftBorder  && ball.vx < 0 ) {
            ball.vx *= -1;
        }

        if ( ball.y > BotBorder   && ball.vy > 0 ) {
            ball.vy *= -1;
        }

        if ( ball.x > RightBorder && ball.vx > 0 ) {
            ball.vx *= -1;
        }
    }


    //render canvas
    let counter = 0;
    for (const ball of balls) {
        counter++;
        if (! (counter % 100 === 0) ) {
            continue;
        }
        drawBall(ball.x, ball.y);    
    }

    clearInfos();
    countInfos();
    renderInfos();

    requestAnimationFrame(render);
}

ballPic.onload = render;
