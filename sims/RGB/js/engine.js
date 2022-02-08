//canvas
const cvs = document.getElementById('boxCanvas');
const ctx = cvs.getContext('2d');

const BoxHeight = 500;
const BoxWidth  = 500;

cvs.height = BoxHeight;
cvs.width  = BoxWidth;
cvs.style.border  = '2px solid green';


//drawing
const RGBPic = new Image();
RGBPic.src  = 'img/RGB_3.png';

const draw = () => {
    ctx.drawImage(RGBPic, 100, 100, 300, 300);
};


function render() {
    ctx.translate(250, 250);
    ctx.rotate(Math.PI / 3*2);
    ctx.translate(-250, -250);

    draw();

    requestAnimationFrame(render);
}

RGBPic.addEventListener('load', draw);
RGBPic.addEventListener('load', render);
