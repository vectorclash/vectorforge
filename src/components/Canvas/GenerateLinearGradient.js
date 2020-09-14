import tinycolor from 'tinycolor2'

export default class GenerateLinearGradient {
  constructor(width, height, complexity = 0) {
    let config = {}

    config.width = width
    config.height = height

    // set the gradient direction

    let ranDirection = Math.random()
    if(ranDirection > 0.5) {
      config.gradientDirection = {
        x1: 0,
        y1: Math.round(Math.random() * height),
        x2: width,
        y2: Math.round(Math.random() * height)
      }
    } else {
      config.gradientDirection = {
        x1: Math.round(Math.random() * width),
        y1: 0,
        x2: Math.round(Math.random() * width),
        y2: height
      }
    }

    // set the colors

    let colorAmount = 2 + complexity
    config.colors = []

    let gradientType = Math.random()

    if(gradientType > 0.5) {
      let colorStart = Math.random() * 360
      let colorDistance = Math.random() * 50
      for (let i = 0; i < colorAmount; i++) {
        config.colors.push(tinycolor('#CCFF00').spin(colorStart + colorDistance * i).toHexString())
      }
    } else {
      let colorType = Math.random()

      for (let i = 0; i < colorAmount; i++) {
        if(colorType > 0.8) {
          config.colors.push(tinycolor.random().toHexString())
        } else {
          config.colors.push(tinycolor('#CCFF00').spin(Math.round(Math.random() * 360)).toHexString())
        }
      }
    }

    return config
  }
}
