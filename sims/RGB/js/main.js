'use strict'

const BOXWIDTH  = 600
const BOXHEIGHT = 500


const toDraw   = []
const toEvolve = []

const stage = new Stage('boxCanvas', BOXWIDTH, BOXHEIGHT, toDraw, toEvolve)

stage.render()