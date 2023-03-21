'use strict'

class Stage {
  constructor (id, width, height, toDraw, toEvolve, interactive) {
    this.cvs = document.getElementById(id)
    this.ctx = this.cvs.getContext('2d', { alpha: false })

    this.cvs.width = width
    this.cvs.height = height

    this.prepCVS = document.createElement('canvas')
    this.prepCTX = this.prepCVS.getContext('2d', { alpha: false })

    this.prepCVS.width = width
    this.prepCVS.height = height

    this.prepCTX.lineWidth = 7
    this.prepCTX.strokeStyle = 'black'

    this.prepCTX.font = '40px serif'

    this.toDraw = toDraw
    this.toEvolve = toEvolve

    this.onTarget = null
    this.interactive = interactive

    this.cvs.addEventListener('pointerdown', (event) =>{
      for (const obj of this.interactive) {
        if (obj.isUnder(event)) this.onTarget = obj
      }

      if (this.onTarget === null) return
      if (this.onTarget.mobile) return
      
      this.onTarget = null
    })

    this.cvs.addEventListener('pointermove', (event) =>{
      if (this.onTarget === null) return

      if (this.onTarget.isFarFrom(event)) {
        this.onTarget = null
      } else {
        this.onTarget.onPointerMove(event)
      }
      
    })

    this.cvs.addEventListener('pointerup', (event) =>{
      this.onTarget = null    
    })
  }

  evolveAll () {
    this.toEvolve.forEach(obj => {
      obj.evolveIt()
    })
  }

  drawAll () {
    this.toDraw.forEach(obj => {
      obj.drawIt(this.prepCTX)
    })

    this.ctx.drawImage(this.prepCVS, 0, 0)
  }
}

class Color {
  constructor (red, green, blue) {
    this._red = red
    this._green = green
    this._blue = blue
  }

  set red (red) {
    this._red = red
  }

  get red () {
    return this._red
  }

  set green (green) {
    this._green = green
  }

  get green () {
    return this._green
  }

  set blue (blue) {
    this._blue = blue
  }

  get blue () {
    return this._blue
  }

  mix (col1, col2) {
    this._red = Math.max(col1.red, col2.red)
    this._green = Math.max(col1.green, col2.green)
    this._blue = Math.max(col1.blue, col2.blue)
  }

  getNormalised () {
    return `rgb(${this._red}, ${this._green}, ${this._blue})`
  }
}

class Slider {
  constructor (x, y, height, min, max, step, initVal) {
    this.mobile = true

    this.offsetX = x
    this.offsetY = y

    this.width =  30
    this.padding = 10
    this.height = height

    this.circleR = 9

    this.circleX = this.offsetX + this.padding + 5
    this.circleMinY = this.offsetY + this.padding + 5
    this.circleMaxY = this.offsetY + this.height - this.padding - 5

    this.values = []
    for (let val = min; val < max; val += step) {
      this.values.push(val)
    }
    this.values.push(max)

    this.val = initVal

    this.circleY = this.valIntoY(this.val)
  }

  valIntoY (val) {
    const relative = (val - this.values[0]) / (this.values[this.values.length - 1] - this.values[0])
    const y = this.circleMaxY - Math.round(relative * (this.circleMaxY - this.circleMinY))

    return y
  }

  yIntoVal (inputY) {
    let y = inputY
    if (y < this.circleMinY) y = this.circleMinY
    if (y > this.circleMaxY) y = this.circleMaxY

    const relative = (this.circleMaxY - y) / (this.circleMaxY - this.circleMinY)
    const index = Math.round(relative * (this.values.length - 1))

    return this.values[index]
  }

  onPointerDown (event) {
    this.val = this.yIntoVal(event.offsetY)
    this.circleY = this.valIntoY(this.val)
  }

  onPointerMove (event) {
    this.val = this.yIntoVal(event.offsetY)
    this.circleY = this.valIntoY(this.val)
  }

  isUnder (event) {
    if (Math.hypot(event.offsetX - this.circleX, event.offsetY - this.circleY) <= this.circleR) return true
    if (
      event.offsetX > this.circleX - 5 &&
      event.offsetX < this.circleX + 5 &&
      event.offsetY > this.circleMinY &&
      event.offsetY < this.circleMaxY
    ) return true

    return false
  }

  isFarFrom (event) {
    if (
      event.offsetX > this.offsetX - 20 &&
      event.offsetX < this.offsetX + this.width + 20 &&
      event.offsetY > this.offsetY - 10 &&
      event.offsetY < this.offsetY + this.height + 10
    ) return false

    return true
  }

  drawIt (ctx) {
    ctx.fillStyle = 'gray'
    ctx.fillRect(this.offsetX, this.offsetY, this.width, this.height)

    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.roundRect(
      this.offsetX + this.padding, this.offsetY + this.padding,
      10, this.height - 2 * this.padding, 5
    )
    ctx.fill()

    ctx.fillStyle = 'blue'
    ctx.beginPath()
    ctx.roundRect(
      this.offsetX + this.padding, this.circleY,
      10, this.circleMaxY - this.circleY + 5, 5
    )
    ctx.fill()

    ctx.beginPath()
    ctx.arc(
      this.circleX, this.circleY,
      this.circleR, 0, 2 * Math.PI
    )
    ctx.fill()
  }
}

class Circle {
  constructor (first, second, third, radius, angle, parent) {
    this.first = first
    this.second = second
    this.third = third

    this.radius = radius

    this.offsetX = 250
    this.offsetY = 250

    this.angle = angle
    this.speed = 1

    this.parent = parent
  };

  get first_color () {
    return this.first.getNormalised()
  };

  get second_color () {
    return this.secong.getNormalised()
  };

  get third_color () {
    return this.third.getNormalised()
  };

  drawIt (ctx) {
    ctx.fillStyle = this.first.getNormalised()
    ctx.beginPath()
    ctx.moveTo(this.offsetX, this.offsetY)
    ctx.arc(this.offsetX, this.offsetY, this.radius,
      this.angle + 0, this.angle + Math.PI * 2 / 3)
    ctx.lineTo(this.offsetX, this.offsetY)
    ctx.fill()

    ctx.fillStyle = this.second.getNormalised()
    ctx.beginPath()
    ctx.moveTo(this.offsetX, this.offsetY)
    ctx.arc(this.offsetX, this.offsetY, this.radius,
      this.angle + Math.PI * 2 / 3, this.angle + Math.PI * 4 / 3)
    ctx.lineTo(this.offsetX, this.offsetY)
    ctx.fill()

    ctx.fillStyle = this.third.getNormalised()
    ctx.beginPath()
    ctx.moveTo(this.offsetX, this.offsetY)
    ctx.arc(this.offsetX, this.offsetY, this.radius,
      this.angle + Math.PI * 4 / 3, this.angle + Math.PI * 2)
    ctx.lineTo(this.offsetX, this.offsetY)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(this.offsetX, this.offsetY, this.radius, 0, Math.PI * 2)
    ctx.stroke()
  };

  mix () {
    if (this.parent === null) return

    this.first.mix(this.parent.third, this.parent.first)
    this.second.mix(this.parent.first, this.parent.second)
    this.third.mix(this.parent.second, this.parent.third)
  }

  rotate () {
    this.angle -= this.speed / 180 * Math.PI
  };

  evolveIt () {
    this.mix()
    this.rotate()
  }
}

export { Circle, Slider, Color, Stage }
