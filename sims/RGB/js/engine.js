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


class Circle {
    constructor() {
        this.first  = {red: 255, green: 0,   blue: 0,};
        this.second = {red: 0,   green: 255, blue: 0,};
        this.third  = {red: 0,   green: 0,   blue: 255};

        this.r = 150;

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
        //alert('s');
    };

    rotate(speed) {
        this.angle += speed / 180 * Math.PI;
    };

};

const circle1 = new Circle;

function render() {
    circle1.rotate(speed);
    
    circle1.draw(ctx);

    requestAnimationFrame(render);
}

render();
