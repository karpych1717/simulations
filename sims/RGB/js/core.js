// engine v1.0
'use strict'
class FPS {
  constructor (offsetX, offsetY, long) {
    this.offsetX = offsetX
    this.offsetY = offsetY

    this.long = long
    this.second = 1000
    this.time = 0

    this.values = new Array(long)
    this.values.fill(0)

    this.current = 0

    this.fps = '- -'

    this.timer = (function createTimer() {
      let prevTime = new Date().getTime()
    
      return function() {
        const currentTime = new Date().getTime()
        const elapsedMs = currentTime - prevTime
        prevTime = currentTime
        return elapsedMs < 40 ? elapsedMs : 40
      }
    })()
  }

  evolveIt () {
    this.time += this.timer()

    if (this.time > this.second) {
      this.time -= this.second
      this.current += 1

      if (this.current >= this.long) this.current = 0
      this.values[this.current] = 0
    }

    this.values[this.current] += 1

    this.recount()
  }

  recount () {
    let nonZero = 0
    let summ = 0

    for (let i = 0; i < this.long; i++) {
      if (this.values[i] === 0) continue
      if (i === this.current) continue

      summ += this.values[i]
      nonZero++
    }

    if (nonZero > 0) this.fps = Math.trunc(summ / nonZero)
  }

  drawIt (ctx) {
    ctx.font = '48px serif'

    ctx.fillStyle = 'yellow'

    ctx.fillText(this.fps, this.offsetX, this.offsetY, 100)
  }
}

class Stage {
  constructor (id, width, height, toDraw, toEvolve, interactive) {
    this.cvs = document.getElementById(id)
    this.ctx = this.cvs.getContext('2d', /*{ alpha: false }*/)

    this.cvs.width = width
    this.cvs.height = height

    this.prepCVS = document.createElement('canvas')
    this.prepCTX = this.prepCVS.getContext('2d', /*{ alpha: false }*/)

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
    this.prepCTX.clearRect(0, 0, this.prepCVS.width, this.prepCVS.height)

    this.toDraw.forEach(obj => {
      obj.drawIt(this.prepCTX)
    })

    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height)
    this.ctx.drawImage(this.prepCVS, 0, 0)
  }
}

class Color {
  constructor (red = 0, green = 0, blue = 0) {
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
  constructor (x, y, height, min, max, step, initVal, color = 'rgb(50, 50, 200)') {
    this.mobile = true
    this.clients = null
    this.clientsField = null
    this.color = color

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

  setClients (arr, field) {
    this.clients = arr
    this.clientsField = field

    this.setClientsVal()
  }

  setClientsVal () {
    for (const client of this.clients) {
      client[this.clientsField] = this.val
    }
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

    this.setClientsVal()
  }

  onPointerMove (event) {
    this.val = this.yIntoVal(event.offsetY)
    this.circleY = this.valIntoY(this.val)

    this.setClientsVal()
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
    ctx.fillStyle = 'rgb(35, 35, 85)'
    ctx.fillRect(this.offsetX, this.offsetY, this.width, this.height)

    ctx.fillStyle = 'rgb(190, 155, 165)'
    ctx.beginPath()
    ctx.roundRect(
      this.offsetX + this.padding, this.offsetY + this.padding,
      10, this.height - 2 * this.padding, 5
    )
    ctx.fill()

    ctx.fillStyle = this.color
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

    this.first.mix(this.parent.first, this.parent.second)
    this.second.mix(this.parent.second, this.parent.third)
    this.third.mix(this.parent.third, this.parent.first)
  }

  rotate () {
    this.angle -= this.speed / 180 * Math.PI
  };

  evolveIt () {
    this.mix()
    this.rotate()
  }
}

export { Circle, Slider, Color, Stage, FPS }
