import RadialGradient from './RadialGradient'

export default class LargeRadialField {
  constructor(config) {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')

    canvas.width = config.width
    canvas.height = config.height

    for (let i = 0; i < config.radGradients.length; i++) {
      context.globalCompositeOperation = 'overlay'

      context.globalAlpha = config.radGradients[i].alpha

      let radGrad = new RadialGradient(
        config.radGradSize,
        config.radGradSize,
        config.radGradients[i].colors)

      context.drawImage(
        radGrad,
        config.radGradients[i].x,
        config.radGradients[i].y,
        config.radGradients[i].size,
        config.radGradients[i].size)
    }

    return canvas
  }
}
