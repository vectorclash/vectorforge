export default function RadialGradient(width, height, colors) {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)

  for (let i = 0; i < colors.length; i++) {
    gradient.addColorStop(i / colors.length, colors[i])
  }

  gradient.addColorStop(1, 'transparent')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  return canvas
}
