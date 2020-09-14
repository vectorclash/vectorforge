export default class GeometricShape {
  constructor(config, createjs) {
    this.createjs = createjs

    let canvas = document.createElement('canvas')
    canvas.width = config.width
    canvas.height = config.height

    let container = new this.createjs.Stage(canvas)
    container.x = config.width / 2
    container.y = config.height / 2
    container.rotation = 90

    for (let i = 0; i < config.shapes.length; i++) {
      container.addChild(this.buildShape(config.shapes[i]))
    }

    container.update()

    return canvas
  }

  buildShape(shapeConfig) {
    let fill = new this.createjs.Shape()

    fill.graphics.beginLinearGradientFill(
      [
        shapeConfig.colors[0],
        shapeConfig.colors[1],
        shapeConfig.colors[2]
      ],
      [0, 0.5, 1],
      shapeConfig.points[0][0],
      shapeConfig.points[0][1],
      shapeConfig.points[2][0],
      shapeConfig.points[2][1]
    )

    fill.graphics.moveTo(shapeConfig.points[0][0], shapeConfig.points[0][1])
    fill.graphics.lineTo(shapeConfig.points[1][0], shapeConfig.points[1][1])
    fill.graphics.lineTo(shapeConfig.points[2][0], shapeConfig.points[2][1])
    fill.graphics.lineTo(shapeConfig.points[0][0], shapeConfig.points[0][1])

    fill.graphics.endFill()

    fill.compositeOperation = 'hard-light'

    return fill
  }
}
