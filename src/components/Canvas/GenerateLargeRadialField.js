import tinycolor from 'tinycolor2'

export default class GenerateLargeRadialField {
  constructor(width, height) {
    let config = {}

    config.width = width
    config.height = height

    config.radGradSize = width / 2
    config.radGradients = []

    let amount = 2 + Math.round(Math.random() * 8)

    for (let i = 0; i < amount; i++) {
      let radGrad = {}
      radGrad.alpha = (Math.random()).toFixed(2)
      radGrad.size = Math.round(config.radGradSize / 2 + Math.random() * config.radGradSize * 4)
      radGrad.x = Math.round(-(radGrad.size) + Math.random() * width + (radGrad.size / 2))
      radGrad.y = Math.round(-(radGrad.size) + Math.random() * height + (radGrad.size / 2))
      radGrad.colors = []

      let colorAmount = 2 + Math.round(Math.random() * 3)

      let gradientType = Math.random()

      if (gradientType > 0.5) {
        let colorStart = Math.random() * 360
        let colorDistance = Math.random() * 50
        for (let i = 0; i < colorAmount; i++) {
          radGrad.colors.push(tinycolor('#CCFF00').spin(colorStart + colorDistance * i).toHexString())
        }
      } else {
        let colorType = Math.random()

        for (let i = 0; i < colorAmount; i++) {
          if (colorType > 0.8) {
            radGrad.colors.push(tinycolor.random().toHexString())
          } else {
            radGrad.colors.push(tinycolor('#CCFF00').spin(Math.round(Math.random() * 360)).toHexString())
          }
        }
      }

      config.radGradients.push(radGrad)
    }

    return config
  }
}
