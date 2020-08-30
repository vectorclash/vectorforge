import LinearGradient from './LinearGradient'

export default class StarField {
  constructor(width, height, images, config = null) {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    this.canvas.width = width
    this.canvas.height = height

    this.config = config

    if(!this.config) {
      this.config = this.generateNew()
    }

    this.context.globalCompositeOperation = 'destination-atop'

    // let gradient = new LinearGradient(width, height)
    // this.context.drawImage(gradient.canvas, 0, 0)
    //
    // let starCanvas = document.createElement('canvas')
    // let starContext = starCanvas.getContext('2d')
    //
    // starCanvas.width = width
    // starCanvas.height = height
    //
    // let xlStarSizeMax = width / 2
    // let xlStarSizeMin = width / 20
    //
    // for (let i = 0; i < 5; i++) {
    //   let ranSize = xlStarSizeMin + Math.random() * xlStarSizeMax
    //   let ranX = -100 + Math.random() * width + 100
    //   let ranY = -100 + Math.random() * height + 100
    //
    //   starContext.drawImage(images[0], ranX, ranY, ranSize, ranSize)
    // }
    //
    // let largeStarSizeMax = width / 7
    // let largeStarSizeMin = width / 150
    //
    // for (let i = 0; i < 50; i++) {
    //   let ranSize = largeStarSizeMin + Math.random() * largeStarSizeMax
    //   let ranX = -100 + Math.random() * width + 100
    //   let ranY = -100 + Math.random() * height + 100
    //
    //   starContext.drawImage(images[0], ranX, ranY, ranSize, ranSize)
    // }
    //
    // let mediumStarSizeMax = width / 100
    // let mediumStarSizeMin = width / 5000
    //
    // for (let i = 0; i < 200; i++) {
    //   let ranSize = mediumStarSizeMin + Math.random() * mediumStarSizeMax
    //   let ranX = -100 + Math.random() * width + 100
    //   let ranY = -100 + Math.random() * height + 100
    //
    //   starContext.drawImage(images[1], ranX, ranY, ranSize, ranSize)
    // }
    //
    // let smallStarSizeMax = width / 350
    // let smallStarSizeMin = width / 10000
    //
    // let smallStarAmount = 5000 + Math.round(Math.random() * 5000)
    //
    // for (let i = 0; i < smallStarAmount; i++) {
    //   let ranSize = smallStarSizeMin + Math.random() * smallStarSizeMax
    //   let ranX = -100 + Math.random() * width + 100
    //   let ranY = -100 + Math.random() * height + 100
    //
    //   starContext.drawImage(images[1], ranX, ranY, ranSize, ranSize)
    // }

    // this.context.drawImage(starCanvas, 0, 0)

    return this
  }

  generateNew() {
    let config = {}

    // let gradient = new LinearGradient(width, height)
    // this.context.drawImage(gradient.canvas, 0, 0)
    //
    // let starCanvas = document.createElement('canvas')
    // let starContext = starCanvas.getContext('2d')
    //
    // starCanvas.width = width
    // starCanvas.height = height
    //
    // let xlStarSizeMax = width / 2
    // let xlStarSizeMin = width / 20
    //
    // for (let i = 0; i < 5; i++) {
    //   let ranSize = xlStarSizeMin + Math.random() * xlStarSizeMax
    //   let ranX = -100 + Math.random() * width + 100
    //   let ranY = -100 + Math.random() * height + 100
    //
    //   starContext.drawImage(images[0], ranX, ranY, ranSize, ranSize)
    // }
    //
    // let largeStarSizeMax = width / 7
    // let largeStarSizeMin = width / 150
    //
    // for (let i = 0; i < 50; i++) {
    //   let ranSize = largeStarSizeMin + Math.random() * largeStarSizeMax
    //   let ranX = -100 + Math.random() * width + 100
    //   let ranY = -100 + Math.random() * height + 100
    //
    //   starContext.drawImage(images[0], ranX, ranY, ranSize, ranSize)
    // }
    //
    // let mediumStarSizeMax = width / 100
    // let mediumStarSizeMin = width / 5000
    //
    // for (let i = 0; i < 200; i++) {
    //   let ranSize = mediumStarSizeMin + Math.random() * mediumStarSizeMax
    //   let ranX = -100 + Math.random() * width + 100
    //   let ranY = -100 + Math.random() * height + 100
    //
    //   starContext.drawImage(images[1], ranX, ranY, ranSize, ranSize)
    // }
    //
    // let smallStarSizeMax = width / 350
    // let smallStarSizeMin = width / 10000
    //
    // let smallStarAmount = 5000 + Math.round(Math.random() * 5000)
    //
    // for (let i = 0; i < smallStarAmount; i++) {
    //   let ranSize = smallStarSizeMin + Math.random() * smallStarSizeMax
    //   let ranX = -100 + Math.random() * width + 100
    //   let ranY = -100 + Math.random() * height + 100
    //
    //   starContext.drawImage(images[1], ranX, ranY, ranSize, ranSize)
    // }

    return config
  }
}
