//canvas
const cvs = document.getElementById('boxCanvas');
const ctx = cvs.getContext('2d');

const pre_cvs = document.createElement("canvas");
const pre_ctx = pre_cvs.getContext('2d');

const BoxHeight = 500;
const BoxWidth  = 500;


cvs.height = BoxHeight;
cvs.width  = BoxWidth;
cvs.style.border  = '2px solid green';

ctx.font = '40px serif';


pre_cvs.height = BoxHeight;
pre_cvs.width  = BoxWidth;

pre_ctx.lineWidth = 6;
pre_ctx.strokeStyle = 'white';


//rotation speed
let speed = 1;
const speedRange = document.getElementById('speed');
speedRange.value = speed;

speedRange.oninput = () => {
    speed = speedRange.value;
};

//Circle
class Circle {
    constructor() {
        this.first  = {red: 255, green: 0,   blue: 0,};
        this.second = {red: 0,   green: 255, blue: 0,};
        this.third  = {red: 0,   green: 0,   blue: 255};

        this.r = 248;

        this.cx = 250;
        this.cy = 250;
        
        this.direction = 1;
        this.angle = 0;
    };

    get first_color() {
        return 'rgb(' + this.first.red + ',' + this.first.green + ',' + this.first.blue + ')';
    };

    get second_color() {
        return 'rgb(' + this.second.red + ',' + this.second.green + ',' + this.second.blue + ')';
    };

    get third_color() {
        return 'rgb(' + this.third.red + ',' + this.third.green + ',' + this.third.blue + ')';
    };

    draw(ctx) {
        ctx.fillStyle = this.first_color;
        ctx.beginPath();
        ctx.moveTo(this.cx, this.cy);
        ctx.arc(this.cx, this.cy, this.r,
            this.direction * this.angle + 0, this.direction * this.angle + Math.PI * 2 / 3);
        ctx.lineTo(this.cx, this.cy);
        ctx.fill();

        ctx.fillStyle = this.second_color;
        ctx.beginPath();
        ctx.moveTo(this.cx, this.cy);
        ctx.arc(this.cx, this.cy, this.r,
            this.direction * this.angle + Math.PI * 2 / 3, this.direction * this.angle + Math.PI * 4 / 3);
        ctx.lineTo(this.cx, this.cy);
        ctx.fill();

        ctx.fillStyle = this.third_color;
        ctx.beginPath();
        ctx.moveTo(this.cx, this.cy);
        ctx.arc(this.cx, this.cy, this.r,
            this.direction * this.angle + Math.PI * 4 / 3, this.direction * this.angle + Math.PI * 2);
        ctx.lineTo(this.cx, this.cy);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.r,
            0, Math.PI * 2);
        ctx.stroke();

    };

    rotate(speed) {
        this.angle += speed / 180 * Math.PI;
    };

};


//render prep
const circle1 = new Circle;

let dt = 0;
let current_time  = new Date().getTime();
let previous_time = current_time;

let fps_array = [];
let current_fps = 0;
let avarage_fps = 0;
let fps_array_max_length = 10;


//render function
function render() {
    circle1.rotate(speed);
    
    circle1.draw(pre_ctx);
    ctx.drawImage(pre_cvs, 0, 0);

    current_time = new Date().getTime();
    dt = current_time - previous_time;
    previous_time = current_time;

    current_fps = Math.floor(1000 / dt);
    if ( fps_array.length < fps_array_max_length ) {
        fps_array.push(current_fps);
    } else if ( fps_array.length >= fps_array_max_length ) {
        avarage_fps  = fps_array.reduce( (prevVal, curVal) => prevVal + curVal );
        avarage_fps /= fps_array_max_length;
        avarage_fps  = Math.floor(avarage_fps);

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 105, 50);
        ctx.fillStyle = '#ffff00';
        ctx.fillText(avarage_fps, 5, 40, 100);

        fps_array.length = 0;
    }

    

    requestAnimationFrame(render);
}


//here we are
render();
