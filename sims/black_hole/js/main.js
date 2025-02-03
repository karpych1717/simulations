'use strict'
import { WIDTH, HEIGHT } from './parameters.js'
import { backCTX, noiseCTX } from './canvasSetup.js'
import { run } from './engine.js'

const nebula_pic = new Image()
const noise_pic = new Image()
nebula_pic.src = './img/orion_nebula_pixalated.png'
noise_pic.src = './img/noise.png'

nebula_pic.onload = () => {backCTX.drawImage(nebula_pic, 0, 0)}
noise_pic.onload = () => {
    noiseCTX.drawImage(noise_pic, 0, 0)
    noiseCTX.drawImage(noise_pic, WIDTH, 0)
    noiseCTX.drawImage(noise_pic, 0, HEIGHT)
    noiseCTX.drawImage(noise_pic, WIDTH, HEIGHT)
}

run()
