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
        ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
        ctx.stroke();
    };

    rotate(speed) {
        this.angle += speed / 180 * Math.PI;
    };

};


//render prep
const circle1 = new Circle;
const circle2 = new Circle;

circle2.angle = Math.PI / 3;
circle2.r     = 100;

circle2.mix   = function(circle) {
    this.first.red   = Math.max(circle1.first.red,   circle1.second.red);
    this.first.green = Math.max(circle1.first.green, circle1.second.green);
    this.first.blue  = Math.max(circle1.first.blue,  circle1.second.blue);

    this.second.red   = Math.max(circle1.second.red,   circle1.third.red);
    this.second.green = Math.max(circle1.second.green, circle1.third.green);
    this.second.blue  = Math.max(circle1.second.blue,  circle1.third.blue);

    this.third.red   = Math.max(circle1.third.red,   circle1.first.red);
    this.third.green = Math.max(circle1.third.green, circle1.first.green);
    this.third.blue  = Math.max(circle1.third.blue,  circle1.first.blue);
};

circle2.mix(circle1);

const solidCircle = {
    red:   255,
    green: 255,
    blue:  255,

    r: 35,

    cx: 250,
    cy: 250,

    get color() {
        return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
    },

    mix(circle) {
        this.red   = Math.max(circle.first.red,   circle.second.red,   circle.third.red);
        this.green = Math.max(circle.first.green, circle.second.green, circle.third.green);
        this.blue  = Math.max(circle.first.blue,  circle.second.red,   circle.third.blue);
    },

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
        ctx.stroke();
    },
}


//color ranges
const sector_1       = document.getElementById('sector-1');
const sector_1_red   = document.getElementById('sector-1-red');
const sector_1_green = document.getElementById('sector-1-green');
const sector_1_blue  = document.getElementById('sector-1-blue');

const sector_2       = document.getElementById('sector-2');
const sector_2_red   = document.getElementById('sector-2-red');
const sector_2_green = document.getElementById('sector-2-green');
const sector_2_blue  = document.getElementById('sector-2-blue');

const sector_3       = document.getElementById('sector-3');
const sector_3_red   = document.getElementById('sector-3-red');
const sector_3_green = document.getElementById('sector-3-green');
const sector_3_blue  = document.getElementById('sector-3-blue');

sector_1.style.backgroundColor = 'rgb(255, 0, 0)';
sector_1_red.value   = 255;
sector_1_green.value = 0;
sector_1_blue.value  = 0;

sector_2.style.backgroundColor = 'rgb(0, 255, 0)';
sector_2_red.value   = 0;
sector_2_green.value = 255;
sector_2_blue.value  = 0;

sector_3.style.backgroundColor = 'rgb(0, 0, 255)';
sector_3_red.value   = 0;
sector_3_green.value = 0;
sector_3_blue.value  = 255;


sector_1_red.oninput   = () => {
    circle1.first.red   = sector_1_red.value;
    sector_1.style.backgroundColor = circle1.first_color;

    circle2.mix(circle1);
    solidCircle.mix(circle2);
};
sector_1_green.oninput = () => {
    circle1.first.green = sector_1_green.value;
    sector_1.style.backgroundColor = circle1.first_color;
    
    circle2.mix(circle1);
    solidCircle.mix(circle2);
};
sector_1_blue.oninput  = () => {
    circle1.first.blue  = sector_1_blue.value;
    sector_1.style.backgroundColor = circle1.first_color;
    
    circle2.mix(circle1);
    solidCircle.mix(circle2);
};

sector_2_red.oninput   = () => {
    circle1.second.red   = sector_2_red.value;
    sector_2.style.backgroundColor = circle1.second_color;
    
    circle2.mix(circle1);
    solidCircle.mix(circle2);
};
sector_2_green.oninput = () => {
    circle1.second.green = sector_2_green.value;
    sector_2.style.backgroundColor = circle1.second_color;
    
    circle2.mix(circle1);
    solidCircle.mix(circle2);
};
sector_2_blue.oninput  = () => {
    circle1.second.blue  = sector_2_blue.value;
    sector_2.style.backgroundColor = circle1.second_color;
    
    circle2.mix(circle1);
    solidCircle.mix(circle2);
};

sector_3_red.oninput   = () => {
    circle1.third.red   = sector_3_red.value;
    sector_3.style.backgroundColor = circle1.third_color;
    
    circle2.mix(circle1);
    solidCircle.mix(circle2);
};
sector_3_green.oninput = () => {
    circle1.third.green = sector_3_green.value;
    sector_3.style.backgroundColor = circle1.third_color;
    
    circle2.mix(circle1);
    solidCircle.mix(circle2);
};
sector_3_blue.oninput  = () => {
    circle1.third.blue  = sector_3_blue.value;
    sector_3.style.backgroundColor = circle1.third_color;
    
    circle2.mix(circle1);
    solidCircle.mix(circle2);
};


//FPS counter prep
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
    circle2.rotate(speed);
    

    circle1.draw(pre_ctx);
    circle2.draw(pre_ctx);

    solidCircle.draw(pre_ctx);
    

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

        pre_ctx.fillStyle = '#000000';
        pre_ctx.fillRect(0, 0, 90, 55);
        pre_ctx.fillStyle = '#ffff00';
        pre_ctx.fillText(avarage_fps, 5, 40, 80);

        fps_array.length = 0;
    }


    ctx.drawImage(pre_cvs, 0, 0);

    requestAnimationFrame(render);
}


//here we are
render();
