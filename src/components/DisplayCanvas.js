import React from 'react'
import createjs from 'preload-js'
import Airtable from 'airtable'
import './DisplayCanvas.scss'

import LinearGradient from './Canvas/LinearGradient'
import GenerateLinearGradient from './Canvas/GenerateLinearGradient'
import LargeRadialField from './Canvas/LargeRadialField'
import GenerateLargeRadialField from './Canvas/GenerateLargeRadialField'
// import StarField from './Canvas/StarField'

import FileName from './FileNameGenerator'

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
    this.queue.on('complete', this.init, this)
    this.queue.loadManifest(queueItems)
  }

  init() {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    this.canvas.width = this.props.width
    this.canvas.height = this.props.height
  }

  buildImage() {
    this.context.clearRect(0, 0, this.props.width, this.props.height)

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

  rebuildImage(config) {
    this.context.clearRect(0, 0, config.width, config.height)

    let gradientBackground = new LinearGradient(config.gradientBackgroundConfig)
    this.context.drawImage(gradientBackground, 0, 0)

    this.context.globalCompositeOperation = 'overlay'

    let radialField = new LargeRadialField(config.radialFieldConfig)
    this.context.drawImage(radialField, 0, 0)

    this.canvas.toBlob(this.setImage.bind(this))
  }

  saveImageToAirtable() {
    let newID = FileName()
    console.log(newID)
    this.base('Images').create([
      {
        "fields": {
          "ID": newID,
          "Configuration": JSON.stringify(this.mainConfig)
        }
      }
    ], function(err, records) {
      if (err) {
        console.error(err)
        return
      }
      records.forEach(function (record) {
        let imageIDField = document.querySelector('#imageID')
        imageIDField.value = newID
      })
    })
  }

  loadImageFromAirtable(id) {
    this.base('Images').select({
      filterByFormula: "({ID} = '" + id + "')"
    }).firstPage(function(err, records) {
      if(err) {
        console.error(err)
        return
      }

      this.rebuildImage(JSON.parse(records[0].fields.Configuration))
    }.bind(this))
  }

  setImage(blob) {
    let url = URL.createObjectURL(blob)
    this.mount.style.backgroundImage = 'url(' + url + ')'
  }

  // event handlers

  onLoadButtonClick(e) {
    let imageIDField = document.querySelector('#imageID')
    if(imageIDField.value) {
      this.loadImageFromAirtable(imageIDField.value)
    }
  }

  onSaveButtonClick(e) {
    if(this.mainConfig) {
      this.saveImageToAirtable()
    }
  }

  onGenerateButtonClick(e) {
    let imageIDField = document.querySelector('#imageID')
    imageIDField.value = ''
    this.buildImage()
  }

  render() {
    return (
      <div className='display-canvas' ref={mount => {this.mount = mount}}>
        <div className='controls'>
          <button onClick={this.onGenerateButtonClick.bind(this)}>Generate Image</button>
          <button onClick={this.onSaveButtonClick.bind(this)}>Save Image</button>
          <input type="search" id="imageID" name="imageID"></input>
          <button onClick={this.onLoadButtonClick.bind(this)}>Load Image</button>
        </div>
      </div>
    )
  }
}
