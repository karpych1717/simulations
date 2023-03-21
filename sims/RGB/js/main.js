'use strict'

import { Circle, Slider, Color, Stage, FPS } from './core.js'

const BOXWIDTH = 640
const BOXHEIGHT = 500

const segmentColors = [
  new Color(),
  new Color(), new Color(), new Color(),
  new Color(255, 0, 0), new Color(0, 255, 0), new Color(0, 0, 255)
]

const circle1 = new Circle(
  segmentColors[4], segmentColors[5], segmentColors[6],
  240, 0, null
)
const circle2 = new Circle(
  segmentColors[1], segmentColors[2], segmentColors[3],
  110, Math.PI / 3, circle1
)
const circle3 = new Circle(
  segmentColors[0], segmentColors[0], segmentColors[0],
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
  0, 120, 1, 1
)

const firstSectorSliders = []
for (let i = 0; i < 3; i++) {
  firstSectorSliders.push(
    new Slider(
      500 + 35 + i * 30, 16, 152,
      0, 255, 1, i === 0 ? 255 : 0
    )
  )
}

const secondSectorSliders = []
for (let i = 0; i < 3; i++) {
  secondSectorSliders.push(
    new Slider(
      500 + 35 + i * 30, 16 + 2 + 156, 152,
      0, 255, 1, i === 1 ? 255 : 0
    )
  )
}

const thirdSectorSliders = []
for (let i = 0; i < 3; i++) {
  thirdSectorSliders.push(
    new Slider(
      500 + 35 + i * 30, 16 + 4 + 2 * 156, 152,
      0, 255, 1, i === 2 ? 255 : 0
    )
  )
}

speedSlider.setClients([ circle1, circle2 ], 'speed')

firstSectorSliders[0].color = 'rgb(255, 0, 0)'
firstSectorSliders[0].setClients([ segmentColors[4] ], 'red')

secondSectorSliders[0].color = 'rgb(255, 0, 0)'
secondSectorSliders[0].setClients([ segmentColors[5] ], 'red')

thirdSectorSliders[0].color = 'rgb(255, 0, 0)'
thirdSectorSliders[0].setClients([ segmentColors[6] ], 'red')

firstSectorSliders[1].color = 'rgb(0, 255, 0)'
firstSectorSliders[1].setClients([ segmentColors[4] ], 'green')

secondSectorSliders[1].color = 'rgb(0, 255, 0)'
secondSectorSliders[1].setClients([ segmentColors[5] ], 'green')

thirdSectorSliders[1].color = 'rgb(0, 255, 0)'
thirdSectorSliders[1].setClients([ segmentColors[6] ], 'green')

firstSectorSliders[2].color = 'rgb(0, 0, 255)'
firstSectorSliders[2].setClients([ segmentColors[4] ], 'blue')

secondSectorSliders[2].color = 'rgb(0, 0, 255)'
secondSectorSliders[2].setClients([ segmentColors[5] ], 'blue')

thirdSectorSliders[2].color = 'rgb(0, 0, 255)'
thirdSectorSliders[2].setClients([ segmentColors[6] ], 'blue')

const fps = new FPS(10, 45, 5)

const stage = new Stage(
  'boxCanvas', BOXWIDTH, BOXHEIGHT,
  [fps, circle1, circle2, circle3, speedSlider,
     ...firstSectorSliders, ...secondSectorSliders, ...thirdSectorSliders],
  [fps, circle1, circle2, circle3],
  [speedSlider,
    ...firstSectorSliders, ...secondSectorSliders, ...thirdSectorSliders]
)

function render () {
  stage.evolveAll()
  stage.drawAll()

  window.requestAnimationFrame(render)
}

render()
