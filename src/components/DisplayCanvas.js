import React from 'react'
import Airtable from 'airtable'
import {gsap, Quad, Back, Bounce} from 'gsap'
import tinycolor from 'tinycolor2'
import saveAs from 'file-saver'

import './DisplayCanvas.scss'

import HexagonLoader from './HexagonLoader'
import CloseButton from './CloseButton'
import LinearGradient from './Canvas/LinearGradient'
import GenerateLinearGradient from './Canvas/GenerateLinearGradient'
import LargeRadialField from './Canvas/LargeRadialField'
import GenerateLargeRadialField from './Canvas/GenerateLargeRadialField'
import GenerateStarField from './Canvas/GenerateStarField'
import StarField from './Canvas/StarField'
import GenerateGeometricShape from './Canvas/GenerateGeometricShape'
import GeometricShape from './Canvas/GeometricShape'
import FileName from './FileNameGenerator'

import s1 from '../assets/images/star-sprite-large.png'
import s2 from '../assets/images/star-sprite-small.png'

export default class DisplayCanvas extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      generateDisabled: false,
      isLoading: false,
      controlsAreOpen: true,
      activeImage: ''
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

    this.queue = new window.createjs.LoadQueue(true, '')
    this.queue.on('complete', this.init, this)
    this.queue.loadManifest(queueItems)
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if(id) {
      this.setState({
        isLoading: true
      })
      this.onCloseButtonClick()
      this.loadImageFromAirtable(id)
    } else {
      this.onGenerateButtonClick()
    }
  }

  buildConfig() {
    this.setState({
      activeImage: FileName()
    })

    this.mainConfig = {}
    this.mainConfig.width = this.props.width
    this.mainConfig.height = this.props.height

    let gradientBackgroundConfig = new GenerateLinearGradient(this.props.width, this.props.height, 1)
    this.mainConfig.gradientBackgroundConfig = gradientBackgroundConfig

    this.mainConfig.firstBlend = this.randomBlendMode()

    let radialFieldConfig = new GenerateLargeRadialField(this.props.width, this.props.height)
    this.mainConfig.radialFieldConfig = radialFieldConfig

    this.mainConfig.secondBlend = this.randomBlendMode()

    let starFieldConfig = new GenerateStarField(this.props.width, this.props.height)
    this.mainConfig.starFieldConfig = starFieldConfig

    let geometryChance = Math.random()

    if(geometryChance >= 0.6) {
      this.mainConfig.thirdBlend = this.randomBlendMode()
      let geometryConfig = new GenerateGeometricShape(this.props.width, this.props.height, 10 + Math.round(Math.random() * 30))
      this.mainConfig.geometryConfig = geometryConfig
    }

    let overlayChance = Math.random()

    if(overlayChance >= 0.8) {
      this.mainConfig.overlayBlend = 'hue'
      let overlayConfig = new GenerateLinearGradient(this.props.width, this.props.height, Math.round(Math.random() * 2))
      this.mainConfig.overlayConfig = overlayConfig
    }

    this.buildImage(this.mainConfig)
  }

  buildImage(config) {
    document.body.style.backgroundImage = ''

    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')

    canvas.width = this.props.width
    canvas.height = this.props.height

    this.setState({
      generateDisabled: true
    })

    let gradientBackground = new LinearGradient(config.gradientBackgroundConfig)
    context.drawImage(gradientBackground, 0, 0)

    // change buttons to match backgroundImage
    this.changeGradient(config.gradientBackgroundConfig.colors)
    //

    context.globalCompositeOperation = config.firstBlend

    let radialField = new LargeRadialField(config.radialFieldConfig)
    context.drawImage(radialField, 0, 0)

    context.globalCompositeOperation = config.secondBlend

    let starField = new StarField(config.starFieldConfig, this.queue)
    context.drawImage(starField, 0, 0)

    if(config.geometryConfig) {
      context.globalCompositeOperation = config.thirdBlend

      let geometry = new GeometricShape(config.geometryConfig)
      context.drawImage(geometry, 0, 0)
    }

    if(config.overlayConfig) {
      context.globalCompositeOperation = config.overlayBlend

      let gradientOverlay = new LinearGradient(config.overlayConfig)
      context.drawImage(gradientOverlay, 0, 0)
    }

    canvas.toBlob(this.setImage.bind(this), 'image/jpeg', 0.95)

    canvas.width = 0
    canvas.height = 0
  }

  changeGradient(colors) {
    let buttonGradient = 'linear-gradient(42deg, ' + colors[0] + ', ' + colors[colors.length-1] + ')'
    let buttonColor

    if(tinycolor(colors[0]).isLight() && tinycolor(colors[colors.length-1]).isLight()) {
      buttonColor = '#333333'
    } else {
      buttonColor = '#FAFAFA'
    }

    gsap.set('.button-large', {
      backgroundImage: buttonGradient,
      color: buttonColor
    })

    let borderColor = colors[Math.floor(Math.random() * colors.length)]

    gsap.set('.button-small, .button-medium,  input', {
      borderColor: borderColor
    })
  }

  saveImageToAirtable() {
    let id = this.state.activeImage

    this.base('Images').create([
      {
        "fields": {
          "ID": id,
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
        imageIDField.value = id
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
        this.setState({
          activeImage: id
        })
        this.buildImage(JSON.parse(records[0].fields.Configuration))
      }
    }.bind(this))
  }

  setImage(blob) {
    this.blob = blob
    let url = URL.createObjectURL(blob)
    let imageLoader = document.createElement('img')
    imageLoader.src = url

    imageLoader.addEventListener('load', () => {
      gsap.delayedCall(1, () => {
        document.body.style.backgroundImage = 'url(' + url + ')'

        this.setState({
          generateDisabled: false,
          isLoading: false
        })
      })
    })
  }

  randomBlendMode() {
    const blendModes = [
      'screen',
      'overlay',
      'multiply',
      'hard-light',
      'lighten',
      'darken',
      'soft-light',
      'source-over'
    ]

    let randomBlendMode = Math.floor(Math.random() * blendModes.length)
    return blendModes[randomBlendMode]
  }

  // event handlers

  onLoadButtonClick(e) {
    let imageIDField = document.querySelector('#imageID')
    if(imageIDField.value) {
      this.setState({
        isLoading: true
      })
      this.loadImageFromAirtable(imageIDField.value)
    } else {
      gsap.to('input', {
        duration: 0.1,
        scaleX: 1.2,
        scaleY: 1.4,
        rotation: -0.5 + Math.random() * 1,
        skewY: -5 + Math.random() * 10,
        ease: Bounce.easeOut
      })

      gsap.to('input', {
        duration: 0.1,
        scale: 1,
        rotation: 0,
        skewY: 0,
        ease: Bounce.easeOut,
        delay: 0.1
      })
    }
  }

  onSaveButtonClick(e) {
    if(this.mainConfig) {
      this.saveImageToAirtable()
    }
  }

  onDownloadButtonClick(e) {
    if(this.blob) {
      saveAs(this.blob, this.state.activeImage + '.jpg')
    }
  }

  onGenerateButtonClick(e) {
    const {generateDisabled} = this.state

    if(!generateDisabled) {
      this.setState({
        isLoading: true
      })

      let imageIDField = document.querySelector('#imageID')
      imageIDField.value = ''
      // this.onCloseButtonClick()
      this.buildConfig()
    }
  }

  onCloseButtonClick(e) {
    const {controlsAreOpen} = this.state

    if(controlsAreOpen) {
      this.setState({
        controlsAreOpen: false
      })

      gsap.to('.controls-container', {
        duration: 0.3,
        alpha: 0,
        ease: Quad.easeInOut,
        onComplete: () => {
          gsap.set('.controls-container', {
            display: 'none'
          })
        }
      })
    } else {
      this.setState({
        controlsAreOpen: true
      })

      gsap.to('.controls-container', {
        duration: 0.3,
        alpha: 1,
        ease: Quad.easeInOut,
        onStart: () => {
          gsap.set('.controls-container', {
            display: 'flex'
          })
        }
      })

      gsap.from('.row, .logo', {
        duration: 0.5,
        alpha: 0,
        y: 42,
        stagger: 0.05,
        ease: Back.easeOut
      })
    }
  }

  //

  render() {
    const {isLoading, controlsAreOpen, generateDisabled} = this.state

    return (
      <div className='display-canvas' ref={mount => {this.mount = mount}}>
        {isLoading ? <HexagonLoader /> : ''}
        <div className="controls-open" onClick={this.onCloseButtonClick.bind(this)}>
          <CloseButton isOpen={controlsAreOpen} />
        </div>
        <div className="controls-container">
          {controlsAreOpen ? <div className="controls-background-click" onClick={this.onCloseButtonClick.bind(this)}></div> : ''}
          <div className="controls-inner">
            <div className="row">
              <button onClick={this.onGenerateButtonClick.bind(this)} className={'button-large ' + (generateDisabled ? 'disabled' : 'enabled')}>Generate</button>
            </div>
            <div className="row">
              <button onClick={this.onSaveButtonClick.bind(this)} className="button-small">Save</button>
              <button onClick={this.onDownloadButtonClick.bind(this)} className="button-small">Download</button>
            </div>
            <div className="row">
              <input type="search" id="imageID" name="imageID"></input>
            </div>
            <div className="row">
              <button onClick={this.onLoadButtonClick.bind(this)} className="button-medium">Load</button>
            </div>
            <div className="row">
              <h1>VECTOR<b>FORGE</b></h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
