class Stage {
    constructor(id, width, height, toDraw, toEvolve) {
        this.cvs = document.getElementById(id)
        this.ctx = cvs.getContext('2d', {alpha: false})

        this.cvs.width  = width
        this.cvs.height = height


        this.pre_cvs = document.createElement('canvas')
        this.pre_ctx = pre_cvs.getContext('2d', {alpha: false})

        this.pre_cvs.width  = width
        this.pre_cvs.height = height

        this.pre_ctx.lineWidth   = 7
        this.pre_ctx.strokeStyle = 'white'

        this.pre_ctx.font = '40px serif'


        this.toDraw   = toDraw
        this.toEvolve = toEvolve
    }

    evolveAll() {
        this.toEvolve.forEach(obj => {
            obj.evolveIt()
        })
    }

    drawAll() {
        this.toEvolve.forEach(obj => {
            obj.drawIt(this.pre_ctx)
        })

        this.ctx.drawImage(pre_cvs, 0, 0);
    }

    render() {
        this.evolveAll()
        this.drawAll()

        requestAnimationFrame(this.render);
    }
}


class Circle {
    constructor() {
        this.first  = {red: 255, green: 0,   blue: 0,};
        this.second = {red: 0,   green: 255, blue: 0,};
        this.third  = {red: 0,   green: 0,   blue: 255};

        this.r = 248;

        this.offsetX = 250;
        this.offsetY = 250;
        
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

    drawIt(ctx) {
        ctx.fillStyle = this.first_color;
        ctx.beginPath();
        ctx.moveTo(this.offsetX, this.offsetY);
        ctx.arc(this.offsetX, this.offsetY, this.r,
            this.direction * this.angle + 0, this.direction * this.angle + Math.PI * 2 / 3);
        ctx.lineTo(this.offsetX, this.offsetY);
        ctx.fill();

        ctx.fillStyle = this.second_color;
        ctx.beginPath();
        ctx.moveTo(this.offsetX, this.offsetY);
        ctx.arc(this.offsetX, this.offsetY, this.r,
            this.direction * this.angle + Math.PI * 2 / 3, this.direction * this.angle + Math.PI * 4 / 3);
        ctx.lineTo(this.offsetX, this.offsetY);
        ctx.fill();

        ctx.fillStyle = this.third_color;
        ctx.beginPath();
        ctx.moveTo(this.offsetX, this.offsetY);
        ctx.arc(this.offsetX, this.offsetY, this.r,
            this.direction * this.angle + Math.PI * 4 / 3, this.direction * this.angle + Math.PI * 2);
        ctx.lineTo(this.offsetX, this.offsetY);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.offsetX, this.offsetY, this.r, 0, Math.PI * 2);
        ctx.stroke();
    };

    rotate(speed) {
        this.angle += speed / 180 * Math.PI;
    };

};