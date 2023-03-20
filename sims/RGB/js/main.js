'use strict'

import { Circle, Slider, Color, Stage } from './core.js'

const BOXWIDTH = 635
const BOXHEIGHT = 500

const circle1 = new Circle(
  new Color(255, 0, 0), new Color(0, 255, 0), new Color(0, 0, 255),
  240, 0, null
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

const speedSlider = new Slider(
  500, 16, 468,
  1, 120, 1, 100
)

const firstSectorSliders = []
for (let i = 0; i < 3; i++) {
  firstSectorSliders.push(
    new Slider(
      500 + 30, 16 + i * 156, 156,
      1, 120, 1, 100
    )
  )
}

const secondSectorSliders = []
for (let i = 0; i < 3; i++) {
  firstSectorSliders.push(
    new Slider(
      500 + 2 * 30, 16 + i * 156, 156,
      1, 120, 1, 100
    )
  )
}

const thirdSectorSliders = []
for (let i = 0; i < 3; i++) {
  firstSectorSliders.push(
    new Slider(
      500 + 3 * 30, 16 + i * 156, 156,
      1, 120, 1, 100
    )
  )
}

const stage = new Stage(
  'boxCanvas', BOXWIDTH, BOXHEIGHT,
  [circle1, circle2, circle3, speedSlider,
     ...firstSectorSliders, ...secondSectorSliders, ...thirdSectorSliders],
  [circle1, circle2, circle3],
  [speedSlider,
    ...firstSectorSliders, ...secondSectorSliders, ...thirdSectorSliders]
)

function render () {
  stage.evolveAll()
  stage.drawAll()

  window.requestAnimationFrame(render)
}

render()
