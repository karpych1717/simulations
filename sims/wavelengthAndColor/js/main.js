'use strict'

const BOXWIDTH = 700
const BOXHEIGHT = 500
const SFRAME = 4

const color = {
  h: 160,
  s: 100,
  l: 50,

  getNormalised: function () {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`
  }
}

const sine = {
  offsetX: 0,
  offsetY: 200,
  phi: 0,
  A: 100,
  T: 190,
  color,
  isOnPause: false,

  changeColorTo: function (wavelength) {

  },

  evolveIt (dt) {
    if (this.isOnPause) return

    this.phi += dt / 400

    if (this.phi > 2 * Math.PI) {
      this.phi -= 2 * Math.PI
    }
  },

  drawIt (ctx) {
    ctx.strokeStyle = this.color.getNormalised()

    ctx.beginPath()
    ctx.moveTo(this.offsetX - 10, this.offsetY + this.A * Math.cos(-20 * Math.PI / this.T - this.phi))

    for (let i = -10; i <= BOXWIDTH + 10; i += 1) {
      ctx.lineTo(i, this.offsetY + this.A * Math.cos(2 * Math.PI / this.T * i - this.phi))
    }

    ctx.stroke()
  }
}

const button = {
  offsetX: 620,
  offsetY: 374,
  width: 50,
  height: 50,
  inactive: 0,
  sine,
  isMobile: false,

  isUnder: function (event) {
    if (event.offsetX < this.offsetX || event.offsetY < this.offsetY) return false
    if (event.offsetX > this.offsetX + this.width || event.offsetY > this.offsetY + this.height) return false

    return true
  },

  onPointerDown: function (event) {
    if (this.inactive > 0) return

    sine.isOnPause = !sine.isOnPause
    this.inactive = 10
  },

  evolveIt: function (event) {
    if (this.inactive > 0) this.inactive--
  },

  drawIt: function (ctx) {
    if (sine.isOnPause) {
      ctx.fillStyle = 'hsl(0, 0%, 30%)'
      ctx.beginPath()
      ctx.moveTo(this.offsetX + Math.trunc(this.width / 4), this.offsetY + Math.trunc(this.height / 4))
      ctx.lineTo(this.offsetX + Math.trunc(this.width / 4), this.offsetY + Math.trunc(3 * this.height / 4))
      ctx.lineTo(this.offsetX + Math.trunc(3 * this.width / 4), this.offsetY + Math.trunc(this.height / 2))
      ctx.fill()
    } else {
      ctx.fillStyle = 'hsl(0, 0%, 15%)'
      ctx.fillRect(this.offsetX + Math.trunc(this.width / 5), this.offsetY + Math.trunc(this.height / 4),
        Math.trunc(this.height / 5), Math.trunc(this.height / 2))
      ctx.fillRect(this.offsetX + Math.trunc(3 * this.width / 5), this.offsetY + Math.trunc(this.height / 4),
        Math.trunc(this.height / 5), Math.trunc(this.height / 2))
    }
  }
}

const slider = {
  offsetX: 200,
  offsetY: 400,
  width: 400,
  radius: 15,
  isMobile: true,

  color,
  state: 150,
  wavelength: 487,

  evolveIt: function () {

  },

  drawIt: function (ctx) {
    ctx.strokeStyle = 'hsl(0, 0%, 10%)'

    ctx.beginPath()
    ctx.moveTo(this.offsetX - SFRAME, this.offsetY - SFRAME)
    ctx.lineTo(this.offsetX + this.width + SFRAME, this.offsetY - SFRAME)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(this.offsetX - SFRAME, this.offsetY + SFRAME)
    ctx.lineTo(this.offsetX + this.width + SFRAME, this.offsetY + SFRAME)
    ctx.stroke()

    ctx.strokeStyle = this.color.getNormalised()

    ctx.beginPath()
    ctx.moveTo(this.offsetX, this.offsetY)
    ctx.lineTo(this.offsetX + this.width, this.offsetY)
    ctx.stroke()

    ctx.fillStyle = 'white'
    ctx.fillText(this.wavelength + 'nm', this.offsetX - 170, this.offsetY + 15, 140)

    ctx.beginPath()
    ctx.arc(this.offsetX + this.state, this.offsetY, this.radius, 0, 2 * Math.PI, true)
    ctx.fill()
  },

  isUnder: function (event) {
    const distance = Math.sqrt((event.offsetX - this.offsetX - this.state) ** 2 + (event.offsetY - this.offsetY) ** 2)

    return distance < this.radius
  },

  onPointerDown: function (event) {

  },

  onPointerMove: function (event) {
    if (event.offsetX < this.offsetX || event.offsetX > this.offsetX + this.width) return

    this.state = event.offsetX - this.offsetX
    this.wavelength = Math.trunc(16 / 15 * (this.state - 50) + 380)

    sine.T = (16 * this.state + 350 * 14) / 30

    if (this.state < 50) {
      this.color.l = Math.trunc(this.state ** 3 / 2500)
      return
    }

    if (this.state <= 350) {
      this.color.l = 50
      this.color.h = 350 - this.state
      return
    }

    this.color.l = Math.trunc((400 - this.state) ** 3 / 2500)
  }
}

const stage = new function (id, width, height, toDraw, toEvolve, toClick) {
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

  this.pre_ctx.font = '60px Sans-serif'

  this.toDraw = toDraw
  this.toEvolve = toEvolve

  this.toClick = toClick
  this.target = null

  this.drawAll = function () {
    this.pre_ctx.clearRect(0, 0, BOXWIDTH, BOXHEIGHT)

    this.toDraw.forEach(obj => {
      obj.drawIt(this.pre_ctx)
    })

    this.ctx.drawImage(this.pre_cvs, 0, 0)
  }

  this.getTimeInterval = (function () {
    let previous = (new Date()).getTime()
    let current = previous
    let interval = current - previous

    return function () {
      previous = current
      current = (new Date()).getTime()
      interval = current - previous

      return interval < 40 ? interval : 40
    }
  })()

  this.evolveAll = function () {
    this.toEvolve.forEach(obj => {
      obj.evolveIt(this.getTimeInterval())
    })
  }

  this.onPointerDown = function (event) {
    for (const obj of this.toClick) {
      if (obj.isUnder(event)) {
        if (obj.isMobile) {
          this.target = obj
        } else {
          obj.onPointerDown(event)
        }
      }
    }
  }

  this.onPointerMove = function (event) {
    if (this.target === null) return

    this.target.onPointerMove(event)
  }

  this.onPointerUp = function () {
    this.target = null
  }

  this.cvs.addEventListener('pointerdown', this.onPointerDown.bind(this))
  this.cvs.addEventListener('pointermove', this.onPointerMove.bind(this))
  window.addEventListener('pointerup', this.onPointerUp.bind(this))
}('boxCanvas', BOXWIDTH, BOXHEIGHT,
  [sine, slider, button], [sine, slider, button], [slider, button])

function render () {
  stage.evolveAll()
  stage.drawAll()

  window.requestAnimationFrame(render)
}

render()
