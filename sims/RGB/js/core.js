class Stage {
    constructor(id, width, height, toDraw, toEvolve) {
        this.cvs = document.getElementById(id)
        this.ctx = this.cvs.getContext('2d', {alpha: false})

        this.cvs.width  = width
        this.cvs.height = height


        this.pre_cvs = document.createElement('canvas')
        this.pre_ctx = this.pre_cvs.getContext('2d', {alpha: false})

        this.pre_cvs.width  = width
        this.pre_cvs.height = height

        this.pre_ctx.lineWidth   = 7
        this.pre_ctx.strokeStyle = 'black'

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
        this.toDraw.forEach(obj => {
            obj.drawIt(this.pre_ctx)
        })

        this.ctx.drawImage(this.pre_cvs, 0, 0);
    }
}


class Color {
    constructor(red, green, blue) {
        this._red   = red
        this._green = green
        this._blue  = blue
    }


    set red(red) {
        this._red   = red
    }
    get red() {
        return this._red
    }

    set green(green) {
        this._green = green
    }
    get green() {
        return this._green
    }

    set blue(blue) {
        this._blue  = blue
    }
    get blue() {
        return this._blue
    }

    mix(col1, col2) {
        this._red   = Math.max(col1.red, col2.red)
        this._green = Math.max(col1.green, col2.green)
        this._blue  = Math.max(col1.blue, col2.blue)
    }


    getNormalised() {
        return `rgb(${this._red}, ${this._green}, ${this._blue})`
    }
}


class Slider {
    constructor(x, y, width, height, min, max, step, initVal) {
        this.offsetX = x
        this.offsetY = y

        this.width  = width
        this.height = height

        this.min = min
        this.max = max
        this.step = step
        this.val = initVal
    }

    drawIt(ctx) {
        ctx.fillStyle = 'gray'

        ctx.fillRect(this.offsetX, this.offsetY, this.width, this.height)
    }
}


class Circle {
    constructor(first, second, third, radius, angle, parent) {
        this.first  = first
        this.second = second
        this.third  = third

        this.radius = radius

        this.offsetX = 250
        this.offsetY = 250
        
        this.angle = angle
        this.speed = 1

        this.parent = parent
    };

    get first_color() {
        return this.first.getNormalised()
    };

    get second_color() {
        return this.secong.getNormalised()
    };

    get third_color() {
        return this.third.getNormalised()
    };

    drawIt(ctx) {
        ctx.fillStyle = this.first.getNormalised();
        ctx.beginPath();
        ctx.moveTo(this.offsetX, this.offsetY);
        ctx.arc(this.offsetX, this.offsetY, this.radius,
            this.angle + 0, this.angle + Math.PI * 2 / 3);
        ctx.lineTo(this.offsetX, this.offsetY);
        ctx.fill();

        ctx.fillStyle = this.second.getNormalised();
        ctx.beginPath();
        ctx.moveTo(this.offsetX, this.offsetY);
        ctx.arc(this.offsetX, this.offsetY, this.radius,
            this.angle + Math.PI * 2 / 3, this.angle + Math.PI * 4 / 3);
        ctx.lineTo(this.offsetX, this.offsetY);
        ctx.fill();

        ctx.fillStyle = this.third.getNormalised();
        ctx.beginPath();
        ctx.moveTo(this.offsetX, this.offsetY);
        ctx.arc(this.offsetX, this.offsetY, this.radius,
            this.angle + Math.PI * 4 / 3, this.angle + Math.PI * 2);
        ctx.lineTo(this.offsetX, this.offsetY);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.offsetX, this.offsetY, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    };

    mix() {
        if (this.parent === null) return

        this.first.mix(this.parent.third, this.parent.first)
        this.second.mix(this.parent.first, this.parent.second)
        this.third.mix(this.parent.second, this.parent.third)
    }

    rotate() {
        this.angle -= this.speed / 180 * Math.PI
    };

    evolveIt() {
        this.mix()
        this.rotate()
    }

};