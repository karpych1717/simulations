'use strict'

const BOXWIDTH = 700
const BOXHEIGHT = 500

const sine = {
  offsetX: 0,
  offsetY: 100,
  A: 100,
  T: 190,
  color: 'hsl(50, 100%, 50%)',

  changeColorTo: function (wavelength) {

  },

  drawIt (ctx) {
    ctx.strokeStyle = this.color

    ctx.beginPath()
    ctx.moveTo(this.offsetX, this.offsetY + 100 + this.A)

    for (let i = -10; i <= BOXWIDTH + 10; i += 1) {
      ctx.lineTo(i, this.offsetY + 100 + this.A * Math.cos(2 * Math.PI / this.T * i))
    }

    ctx.stroke()
  }
}

const slider = {

}

const stage = new function (id, width, height, toDraw) {
  this.cvs = document.getElementById(id)
  this.ctx = this.cvs.getContext('2d', { alpha: false })
  this.cvs.width = width
  this.cvs.height = height

  this.pre_cvs = document.createElement('canvas')
  this.pre_ctx = this.pre_cvs.getContext('2d', { alpha: false })

  this.pre_cvs.width = width
  this.pre_cvs.height = height

  this.pre_ctx.lineWidth = 10
  this.pre_ctx.strokeStyle = 'black'

  this.pre_ctx.font = '40px serif'

  this.toDraw = toDraw

  this.drawAll = function () {
    this.toDraw.forEach(obj => {
      obj.drawIt(this.pre_ctx)
    })

    this.ctx.drawImage(this.pre_cvs, 0, 0)
  }
}('boxCanvas', BOXWIDTH, BOXHEIGHT, [sine])

function render () {
  stage.drawAll()

  // requestAnimationFrame(render)
}

render()
