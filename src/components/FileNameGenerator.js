const astroNouns = [
  'Accretion',
  'Aurora',
  'Aperture',
  'Chromosphere',
  'Comet',
  'Eclipse',
  'Filament',
  'Cluster',
  'Heliopause',
  'Field',
  'Planet',
  'Photosphere',
  'Prominence',
  'Quasar',
  'Star',
  'Umbra',
  'Wavelength'
]

const astroAdj = [
  'Binary',
  'Blueshift',
  'Cavus',
  'Circumpolar',
  'Cosmic',
  'Dark',
  'Electromagnetic',
  'Extragalactic',
  'Galactic',
  'Geosynchronous',
  'Molecular',
  'Globular',
  'Gravitational',
  'Lenticular',
  'Magnetic',
  'Retrograde',
  'Sidereal',
  'Supergiant',
  'Terrestrial'
]

export default function FileName() {
  let name = astroAdj[Math.floor(Math.random() * astroAdj.length)] + astroNouns[Math.floor(Math.random() * astroNouns.length)]
  let d = Date.now()
  name += d

  return name
}
