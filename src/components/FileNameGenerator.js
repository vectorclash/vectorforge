export default function FileName() {
  let name = "VectorImage"
  let min = 10000000
  let max = 99999999

  name += Math.floor(Math.random() * (max - min + 1)) + min

  return name
}
