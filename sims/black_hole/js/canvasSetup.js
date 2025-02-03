import { WIDTH, HEIGHT } from './parameters.js'

function canvasSetup (id, context, width, height) {
  const cvs = id ? document.getElementById(id) : document.createElement('canvas')
  const ctx = cvs.getContext(context)
  cvs.width = width
  cvs.height = height

  return { cvs, ctx }
}

const { cvs: backCVS, ctx: backCTX } = canvasSetup('back-canvas', '2d', WIDTH, HEIGHT)
const { cvs: drawCVS, ctx: drawCTX } = canvasSetup('draw-canvas', '2d', WIDTH, HEIGHT)
const { cvs: noiseCVS, ctx: noiseCTX } = canvasSetup(null, '2d', 2*WIDTH, 2*HEIGHT)

export {backCTX, drawCTX, noiseCVS, noiseCTX}
