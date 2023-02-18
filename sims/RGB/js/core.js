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
            obj.drawIt()
        })
    }

    render() {
        this.evolveAll()
        this.drawAll()

        requestAnimationFrame(this.render);
    }
}