const astroNouns = [
  'Accretion',
  'Aurora',
  'Aperture',
  'Chromosphere',
  'Comet',
  'Eclipse',
  'Element',
  'Energy',
  'Filament',
  'Gravity',
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
];

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
];

export default function FileName() {
  let name =
    astroAdj[Math.floor(Math.random() * astroAdj.length)] +
    astroNouns[Math.floor(Math.random() * astroNouns.length)];
  // let d = Date.now()
  let d1 = Math.floor(1000000 + Math.random() * 9000000);

  name += '_' + d1;

  return name;
}
