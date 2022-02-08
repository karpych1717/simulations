//canvas
const cvs = document.getElementById('boxCanvas');
const ctx = cvs.getContext('2d');

const BoxHeight = 500;
const BoxWidth  = 500;

cvs.height = BoxHeight;
cvs.width  = BoxWidth;
cvs.style.border  = '2px solid green';


let speed = 1;
const speedRange = document.getElementById('speed');
speedRange.value = speed;

speedRange.oninput = () => {
    speed = speedRange.value;
};

//circle parameters
let angle = 0;

let color_1 = 'rgb(255, 0, 0)';
let color_2 = 'rgb(0, 255, 0)';
let color_3 = 'rgb(0, 0, 255)';

let cx = 250;
let cy = 250;
let r = 150;



const drawCircle = () => {
    ctx.fillStyle = color_1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle + 0, angle + Math.PI * 2 / 3);
    ctx.lineTo(cx, cy);
    ctx.fill();

    ctx.fillStyle = color_2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle + Math.PI * 2 / 3, angle + Math.PI * 4 / 3);
    ctx.lineTo(cx, cy);
    ctx.fill();

    ctx.fillStyle = color_3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle + Math.PI * 4 / 3, angle + Math.PI * 2);
    ctx.lineTo(cx, cy);
    ctx.fill();
};

function render() {
    angle += speed / 180 * Math.PI;

    if (angle > 2 * Math.PI) {
        angle = angle - 2 * Math.PI;
    }

    drawCircle();

    requestAnimationFrame(render);
}

render();
