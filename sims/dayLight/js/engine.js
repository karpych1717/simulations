//sprites
const sunPic = new Image();
const dayPic    = new Image();
const nightPic  = new Image();

sunPic.src   = './img/theSun.png';
dayPic.src   = './img/day.png';
nightPic.src = './img/night.png';


//canvas to rotate the planet
const shaded_planet_cvs = document.createElement('canvas');
const shaded_planet_ctx = shaded_planet_cvs.getContext('2d');

shaded_planet_cvs.width  = 70;
shaded_planet_cvs.height = 70;


const day_planet_cvs = document.createElement('canvas');
const day_planet_ctx = day_planet_cvs.getContext('2d');

day_planet_cvs.width  = 70;
day_planet_cvs.height = 70;


const night_planet_cvs = document.createElement('canvas');
const night_planet_ctx = night_planet_cvs.getContext('2d');

night_planet_cvs.width  = 70;
night_planet_cvs.height = 70;



//canvas
const cvs = document.getElementById('boxCanvas');
const ctx = cvs.getContext('2d', {alpha: false});

const pre_cvs = document.createElement("canvas");
const pre_ctx = pre_cvs.getContext('2d');

const BoxHeight = 500;
const BoxWidth  = 500;


cvs.height = BoxHeight;
cvs.width  = BoxWidth;
cvs.style.border  = '2px solid green';


pre_cvs.height = BoxHeight;
pre_cvs.width  = BoxWidth;

pre_ctx.lineWidth = 7;
pre_ctx.strokeStyle = 'white';

pre_ctx.font = '40px serif';


//speed
let flySpeed = 0.5;
let rotSpeed = 0.5;

const flySpeedRange = document.getElementById('flySpeed');
const rotSpeedRange = document.getElementById('rotSpeed');

flySpeedRange.value = flySpeed;
rotSpeedRange.value = rotSpeed;

flySpeedRange.oninput = () => {
    flySpeed = flySpeedRange.value;
};

rotSpeedRange.oninput = () => {
    rotSpeed = rotSpeedRange.value;
};


//functions
function drawTheSun(ctx) {
    ctx.drawImage(sunPic,
                  BoxWidth  / 2 - sunPic.naturalWidth  / 2,
                  BoxHeight / 2 - sunPic.naturalHeight / 2 );
};

function drawPlanet(ctx, flyAngle = 0, rotAngle = 0) {
    ctx.translate(BoxWidth  / 2 + 185 * Math.cos(flyAngle),
                  BoxHeight / 2 - 185 * Math.sin(flyAngle));

    ctx.rotate(-rotAngle);

    ctx.drawImage(dayPic, -dayPic.naturalWidth  / 2, -dayPic.naturalHeight / 2);

    ctx.rotate(rotAngle);

    ctx.translate(-BoxWidth  / 2 - 185 * Math.cos(flyAngle),
                  -BoxHeight / 2 + 185 * Math.sin(flyAngle));
};

function drawShadedPlanet(ctx, flyAngle = 0, rotAngle = 0) {
    shaded_planet_ctx.fillStyle = 'black';
    shaded_planet_ctx.fillRect(0, 0, 70, 70);


    shaded_planet_ctx.translate(35, 35);
    shaded_planet_ctx.rotate(-flyAngle);
    shaded_planet_ctx.translate(-35, -35);


    day_planet_ctx.translate(35, 35);
    day_planet_ctx.rotate(-rotAngle + flyAngle);
    day_planet_ctx.translate(-35, -35);

    day_planet_ctx.drawImage(dayPic, 0, 0);

    day_planet_ctx.translate(35, 35);
    day_planet_ctx.rotate(rotAngle - flyAngle);
    day_planet_ctx.translate(-35, -35);


    night_planet_ctx.translate(35, 35);
    night_planet_ctx.rotate(-rotAngle + flyAngle);
    night_planet_ctx.translate(-35, -35);

    night_planet_ctx.drawImage(nightPic, 0, 0);

    night_planet_ctx.translate(35, 35);
    night_planet_ctx.rotate(rotAngle - flyAngle);
    night_planet_ctx.translate(-35, -35);


    shaded_planet_ctx.drawImage(day_planet_cvs,    0, 0, 35, 70,  0, 0, 35, 70);
    shaded_planet_ctx.drawImage(night_planet_cvs, 35, 0, 35, 70, 35, 0, 35, 70);

    shaded_planet_ctx.translate(35, 35);
    shaded_planet_ctx.rotate(flyAngle);
    shaded_planet_ctx.translate(-35, -35);

    ctx.drawImage(shaded_planet_cvs,
                  BoxWidth  / 2 + 185 * Math.cos(flyAngle) - dayPic.naturalWidth   / 2,
                  BoxHeight / 2 - 185 * Math.sin(flyAngle) - dayPic.naturalHeight  / 2);
}



//state init
const flyConst = 0.002;
const rotConst = 0.004;

let flyAngle = 0;
let rotAngle = 0;

let current_time  = new Date().getTime();
let previous_time = 0;
let dt            = 0;


//render function
function render() {
    previous_time = current_time;

    current_time = new Date().getTime();
    dt = current_time - previous_time;

    flyAngle += flyConst * flySpeed * dt;
    rotAngle += rotConst * rotSpeed * dt;

    if (flyAngle > 2 * Math.PI) {
        flyAngle -= 2 * Math.PI;
    }

    if (rotAngle > 2 * Math.PI) {
        rotAngle -= 2 * Math.PI;
    }


    pre_ctx.fillStyle = 'black';
    pre_ctx.fillRect(0, 0, BoxWidth, BoxHeight);

    
    //drawPlanet(pre_ctx, flyAngle, rotAngle);
    drawShadedPlanet(pre_ctx, flyAngle, rotAngle);

    drawTheSun(pre_ctx);

    
    ctx.drawImage(pre_cvs, 0, 0);

    requestAnimationFrame(render);
}


//here we are
render();
