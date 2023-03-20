'use strict'

import { Circle, Slider, Color, Stage } from './core.js'

const BOXWIDTH = 620
const BOXHEIGHT = 500

const circle1 = new Circle(
  new Color(255, 0, 0), new Color(0, 255, 0), new Color(0, 0, 255),
  248, 0, null
)
const circle2 = new Circle(
  new Color(255, 255, 0), new Color(0, 255, 255), new Color(255, 0, 255),
  110, Math.PI / 3, circle1
)
const circle3 = new Circle(
  new Color(255, 255, 255), new Color(255, 255, 255), new Color(255, 255, 255),
  35, 0, circle2
)

circle3.drawIt = function (ctx) {
  ctx.fillStyle = this.first.getNormalised()
  ctx.beginPath()
  ctx.moveTo(this.offsetX, this.offsetY)
  ctx.arc(this.offsetX, this.offsetY, this.radius, 0, 2 * Math.PI)
  ctx.lineTo(this.offsetX, this.offsetY)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(this.offsetX, this.offsetY, this.radius, 0, Math.PI * 2)
  ctx.stroke()
}

const slider1 = new Slider(
  500, 6, 488,
  1, 120, 1, 100
)

const stage = new Stage(
  'boxCanvas', BOXWIDTH, BOXHEIGHT,
  [circle1, circle2, circle3, slider1],
  [circle1, circle2, circle3],
  [slider1]
)

function render () {
  stage.evolveAll()
  stage.drawAll()

  window.requestAnimationFrame(render)
}

render()
