import React from 'react'
import createjs from 'preload-js'
import Airtable from 'airtable'
import gsap from 'gsap'
import tinycolor from 'tinycolor2'
import './DisplayCanvas.scss'

import Logo from './Logo'
import HexagonLoader from './HexagonLoader'

import LinearGradient from './Canvas/LinearGradient'
import GenerateLinearGradient from './Canvas/GenerateLinearGradient'
import LargeRadialField from './Canvas/LargeRadialField'
import GenerateLargeRadialField from './Canvas/GenerateLargeRadialField'
import GenerateStarField from './Canvas/GenerateStarField'
import StarField from './Canvas/StarField'

import FileName from './FileNameGenerator'

import s1 from '../assets/images/star-sprite-large.png'
import s2 from '../assets/images/star-sprite-small.png'

export default class DisplayCanvas extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

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
    this.setCanvas()

    this.blendModes = [
      'screen',
      'overlay',
      'multiply',
      'hard-light',
      'lighten',
      'darken',
      'soft-light',
      'source-over'
    ]

    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if(id) {
      this.setState({
        isLoading: true
      })
      this.loadImageFromAirtable(id)
    }
  }

  setCanvas() {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    this.canvas.width = this.props.width
    this.canvas.height = this.props.height

    this.mount.style.backgroundImage = 'none'
  }

  buildImage() {
    this.setCanvas()

    this.mainConfig = {}
    this.mainConfig.width = this.props.width
    this.mainConfig.height = this.props.height

    let gradientBackgroundConfig = new GenerateLinearGradient(this.props.width, this.props.height, 1)
    this.mainConfig.gradientBackgroundConfig = gradientBackgroundConfig
    let gradientBackground = new LinearGradient(gradientBackgroundConfig)
    this.context.drawImage(gradientBackground, 0, 0)

    // change buttons to match backgroundImage
    this.changeGradient(gradientBackgroundConfig.colors)
    //

    this.mainConfig.firstBlend = this.randomBlendMode()
    this.context.globalCompositeOperation = this.mainConfig.firstBlend

    let radialFieldConfig = new GenerateLargeRadialField(this.props.width, this.props.height)
    this.mainConfig.radialFieldConfig = radialFieldConfig
    let radialField = new LargeRadialField(radialFieldConfig)
    this.context.drawImage(radialField, 0, 0)

    let starFieldConfig = new GenerateStarField(this.props.width, this.props.height)
    this.mainConfig.starFieldConfig = starFieldConfig

    this.mainConfig.secondBlend = this.randomBlendMode()
    this.context.globalCompositeOperation = this.mainConfig.secondBlend

    let starField = new StarField(starFieldConfig, this.queue)
    this.context.drawImage(starField, 0, 0)

    this.canvas.toBlob(this.setImage.bind(this))
  }

  rebuildImage(config) {
    this.setCanvas()

    let gradientBackground = new LinearGradient(config.gradientBackgroundConfig)
    this.context.drawImage(gradientBackground, 0, 0)

    // change buttons to match backgroundImage
    this.changeGradient(config.gradientBackgroundConfig.colors)
    //

    this.context.globalCompositeOperation = config.firstBlend

    let radialField = new LargeRadialField(config.radialFieldConfig)
    this.context.drawImage(radialField, 0, 0)

    this.context.globalCompositeOperation = config.secondBlend

    let starField = new StarField(config.starFieldConfig, this.queue)
    this.context.drawImage(starField, 0, 0)

    this.canvas.toBlob(this.setImage.bind(this))
  }

  changeGradient(colors) {
    let buttonGradient = 'linear-gradient(42deg, ' + colors[0] + ', ' + colors[colors.length-1] + ')'
    let buttonColor

    if(tinycolor(colors[0]).isLight() && tinycolor(colors[colors.length-1]).isLight()) {
      buttonColor = '#333333'
    } else {
      buttonColor = '#FAFAFA'
    }

    gsap.set('button', {
      backgroundImage: buttonGradient,
      color: buttonColor
    })
  }

  saveImageToAirtable() {
    let newID = FileName()

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

      if(records[0]) {
        this.rebuildImage(JSON.parse(records[0].fields.Configuration))
      }
    }.bind(this))
  }

  setImage(blob) {
    let url = URL.createObjectURL(blob)
    this.mount.style.backgroundImage = 'url(' + url + ')'

    this.setState({
      isLoading: false
    })
  }

  randomBlendMode() {
    let randomBlendMode = Math.floor(Math.random() * this.blendModes.length)
    return this.blendModes[randomBlendMode]
  }

  // event handlers

  onLoadButtonClick(e) {
    let imageIDField = document.querySelector('#imageID')
    if(imageIDField.value) {
      this.setState({
        isLoading: true
      })
      this.loadImageFromAirtable(imageIDField.value)
    }
  }

  onSaveButtonClick(e) {
    if(this.mainConfig) {
      this.saveImageToAirtable()
    }
  }

  onGenerateButtonClick(e) {
    this.setState({
      isLoading: true
    })

    let imageIDField = document.querySelector('#imageID')
    imageIDField.value = ''
    this.buildImage()
  }

  //

  render() {
    const {isLoading} = this.state

    return (
      <div className='display-canvas' ref={mount => {this.mount = mount}}>
        {isLoading ? <HexagonLoader /> : ''}
        <div className='controls-tab'></div>
        <div className='controls'>
          <h1>VECTOR<strong>FORGE</strong></h1>
          <button onClick={this.onGenerateButtonClick.bind(this)}>Generate Image</button>
          <button onClick={this.onSaveButtonClick.bind(this)}>Save Image</button>
          <input type="search" id="imageID" name="imageID"></input>
          <button onClick={this.onLoadButtonClick.bind(this)}>Load Image</button>
          <Logo />
        </div>
      </div>
    )
  }
}
