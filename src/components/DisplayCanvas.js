import React from 'react'
import createjs from 'preload-js'
import Airtable from 'airtable'
import './DisplayCanvas.scss'

import LinearGradient from './Canvas/LinearGradient'
import GenerateLinearGradient from './Canvas/GenerateLinearGradient'
import LargeRadialField from './Canvas/LargeRadialField'
import GenerateLargeRadialField from './Canvas/GenerateLargeRadialField'
// import StarField from './Canvas/StarField'

import s1 from '../assets/images/star-sprite-large.png'
import s2 from '../assets/images/star-sprite-small.png'

export default class DisplayCanvas extends React.Component {
  componentDidMount() {
    Airtable.configure({
      endpointUrl: 'https://api.airtable.com',
      apiKey: 'keyea84FaAaGduqyx'
    })

    this.base = Airtable.base('appImg4GSWAPNn2Xc')

    let queueItems = [
      {id: 'star-large', src: s1},
      {id: 'star-small', src: s2}
    ]

    this.queue = new createjs.LoadQueue(true, '')
    this.queue.on('complete', this.buildImage, this)
    this.queue.loadManifest(queueItems)
  }

  buildImage() {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    this.canvas.width = this.props.width
    this.canvas.height = this.props.height

    this.mainConfig = {}
    this.mainConfig.width = this.props.width
    this.mainConfig.height = this.props.height

    let gradientBackgroundConfig = new GenerateLinearGradient(this.props.width, this.props.height, 1)
    this.mainConfig.gradientBackgroundConfig = gradientBackgroundConfig
    let gradientBackground = new LinearGradient(gradientBackgroundConfig)
    this.context.drawImage(gradientBackground, 0, 0)

    this.context.globalCompositeOperation = 'overlay'

    let radialFieldConfig = new GenerateLargeRadialField(this.props.width, this.props.height)
    this.mainConfig.radialFieldConfig = radialFieldConfig
    let radialField = new LargeRadialField(radialFieldConfig)
    this.context.drawImage(radialField, 0, 0)

    // this.context.globalCompositeOperation = 'hard-light'
    //
    // let starField = new StarField(
    //   this.props.width,
    //   this.props.height,
    //   [this.queue.getResult('star-large'), this.queue.getResult('star-small')]
    // )
    // this.context.drawImage(starField, 0, 0)

    this.canvas.toBlob(this.setImage.bind(this))
  }

  saveImageToAirtable() {
    this.base('Images').create([
      {
        "fields": {
          "ID": "NewImage" + Math.random() * 10000000,
          "Configuration": JSON.stringify(this.mainConfig)
        }
      }
    ], function(err, records) {
      if (err) {
        console.error(err)
        return
      }
      records.forEach(function (record) {
        console.log(record.getId())
      })
    })
  }

  setImage(blob) {
    let url = URL.createObjectURL(blob)
    this.mount.style.backgroundImage = 'url(' + url + ')'
  }

  render() {
    return (
      <div className='display-canvas' ref={mount => {this.mount = mount}}></div>
    )
  }
}
