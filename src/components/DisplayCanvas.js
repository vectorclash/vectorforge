import React from 'react'
import createjs from 'preload-js'
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

    let gradientConfig = new GenerateLinearGradient(this.props.width, this.props.height, 1)
    let gradientBG = new LinearGradient(gradientConfig)
    this.context.drawImage(gradientBG, 0, 0)

    this.context.globalCompositeOperation = 'overlay'

    let radialFieldConfig = new GenerateLargeRadialField(this.props.width, this.props.height)
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
