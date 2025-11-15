export default function LinearGradient(config) {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')

  canvas.width = config.width
  canvas.height = config.height

  let gradient = context.createLinearGradient(
    config.gradientDirection.x1,
    config.gradientDirection.y1,
    config.gradientDirection.x2,
    config.gradientDirection.y2,
  )

  for (let i = 0; i < config.colors.length; i++) {
    let color = config.colors[i]
    gradient.addColorStop(i / config.colors.length, color)
  }

  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  return canvas
}
