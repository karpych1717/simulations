'use strict'

//files prep
const negSmallPic = new Image()
const negBigPic   = new Image()
const posSmallPic = new Image()
const posBigPic   = new Image()

const arrowPic    = new Image()


negSmallPic.src   = './img/negative_small.png'
negBigPic.src     = './img/negative_big.png'
posSmallPic.src   = './img/positive_small.png'
posBigPic.src     = './img/positive_big.png'

arrowPic.src      = './img/arrow.png'


//class prep
class Circle {
    constructor(x, y, r) {
        this.offsetX = x
        this.offsetY = y
        this.r = r
    }

    midpointDistanceTo(obj) {
        return Math.sqrt( (obj.offsetX - this.offsetX)**2 + (obj.offsetY - this.offsetY)**2 )
    }

    isUnder(obj) {
        return this.midpointDistanceTo(obj) <= this.r ? true : false
    }
}

class Rectangle {
    constructor(x, y, width, height, backColor = 'white', borderColor = 'black') {
        this.offsetX = x
        this.offsetY = y
        this.width   = width
        this.height  = height

        this.left  = x
        this.right = x + width
        this.top   = y
        this.bot   = y + height

        this.backColor   = backColor
        this.borderColor = borderColor
    }

    isUnder(obj) {
        if ( obj.offsetX < this.left ) {
            return false
        }
        if ( obj.offsetY < this.top ) {
            return false
        }
        if ( obj.offsetX > this.right ) {
            return false
        }
        if ( obj.offsetY > this.bot ) {
            return false
        }

        return true
    }

    drawIt(ctx) {
        ctx.fillStyle = this.backColor
        ctx.fillRect(this.offsetX, this.offsetY, this.width, this.height)

        ctx.strokeStyle = this.borderColor
        ctx.strokeRect(this.offsetX, this.offsetY, this.width, this.height)
    }
}

class ChargedBall extends Circle {
    constructor(x, y, r, charge, isMobile, relatives, box) {
        super(x /*+ box.offsetX*/, y /*+ box.offsetY*/, r)

        this.box = box

        this.Vx = 0
        this.Vy = 0

        this.Fx = 0
        this.Fy = 0

        this.charge = charge
        this.isMobile = isMobile
        this.relatives = relatives

        this.picture = isMobile ?
            ( (charge > 0) ? posSmallPic : negSmallPic )
            :
            ( (charge > 0) ? posBigPic : negBigPic )
    }

    drawIt(ctx) {
        ctx.drawImage( this.picture,
                       Math.floor(this.offsetX - this.r),
                       Math.floor(this.offsetY - this.r)
                     )
    }

    countForce() {
        this.Fx = 0
        this.Fy = 0

        if (!this.isMobile) {
            return
        }

        for(const ball of this.relatives) {
            if (ball === this) continue

            tempRx = this.offsetX - ball.offsetX
            tempRy = this.offsetY - ball.offsetY

            tempR  = Math.sqrt( tempRx**2 + tempRy**2 )

            tempFx = this.charge * ball.charge / tempR**3 * tempRx
            tempFy = this.charge * ball.charge / tempR**3 * tempRy

            this.Fx += tempFx
            this.Fy += tempFy
        }
    }

    moveByField(dt) {
        collide()

        this.Vx += dt * this.Fx
        this.Vy += dt * this.Fy

        this.offsetX  += dt * this.Vx
        this.offsetY  += dt * this.Vy


        this.box.wallEffect(this)
    }

}

class Box extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)
    }

    wallEffect(ball) {
        if ( ball.offsetX < this.left + ball.r  && ball.Vx < 0 ) {
            ball.Vx *= -1
        } else if ( ball.offsetX < this.left + ball.r && ball.Vx === 0) {
            ball.Vx = 100
        }

        if ( ball.offsetY < this.top + ball.r && ball.Vy < 0 ) {
            ball.Vy *= -1
        } else if ( ball.offsetY < this.top + ball.r && ball.Vy === 0) {
            ball.Vy = 100
        }

        if ( ball.offsetX > this.right - ball.r && ball.Vx > 0 ) {
            ball.Vx *= -1
            console.log('mmm' + ball.Vx)
        } else if ( ball.offsetX > this.right - ball.r && ball.Vx === 0 ) {
            ball.Vx = -100
            console.log('wow')
        }

        if ( ball.offsetY > this.bot - ball.r  && ball.Vy > 0 ) {
            ball.Vy *= -1
        } else if ( ball.offsetY > this.bot - ball.r  && ball.Vy === 0 ) {
            ball.Vy = -100
        }
    }
}


class Bucket extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)
    }

    pointerDown(e) {

    }
}


class Arrow {
    constructor(x, y, angle, balls, opacity = 1, box) {
        this.offsetX = x + box.offsetX
        this.offsetY = y + box.offsetY

        this.Fx = 0
        this.Fy = 0

        this.angle   = angle
        this.opacity = opacity

        this.picture = arrowPic

        //this.relatives = relatives
        this.balls   = balls
    }

    countForceAndAngle() {
        this.Fx = 0
        this.Fy = 0


        for(const ball of balls) {
            tempRx = this.offsetX + 13 - ball.offsetX
            tempRy = this.offsetY + 4 - ball.offsetY

            tempR  = Math.sqrt( tempRx**2 + tempRy**2 )

            tempFx = ball.charge / tempR**3 * tempRx
            tempFy = ball.charge / tempR**3 * tempRy

            this.Fx += tempFx
            this.Fy += tempFy
        }


        this.angle = Math.atan(this.Fy / this.Fx)
        if(this.Fx < 0) {
            this.angle += Math.PI
        }

        this.opacity = 1 - Math.exp( -1000 *(Math.abs(this.Fx) + Math.abs(this.Fy)) )
    }

    drawIt(ctx) {
        ctx.globalAlpha = this.opacity
        ctx.translate(this.offsetX + 13, this.offsetY + 4)
        ctx.rotate(this.angle)
        ctx.translate(-13 - this.offsetX, -4 - this.offsetY)

        ctx.drawImage(this.picture, this.offsetX, this.offsetY)

        ctx.translate(this.offsetX + 13, this.offsetY + 4)
        ctx.rotate(-this.angle)
        ctx.translate(-13 - this.offsetX, -4 - this.offsetY)
        ctx.globalAlpha = 1
    }
}


//will be used in counting
let temp

let tempR
let tempRx
let tempRy

let tempF
let tempFx
let tempFy

const e1 = {x: 0, y: 0}
const e2 = {x: 0, y: 0}
const v1 = {x: 0, y: 0}
const v2 = {x: 0, y: 0}

const MAINBOX_SIZE = 500
const SUBBOX_SIZE  = MAINBOX_SIZE / 4
const PADDING      = 10


const mainBox = new Box(PADDING, PADDING, MAINBOX_SIZE, MAINBOX_SIZE)
const subBox1 = new Rectangle(PADDING + MAINBOX_SIZE, PADDING + 0 * SUBBOX_SIZE, SUBBOX_SIZE, SUBBOX_SIZE, 'cyan')
const subBox2 = new Rectangle(PADDING + MAINBOX_SIZE, PADDING + 1 * SUBBOX_SIZE, SUBBOX_SIZE, SUBBOX_SIZE, 'pink')
const subBox3 = new Rectangle(PADDING + MAINBOX_SIZE, PADDING + 2 * SUBBOX_SIZE, SUBBOX_SIZE, SUBBOX_SIZE, 'blue')
const subBox4 = new Rectangle(PADDING + MAINBOX_SIZE, PADDING + 3 * SUBBOX_SIZE, SUBBOX_SIZE, SUBBOX_SIZE, 'red')

//canvas
const cvs = document.getElementById('boxCanvas')
const ctx = cvs.getContext('2d')

cvs.width  = PADDING + MAINBOX_SIZE + SUBBOX_SIZE + PADDING
cvs.height = PADDING + MAINBOX_SIZE + PADDING
cvs.style.border  = '2px solid green'


const pre_cvs = document.createElement("canvas")
const pre_ctx = pre_cvs.getContext('2d')

pre_cvs.width  = cvs.width
pre_cvs.height = cvs.height


let movingBall = null
let relativeX = 0
let relativeY = 0


//events
cvs.addEventListener('pointerdown', pointerDown)

cvs.addEventListener('pointermove', pointerMove)

window.addEventListener('pointerup', pointerUp)


const balls      = []
const collisions = []


const arrows = []

for(let i = 0; i < 500; i += 25) {
    for(let j = 8; j < 500; j += 25) {
        arrows.push( new Arrow(i, j, 0, balls, 1, mainBox) )
    }
}


// Time watch
let now    = new Date().getTime()
let dt     = 0
let dtHalf = 0
let prev   = now

const maxDt = 33


//render function
function render() {
    now  = new Date().getTime()
    dt   = now - prev
    dt   = Math.min(dt, maxDt)
    prev = now

    dtHalf = dt / 2

    pre_ctx.fillStyle = 'white'
    pre_ctx.fillRect(0, 0, pre_cvs.width, pre_cvs.height)

    mainBox.drawIt(pre_ctx)
    subBox1.drawIt(pre_ctx)
    subBox2.drawIt(pre_ctx)
    subBox3.drawIt(pre_ctx)
    subBox4.drawIt(pre_ctx)

    for(const arrow of arrows) {
        arrow.drawIt(pre_ctx)
    }

    for(const ball of balls) {
        ball.drawIt(pre_ctx)
    }


    ctx.drawImage(pre_cvs, 0, 0)


    for(const ball of balls) {
        if( ball === movingBall ) continue
        ball.countForce()
    }


    for(const ball of balls) {
        if( ball === movingBall ) continue
        ball.moveByField(dtHalf)
    }

    for(const ball of balls) {
        if( ball === movingBall ) continue
        ball.countForce()
    }

    for(const arrow of arrows) {
        arrow.countForceAndAngle()
    }

    for(const ball of balls) {
        if( ball === movingBall ) continue
        ball.moveByField(dtHalf)
    }

    requestAnimationFrame(render)
}

render()




function pointerDown(event) {
    for(let i = 0; i < balls.length; i++) {
        if( balls[balls.length - 1 - i].midpointDistanceTo(event) < balls[balls.length - 1 - i].r) {
            movingBall = balls[balls.length - 1 - i]

            movingBall.Vx = 0
            movingBall.Vy = 0
            movingBall.Fx = 0
            movingBall.Fy = 0

            relativeX = movingBall.offsetX - event.offsetX
            relativeY = movingBall.offsetY - event.offsetY

            break
        }
    }

    if ( movingBall !== null && balls.indexOf(movingBall) !== balls.length - 1 ) {
        for(let i = balls.indexOf(movingBall); i < balls.length - 1; i++) {
            balls[i] = balls[i + 1]
        }

        balls[balls.length - 1] = movingBall
    }

    if ( subBox1.isUnder(event) ) {
        balls.push( new ChargedBall(event.offsetX, event.offsetY,
                                    20, -1, false, balls, mainBox)
                                    )
        movingBall = balls[balls.length-1]

        addCollision(movingBall)
    }
    if ( subBox2.isUnder(event) ) {
        balls.push( new ChargedBall(event.offsetX, event.offsetY,
                                    20, 1, false, balls, mainBox)
                                    )
        movingBall = balls[balls.length-1]

        addCollision(movingBall)
    }
    if ( subBox3.isUnder(event) ) {
        balls.push( new ChargedBall(event.offsetX, event.offsetY,
                                    10, -1, true, balls, mainBox)
                                    )
        movingBall = balls[balls.length-1]

        addCollision(movingBall)
    }
    if ( subBox4.isUnder(event) ) {
        balls.push( new ChargedBall(event.offsetX, event.offsetY,
                                    10, 1, true, balls, mainBox)
                                    )
        movingBall = balls[balls.length-1]

        addCollision(movingBall)
    }
}

function pointerMove(event) {
    if (movingBall !== null) {
        movingBall.offsetX = event.offsetX + relativeX
        movingBall.offsetY = event.offsetY + relativeY
    }
}

function pointerUp(event) {
    if (movingBall !== null) {
        movingBall.offsetX = event.offsetX + relativeX
        movingBall.offsetY = event.offsetY + relativeY

        if( !mainBox.isUnder(movingBall) ) {
            balls.length -= 1
        }

        movingBall = null
        relativeX = 0
        relativeY = 0
    }
}


function addCollision(newBall) {
    if (balls.length === 0) {
        return
    }

    for (const ball of balls) {
        if (ball === newBall) {
            continue
        }

        if (ball.isMobile === false && newBall.isMobile === false) {
            continue
        }

        collisions.push({
            'ball_1': ball,
            'ball_2': newBall,
            'distance': ball.midpointDistanceTo(newBall)
        })
    }
}

function removeCollision(oldBall) {
    let newCollisions = collisions
        .filter( (collision) => collision.ball_1 !== oldBall )
        .filter( (collision) => collision.ball_2 !== oldBall )

    collisions = newCollisions

}

function collide() {
    for (const collision of collisions) {
        if ( collision.ball_1.midpointDistanceTo(collision.ball_2) <= collision.ball_1.r + collision.ball_2.r ) {
            impact(collision.ball_1, collision.ball_2)
        }
    }
}

function impact(ball_1, ball_2) {
        e1.x  = ball_2.offsetX - ball_1.offsetX
        e1.y  = ball_2.offsetY - ball_1.offsetY

        e1.l  = Math.sqrt( e1.x**2 + e1.y**2 )

        e1.x /= e1.l
        e1.y /= e1.l

        e1.l  = 1


        e2.x = -e1.y
        e2.y =  e1.x


        v1.x =  e1.x * ball_1.Vx - e2.x * ball_1.Vy
        v2.x =  e1.x * ball_2.Vx - e2.x * ball_2.Vy
        

        if ( v1.x - v2.x <= 0 ) return

        v1.y = -e1.y * ball_1.Vx + e2.y * ball_1.Vy
        v2.y = -e1.y * ball_2.Vx + e2.y * ball_2.Vy

        if ( ball_1 == movingBall || ball_2 == movingBall ) {
            v1.x *= -1
            v2.x *= -1
        } else {
            temp = v1.x
            v1.x = v2.x
            v2.x = temp
        }


        ball_1.Vx = e1.x * v1.x + e2.x * v1.y
        ball_1.Vy = e1.y * v1.x + e2.y * v1.y

        ball_2.Vx = e1.x * v2.x + e2.x * v2.y
        ball_2.Vy = e1.y * v2.x + e2.y * v2.y
}