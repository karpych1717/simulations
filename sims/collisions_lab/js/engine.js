// balls prep
const grayPic = new Image()
const violPic = new Image()

grayPic.src = './img/gray.png'
violPic.src = './img/violet.png'

// classes
class Ball {
  constructor (picture, r, x, y, vx, vy) {
    this.picture = picture

    this.r = r

    this.offsetX = x
    this.offsetY = y

    this.vx = vx
    this.vy = vy
  };

  static balls = []
  static collisions = []

  static onTarget = null

  static relativeX = 0
  static relativeY = 0

  static addTheBall (picture, r, x, y, vx, vy) {
    this.balls.push(new Ball(picture, r, x, y, vx, vy))
  };

  static collisionsSetUp () {
    for (let i = 0; i < this.balls.length - 1; ++i) {
      for (let j = i + 1; j < this.balls.length; ++j) {
        this.collisions.push({
          distance: this.balls[i].distanceTo(this.balls[j]),
          ball_1: this.balls[i],
          ball_2: this.balls[j]
        })
      }
    }
  };

  static collisionsRecount () {
    for (const collision of this.collisions) {
      collision.distance = collision.ball_1.distanceTo(collision.ball_2)
    }

    this.collisions.sort((col1, col2) => col1.distance - col2.distance)
  };

  static ball_1
  static ball_2

  static e1 = { x: 1, y: 0, l: 1 }
  static e2 = { x: 0, y: 1, l: 1 }

  static v1 = { x: 0, y: 0 }
  static v2 = { x: 0, y: 0 }
  static temp = 0

  collide (ball) {
    Ball.ball_1 = this
    Ball.ball_2 = ball

    Ball.e1.x = Ball.ball_2.offsetX - Ball.ball_1.offsetX
    Ball.e1.y = Ball.ball_2.offsetY - Ball.ball_1.offsetY

    Ball.e1.l = Math.sqrt(Ball.e1.x ** 2 + Ball.e1.y ** 2)

    Ball.e1.x /= Ball.e1.l
    Ball.e1.y /= Ball.e1.l

    Ball.e1.l = 1

    Ball.e2.x = -Ball.e1.y
    Ball.e2.y = Ball.e1.x

    Ball.v1.x = Ball.e1.x * Ball.ball_1.vx - Ball.e2.x * Ball.ball_1.vy
    Ball.v2.x = Ball.e1.x * Ball.ball_2.vx - Ball.e2.x * Ball.ball_2.vy

    if (Ball.v1.x - Ball.v2.x <= 0) return

    Ball.v1.y = -Ball.e1.y * Ball.ball_1.vx + Ball.e2.y * Ball.ball_1.vy
    Ball.v2.y = -Ball.e1.y * Ball.ball_2.vx + Ball.e2.y * Ball.ball_2.vy

    if (Ball.ball_1 === Ball.onTarget || Ball.ball_2 === Ball.onTarget) {
      Ball.v1.x *= -1
      Ball.v2.x *= -1
    } else {
      Ball.temp = Ball.v1.x
      Ball.v1.x = Ball.v2.x
      Ball.v2.x = Ball.temp
    }

    Ball.ball_1.vx = Ball.e1.x * Ball.v1.x + Ball.e2.x * Ball.v1.y
    Ball.ball_1.vy = Ball.e1.y * Ball.v1.x + Ball.e2.y * Ball.v1.y

    Ball.ball_2.vx = Ball.e1.x * Ball.v2.x + Ball.e2.x * Ball.v2.y
    Ball.ball_2.vy = Ball.e1.y * Ball.v2.x + Ball.e2.y * Ball.v2.y
  };

  static collider () {
    for (const collision of this.collisions) {
      if (collision.distance > 0) break

      collision.ball_1.collide(collision.ball_2)
    }
  };

  static distanceBetween (obj1, obj2) {
    return Math.sqrt((obj1.offsetX - obj2.offsetX) ** 2 +
                          (obj1.offsetY - obj2.offsetY) ** 2)
  };

  distanceTo (ball) {
    return Ball.distanceBetween(ball, this) - ball.r - this.r
  };

  isOverIt (event) {
    return !(this.r < Ball.distanceBetween(event, this))
  };

  drawIt (ctx) {
    ctx.drawImage(this.picture,
      Math.floor(this.offsetX - this.r),
      Math.floor(this.offsetY - this.r))
  };

  static drawAll (ctx) {
    for (const ball of this.balls) {
      ball.drawIt(ctx)
    }
  }

  flyIt (dt) {
    if (this.offsetY < this.r) {
      if (this.vy < 0) {
        this.vy *= -1
      } else if (this.vy === 0) {
        this.vy = 0.1
      }
    }

    if (this.offsetX < this.r) {
      if (this.vx < 0) {
        this.vx *= -1
      } else if (this.vx === 0) {
        this.vx = 0.1
      }
    }

    if (this.offsetY > (BoxHeight - this.r)) {
      if (this.vy > 0) {
        this.vy *= -1
      } else if (this.vy === 0) {
        this.vy = -0.1
      }
    }

    if (this.offsetX > (BoxWidth - this.r)) {
      if (this.vx > 0) {
        this.vx *= -1
      } else if (this.vx === 0) {
        this.vx = -0.1
      }
    }

    this.offsetX += dt * this.vx
    this.offsetY += dt * this.vy
  };

  static flyAll (dt, accuracy) {
    for (let i = 0; i < accuracy; ++i) {
      this.collisionsRecount()

      this.collider()

      for (const ball of this.balls) {
        if (ball === this.onTarget) continue

        ball.flyIt(dt / accuracy)
      }
    }
  }

  moveByMouse (event) {
    this.offsetX = event.offsetX + Ball.relativeX
    this.offsetY = event.offsetY + Ball.relativeY

    if (this.offsetY > BoxHeight) {
      this.offsetY = BoxHeight
    }

    if (this.offsetY < 0) {
      this.offsetY = 0
    }

    if (this.offsetX > BoxWidth) {
      this.offsetX = BoxWidth
    }

    if (this.offsetX < 0) {
      this.offsetX = 0
    }
  };

  releaseTarget (event) {
    this.vx = 0
    this.vy = 0
  }
};

// canvas
const cvs = document.getElementById('boxCanvas')
const ctx = cvs.getContext('2d')

const BoxWidth = 500
const BoxHeight = 500

cvs.width = BoxWidth
cvs.height = BoxHeight

// events
cvs.addEventListener('mousedown', targetOnClick)

cvs.addEventListener('mousemove', moveByMouse)

window.addEventListener('mouseup', releaseTarget)

// init variables

Ball.addTheBall(grayPic, 25, 250, 250, -0.1, -0.2)
Ball.addTheBall(violPic, 25, 150, 250, 0.1, 0.2)
Ball.addTheBall(violPic, 25, 250, 150, 0.2, 0.1)

Ball.collisionsSetUp()

Ball.balls[0].moveByMouse = function (event) {
  this.vx = (event.offsetX - this.offsetX) / 500
  this.vy = (event.offsetY - this.offsetY) / 500
}

Ball.balls[0].releaseTarget = function (event) {

}

// Time watch;
let now = new Date().getTime()
let dt = 0
let prev = now

const maxDt = 33

// render function
function render () {
  now = new Date().getTime()
  dt = now - prev
  dt = Math.min(dt, maxDt)
  prev = now

  ctx.clearRect(0, 0, BoxWidth, BoxHeight)
  Ball.drawAll(ctx)

  Ball.flyAll(dt, 1)

  window.requestAnimationFrame(render)
}

render()

function targetOnClick (event) {
  for (const ball of Ball.balls) {
    if (ball.isOverIt(event)) {
      Ball.onTarget = ball

      Ball.onTarget.vx = 0
      Ball.onTarget.vy = 0

      Ball.relativeX = Ball.onTarget.offsetX - event.offsetX
      Ball.relativeY = Ball.onTarget.offsetY - event.offsetY
    }
  }
}

function moveByMouse (event) {
  if (Ball.onTarget !== null) {
    Ball.onTarget.moveByMouse(event)
  }
}

function releaseTarget (event) {
  if (Ball.onTarget !== null) {
    Ball.onTarget.releaseTarget(event)

    Ball.onTarget = null
    Ball.relativeX = 0
    Ball.relativeY = 0
  }
}
