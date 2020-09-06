import LinearGradient from './LinearGradient'

export default class StarField {
  constructor(config, images) {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')

    canvas.width = config.width
    canvas.height = config.height

    context.globalCompositeOperation = 'destination-atop'

    let gradient = new LinearGradient(config.gradientConfig)
    context.drawImage(gradient, 0, 0)

    let starCanvas = document.createElement('canvas')
    let starContext = starCanvas.getContext('2d')

    starCanvas.width = config.width
    starCanvas.height = config.height

    for (let i = 0; i < config.stars.length; i++) {
      starContext.drawImage(images.getResult(config.stars[i].image), config.stars[i].x, config.stars[i].y, config.stars[i].size, config.stars[i].size)
    }

    let smallStarSizeMax = config.width / 500
    let smallStarSizeMin = config.width / 5000

    for (let i = 0; i < config.smallStarAmount; i++) {
      let ranSize = smallStarSizeMin + Math.random() * smallStarSizeMax
      let ranX = -100 + Math.random() * config.width + 100
      let ranY = -100 + Math.random() * config.height + 100

      starContext.drawImage(images.getResult('star-small'), ranX, ranY, ranSize, ranSize)
    }

    context.drawImage(starCanvas, 0, 0)

    return canvas
  }
}
