"use strict"

function loop() {
  start = Date.now()

  draw()

  finish = Date.now()

  if (counterArray.length === AMOUNT) {
    console.log(counterArray.reduce((acc, num) => acc + num, 0) / AMOUNT)

    counterArray.length = 0
  }

  counterArray.push(finish - start)
}

function draw() {
  context.clearRect(0, 0, W, H)

  context.beginPath()
  context.arc(W/2, H/2, 100, 0, 2 * Math.PI)
  //context.clip()

  switch (mode) {
    case 'direct':
      drawDirect()
      break
    case 'indirect':
      drawIndirect()
      break
    case 'texture':
      drawTexture()
      break
    case 'bitmap':
      drawBitmap()
      break
  }

  context.restore()
}

function drawTexture() {
  const sx = 4 * Math.round(Math.random() * (W / 2 - W / 4))
  const sy = 4 * Math.round(Math.random() * (H / 2 - H / 4))

  context.drawImage(noiseCanvas, sx, sy, W, H, 0, 0, W, H)
}

function drawDirect() {
  context.fillStyle = 'black'
  context.fillRect(0, 0, W, H)

  context.fillStyle = 'white'
  for (let x = 0; x < W; x += BLOCK_SIZE) {
    for (let y = 0; y < H; y += BLOCK_SIZE) {
      if (Math.random() < 0.5) context.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
    }
  }
}

function drawIndirect() {
  backContext.fillStyle = 'black'
  backContext.fillRect(0, 0, W, H)

  backContext.fillStyle = 'white'
  for (let x = 0; x < W; x += BLOCK_SIZE) {
    for (let y = 0; y < H; y += BLOCK_SIZE) {
      if (Math.random() < 0.5) backContext.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE)
    }
  }

  context.drawImage(backCanvas, 0, 0)
}

function drawBitmap() {
  const sx = 4 * Math.round(Math.random() * (W / 2 - W / 4))
  const sy = 4 * Math.round(Math.random() * (H / 2 - H / 4))

  context.drawImage(bitmapTexture, sx, sy, W, H, 0, 0, W, H)
}