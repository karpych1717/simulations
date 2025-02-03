import { drawCTX, noiseCVS } from './canvasSetup.js'
import { DT, HEIGHT, WIDTH } from './parameters.js'

const run = () => setInterval(render, DT)

// gravRadius is proportional to an mass
// so we think of them as of equals
let realRadius = 100
let gravRadius = 150

function render () {
  drawCTX.clearRect(0, 0, WIDTH, HEIGHT)

  if (realRadius >= gravRadius) {
    drawDisc(realRadius, 'green')
    drawCircle(gravRadius, 'black')
    drawCircle(realRadius, 'limeGreen')
  }

  if (realRadius < gravRadius) {
    drawNoiseDisc(gravRadius)
    //drawCircle(gravRadius, 'black')
    drawCircle(realRadius, 'limeGreen')
  }
}

function drawCircle (radius, color, width = 10) {
  drawCTX.save()

  drawCTX.strokeStyle = color
  drawCTX.lineWidth = width

  drawCTX.beginPath()
  drawCTX.arc(WIDTH / 2, HEIGHT / 2, radius, 0, 2*Math.PI)
  drawCTX.stroke()

  drawCTX.restore()
}

function drawDisc (radius, color) {
  drawCTX.save()

  drawCTX.fillStyle = color

  drawCTX.beginPath()
  drawCTX.arc(WIDTH / 2, HEIGHT / 2, radius, 0, 2*Math.PI)
  drawCTX.fill()

  drawCTX.restore()
}

function drawNoiseDisc (radius) {
  drawCTX.save()

  drawCTX.beginPath()
  drawCTX.arc(WIDTH / 2, HEIGHT / 2, radius, 0, 2*Math.PI)
  drawCTX.clip()

  const sx = 4 * Math.round(Math.random() * (WIDTH / 4))
  const sy = 4 * Math.round(Math.random() * (HEIGHT / 4))

  drawCTX.drawImage(noiseCVS, sx, sy, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT)

  drawCTX.restore()
}


export {run}