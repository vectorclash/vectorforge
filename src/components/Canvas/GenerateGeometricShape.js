import tinycolor from 'tinycolor2'

export default class GenerateGeometricShape {
  constructor(width, height, shapeNum) {
    let config = {
      width: width,
      height: height,
      shapes: []
    }

    this.shapeVertices = 12
    this.shapeDepth = 23
    this.shapeAng = 360/this.shapeVertices
    this.shapeSize = Math.round(Math.random() * width * height / (height * 3))

    this.points = this.pointsArray(this.shapeSize)

    for (let i = 0; i < shapeNum; i++) {
      config.shapes.push(this.buildShape())
    }

    return config
  }

  pointsArray(r) {
    let radius = r
    let points = []

    points.push([0, 0])

    for(let h = 1; h <= this.shapeDepth; h++) {
      for (let ang = 0; ang < 360; ang += this.shapeAng) {
        let rad = ang * Math.PI / 180
        let newX = 0 + ((radius*h) * Math.cos(rad))
        let newY = 0 + ((radius*h) * Math.sin(rad))

        points.push([Math.round(newX), Math.round(newY)])
      }
    }

    return points
  }

  buildShape() {
    let shape = {
      colors: [],
      points: []
    }

    let randomPoints = this.between(0, this.points.length-1)

    shape.points.push(
      this.points[randomPoints[0]],
      this.points[randomPoints[1]],
      this.points[randomPoints[2]]
    )

    shape.colors.push(
      tinycolor.random().toHexString(),
      tinycolor.random().toHexString(),
      tinycolor.random().toHexString()
    )

    return shape
  }

  getRandomNumber(min, max) {
    let ranNumber = Math.random() * (max - min) + min
    return ranNumber
  }

  between(startNumber, endNumber) {
    let baseNumber = []
    let randNumber = []
    for(let i = startNumber; i <= endNumber; i++) {
      baseNumber[i] = i
    }

    for(let i = endNumber; i > startNumber; i--) {
      let tempRandom = startNumber + Math.floor(Math.random()*(i - startNumber))
      randNumber[i] = baseNumber[tempRandom]
      baseNumber[tempRandom] = baseNumber[i]
    }

    randNumber[startNumber] = baseNumber[startNumber]

    return randNumber
  }
}
