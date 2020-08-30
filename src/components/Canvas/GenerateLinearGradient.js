import tinycolor from 'tinycolor2'

export default class LinearGradient {
  constructor(width, height, complexity = 0) {
    let config = {}

    config.width = width
    config.height = height

    // set the gradient direction

    let ranDirection = Math.random()
    if(ranDirection > 0.5) {
      config.gradientDirection = {
        x1: 0,
        y1: Math.random() * height,
        x2: width,
        y2: Math.random() * height
      }
    } else {
      config.gradientDirection = {
        x1: Math.random() * width,
        y1: 0,
        x2: Math.random() * width,
        y2: height
      }
    }

    // set the colors

    let colorAmount = 2 + complexity
    config.colors = []

    for (let i = 0; i < colorAmount; i++) {
      let colorType = Math.random()

      if(colorType > 0.8) {
        config.colors.push(tinycolor.random().toHexString())
      } else {
        config.colors.push(tinycolor('#CCFF00').spin(Math.round(Math.random() * 360)).toHexString())
      }
    }

    return config
  }
}
