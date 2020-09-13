import React from 'react'
import createjs from 'preload-js'
import Airtable from 'airtable'
import {gsap, Quad, Back} from 'gsap'
import tinycolor from 'tinycolor2'
import saveAs from 'file-saver'

import './DisplayCanvas.scss'

import Logo from './Logo'
import HexagonLoader from './HexagonLoader'
import CloseButton from './CloseButton'
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
      this.onCloseButtonClick()
      this.loadImageFromAirtable(id)
    }
  }

  setCanvas() {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    this.canvas.width = this.props.width
    this.canvas.height = this.props.height

    let imageElement = this.mount.querySelector('.image')
    gsap.to(imageElement, {
      duration: 0.2,
      alpha: 0,
      ease: Quad.easeInOut
    })
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

    this.setState({
      activeImage: FileName()
    })

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

    gsap.set('.button-full', {
      backgroundImage: buttonGradient,
      color: buttonColor
    })

    let borderColor = colors[Math.floor(Math.random() * colors.length)]

    gsap.set('.button-small, input', {
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
        this.rebuildImage(JSON.parse(records[0].fields.Configuration))
      }
    }.bind(this))
  }

  setImage(blob) {
    let url = URL.createObjectURL(blob)
    let imageElement = this.mount.querySelector('.image')
    imageElement.style.backgroundImage = 'url(' + url + ')'

    gsap.to(imageElement, {
      duration: 0.5,
      alpha: 1,
      ease: Quad.easeInOut
    })

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
      this.onCloseButtonClick()
      this.loadImageFromAirtable(imageIDField.value)
    } else {
      gsap.to('input', {
        duration: 0.1,
        scale: 1.2,
        rotation: -0.4,
        skewY: 4,
        yoyo: true,
        repeat: 1,
        ease: Quad.easeInOut
      })
    }
  }

  onSaveButtonClick(e) {
    if(this.mainConfig) {
      this.saveImageToAirtable()
    }
  }

  onDownloadButtonClick(e) {
    if(!this.state.activeImage) {
      this.setState({
        activeImage: FileName()
      })
    }

    this.canvas.toBlob(function(blob) {
      saveAs(blob, this.state.activeImage + '.png')
    }.bind(this))
  }

  onGenerateButtonClick(e) {
    this.setState({
      isLoading: true
    })

    let imageIDField = document.querySelector('#imageID')
    imageIDField.value = ''
    this.onCloseButtonClick()
    this.buildImage()
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
    const {isLoading, controlsAreOpen} = this.state

    return (
      <div className='display-canvas' ref={mount => {this.mount = mount}}>
        {isLoading ? <HexagonLoader /> : ''}
        <div className="controls-open" onClick={this.onCloseButtonClick.bind(this)}>
          <CloseButton isOpen={controlsAreOpen} />
        </div>
        <div className="controls-container">
          <div className="controls-background-click" onClick={this.onCloseButtonClick.bind(this)}></div>
          <div className="controls-inner">
            <div className="row">
              <h1>VECTOR<b>FORGE</b></h1>
            </div>
            <div className="row">
              <button onClick={this.onGenerateButtonClick.bind(this)} className="button-full">Generate</button>
            </div>
            <div className="row">
              <button onClick={this.onSaveButtonClick.bind(this)} className="button-small">Save</button>
              <button onClick={this.onDownloadButtonClick.bind(this)} className="button-small">Download</button>
            </div>
            <div className="row">
              <button onClick={this.onLoadButtonClick.bind(this)} className="button-small">Load</button>
              <input type="search" id="imageID" name="imageID"></input>
            </div>
            <Logo />
          </div>
        </div>
        <div className="image"></div>
      </div>
    )
  }
}
