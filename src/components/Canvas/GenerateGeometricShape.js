import tinycolor from 'tinycolor2'

export default class GenerateGeometricShape {
  constructor(width, height, shapeNum, colors = []) {
    let config = {
      width: width,
      height: height,
      shapes: []
    }

    this.colors = colors

    this.shapeVertices = 3 + Math.round(Math.random() * 9)
    this.shapeDepth = 2 + Math.round(Math.random() * 4)
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

    if(this.colors.length > 0) {
      if(this.colors.length === 1) {
        shape.colors.push(
          this.colors[0],
          tinycolor(this.colors[0]).spin(-20 + Math.random() * 40).toHexString(),
          tinycolor(this.colors[0]).spin(-20 + Math.random() * 40).toHexString()
        )
      } else if (this.colors.length === 2) {
        shape.colors.push(
          this.colors[0],
          this.colors[1],
          tinycolor(this.colors[0]).spin(-20 + Math.random() * 40).toHexString()
        )
      } else {
        shape.colors = this.colors
      }
    } else {
      shape.colors.push(
        tinycolor.random().toHexString(),
        tinycolor.random().toHexString(),
        tinycolor.random().toHexString()
      )
    }

    this.shuffle(shape.colors)

    return shape
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
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
