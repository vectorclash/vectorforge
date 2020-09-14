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
      radGrad.size = Math.round(config.radGradSize / 2 + Math.random() * config.radGradSize * 4)
      radGrad.x = Math.round(-(radGrad.size) + Math.random() * width + (radGrad.size / 2))
      radGrad.y = Math.round(-(radGrad.size) + Math.random() * height + (radGrad.size / 2))
      radGrad.colors = []
      let colorAmount = 2 + Math.round(Math.random() * 3)
      for (let i = 0; i < colorAmount; i++) {
        let color = tinycolor.random().toHexString()
        radGrad.colors.push(color)
      }

      config.radGradients.push(radGrad)
    }

    return config
  }
}
