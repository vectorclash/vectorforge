import React from 'react'
import Airtable from 'airtable'
import {gsap, Quad, Back, Bounce} from 'gsap'
import tinycolor from 'tinycolor2'
import saveAs from 'file-saver'

import './DisplayCanvas.scss'

import HexagonLoader from './HexagonLoader'
import CloseButton from './buttons/CloseButton'
import LinearGradient from './canvas/LinearGradient'
import GenerateLinearGradient from './canvas/GenerateLinearGradient'
import LargeRadialField from './canvas/LargeRadialField'
import GenerateLargeRadialField from './canvas/GenerateLargeRadialField'
import GenerateStarField from './canvas/GenerateStarField'
import StarField from './canvas/StarField'
import GenerateGeometricShape from './canvas/GenerateGeometricShape'
import GeometricShape from './canvas/GeometricShape'
import FileName from './FileNameGenerator'
import SettingsButton from './buttons/SettingsButton'
import AddColorButton from './buttons/AddColorButton'
import ColorField from './ColorField'

import s1 from '../assets/images/star-sprite-large.png'
import s2 from '../assets/images/star-sprite-small.png'

export default class DisplayCanvas extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      generateDisabled: false,
      isLoadingFromDB: false,
      isLoading: false,
      isSaving: false,
      isSaved: false,
      loadFieldText: '',
      controlsAreOpen: true,
      canCloseAgain: false,
      activeImage: '',
      controlsBlurred: false,
      saveVisible: false,
      colors: [],
      linkCopied: false,
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
        isLoading: true,
        isSaved: true,
        isLoadingFromDB: true,
      })
      this.loadImageFromAirtable(id)
    } else {
      this.onGenerateButtonClick()
    }

    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  buildConfig() {
    this.setState({
      activeImage: FileName()
    })

    this.mainConfig = {}
    this.mainConfig.width = this.props.width
    this.mainConfig.height = this.props.height

    let gradientBackgroundConfig = new GenerateLinearGradient(this.props.width, this.props.height, 1, this.state.colors.slice())
    this.mainConfig.gradientBackgroundConfig = gradientBackgroundConfig

    let radialChance = Math.random()

    if(radialChance > 0.4) {
      this.mainConfig.firstBlend = this.randomBlendMode()

      let radialFieldConfig = new GenerateLargeRadialField(this.props.width, this.props.height, this.state.colors.slice())
      this.mainConfig.radialFieldConfig = radialFieldConfig
    }

    this.mainConfig.secondBlend = this.randomBlendMode()

    let starFieldConfig = new GenerateStarField(this.props.width, this.props.height, this.state.colors.slice())
    this.mainConfig.starFieldConfig = starFieldConfig

    let geometryChance = Math.random()

    if(geometryChance >= 0.6) {
      this.mainConfig.thirdBlend = this.randomBlendMode()
      
      let geometryConfig = new GenerateGeometricShape(this.props.width, this.props.height, 10 + Math.round(Math.random() * 30), this.state.colors.slice())
      this.mainConfig.geometryConfig = geometryConfig
    }

    let overlayChance = Math.random()

    if(overlayChance >= 0.7 && this.state.colors.length > 0) {
      this.mainConfig.overlayBlend = this.randomBlendMode()
      this.mainConfig.overlayAlpha = (Math.random()).toFixed(2)
      let overlayConfig = new GenerateLinearGradient(this.props.width, this.props.height, Math.round(Math.random() * 2), this.state.colors.slice())
      this.mainConfig.overlayConfig = overlayConfig
    }

    this.buildImage(this.mainConfig)
  }

  buildImage(config) {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')

    canvas.width = this.props.width
    canvas.height = this.props.height

    this.setState({
      generateDisabled: true,
      linkCopied: false
    })

    let gradientBackground = new LinearGradient(config.gradientBackgroundConfig)
    context.drawImage(gradientBackground, 0, 0)
    this.clearElement(gradientBackground)

    // change buttons to match backgroundImage
    this.changeGradient(config.gradientBackgroundConfig.colors)
    //

    if(config.radialFieldConfig) {
      context.globalCompositeOperation = config.firstBlend

      let radialField = new LargeRadialField(config.radialFieldConfig)
      context.drawImage(radialField, 0, 0)
      this.clearElement(radialField)
    }

    context.globalCompositeOperation = config.secondBlend

    let starField = new StarField(config.starFieldConfig, this.queue)
    context.drawImage(starField, 0, 0)
    this.clearElement(starField)

    if(config.geometryConfig) {
      context.globalCompositeOperation = config.thirdBlend

      let geometry = new GeometricShape(config.geometryConfig)
      context.drawImage(geometry, 0, 0)
      this.clearElement(geometry)
    }

    if(config.overlayConfig) {
      context.globalCompositeOperation = config.overlayBlend
      context.globalAlpha = config.overlayAlpha

      let gradientOverlay = new LinearGradient(config.overlayConfig)
      context.drawImage(gradientOverlay, 0, 0)
      this.clearElement(gradientOverlay)
    }

    canvas.toBlob(this.setImage.bind(this), 'image/jpeg', 0.98)

    this.clearElement(canvas)
  }

  clearElement(element) {
    element.width = 0
    element.height = 0
    element = null
  }

  changeGradient(colors) {
    let buttonGradient = 'linear-gradient(42deg, ' + colors[0] + ', ' + colors[colors.length-1] + ')'
    let buttonColor

    if(tinycolor(colors[0]).isLight() && tinycolor(colors[colors.length-1]).isLight()) {
      buttonColor = '#333333'
    } else {
      buttonColor = '#FAFAFA'
    }

    gsap.set('.button-large, .text-container', {
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
    ], (err, records) => {
      if (err) {
        this.setState({
          isSaved: false,
          isSaving: false
        })
        console.error(err)
        return
      }

      records.forEach((record) => {
        let imageIDField = document.querySelector('#imageID')
        imageIDField.value = record.fields.ID

        this.setState({
          isSaved: true,
          isSaving: false,
          isLoading: false
        })
        
        this.openSavePanel()
      })
    })
  }

  loadImageFromAirtable(id) {
    this.base('Images').select({
      filterByFormula: "({ID} = '" + id + "')"
    }).firstPage(function(err, records) {
      if(err) {
        this.setState({
          isLoadingFromDB: false,
          isLoading: false,
          isSaved: false
        })
        console.error(err)
        return
      }

      if(records[0]) {
        this.setState({
          isLoadingFromDB: false,
          isLoading: true,
          isSaved: true,
          activeImage: id
        })

        gsap.to('.image-container', {
          duration: 0.2,
          alpha: 0,
          ease: Quad.easeInOut
        })

        this.buildImage(JSON.parse(records[0].fields.Configuration))
      } else {
        let imageIDField = document.querySelector('#imageID')
        imageIDField.value = ''
        this.wiggleLoadField()
        this.setState({
          isLoadingFromDB: false,
          isLoading: false,
          isSaved: false
        })
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
        let imageContainer = document.querySelector('.image-container')
        imageContainer.style.backgroundImage = 'url(' + url + ')'

        gsap.to('.image-container', {
          duration: 0.2,
          alpha: 1,
          ease: Quad.easeInOut
        })

        this.setState({
          generateDisabled: false,
          isLoading: false,
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

  animateColors() {
    if(this.state.colors.length > 0) {
      gsap.fromTo('.color-container', {
        y: -10,
        alpha: 0,
      },
      {
        duration: 0.2,
        y: 0,
        alpha: 1,
        stagger: 0.02,
        ease: Back.easeOut
      })
    }
  }

  updateColors() {
    let colorFields = document.querySelectorAll('.color')
    let colorArray = []
    for (let i = 0; i < colorFields.length; i++) {
      colorArray.push(colorFields[i].value)
    }

    this.setState({
      colors: colorArray
    })
  }

  openSavePanel() {
    gsap.to('#controls-main', {
      duration: 0.2,
      alpha: 0.5,
      scale: 0.9,
      filter: 'blur(3px)',
      ease: Back.easeOut
    })

    gsap.from('#controls-save', {
      duration: 0.2,
      alpha: 0,
      scale: 1.2,
      ease: Back.easeOut
    })

    this.setState({
      saveVisible: true
    })
  }

  wiggleLoadField() {
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

  // event handlers

  onLoadButtonClick(e) {
    const { generateDisabled } = this.state

    this.setState({
      isLoadingFromDB: true,
    })

    if (!generateDisabled) {
      let imageIDField = document.querySelector('#imageID')
      if (imageIDField.value) {
        this.loadImageFromAirtable(imageIDField.value)
      } else {
        this.setState({
          isLoadingFromDB: false,
        })
        this.wiggleLoadField()
      }
    }
  }

  onSaveButtonClick(e) {
    const {isSaving, isSaved} = this.state

    if(this.mainConfig && !isSaved && !isSaving) {
      this.setState({
        isSaving: true,
        isLoading: true,
      })

      this.saveImageToAirtable()
    }

    if(isSaved) {
      this.openSavePanel()
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
      gsap.to('.image-container', {
        duration: 0.2,
        alpha: 0,
        ease: Quad.easeInOut
      })

      this.setState({
        isLoading: true,
        isSaved: false
      })

      let imageIDField = document.querySelector('#imageID')
      imageIDField.value = ''
      // this.onCloseButtonClick()
      this.buildConfig()
    }
  }

  onCloseButtonClick(e) {
    const {controlsAreOpen} = this.state
    this.onSettingsCloseButtonClick()

    if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
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
  }

  onSettingsButtonClick(e) {
    gsap.to('#controls-main', {
      duration: 0.2,
      alpha: 0.5,
      scale: 0.9,
      filter: 'blur(3px)',
      ease: Back.easeOut
    })

    gsap.from('#controls-settings', {
      duration: 0.2,
      alpha: 0,
      scale: 1.2,
      ease: Back.easeOut
    })

    this.setState({
      controlsBlurred: true
    })
  }

  onSettingsCloseButtonClick(e) {
    gsap.to('#controls-main', {
      duration: 0.2,
      alpha: 0.9,
      scale: 1,
      filter: 'blur(0px)',
      ease: Back.easeOut,
      onComplete: () => {
        this.updateColors()
      }
    })

    this.setState({
      controlsBlurred: false,
      saveVisible: false,
      linkCopied: false
    })
  }

  onAddColorButtonClick(e) {
    let colors = [...this.state.colors]
    colors.push(new tinycolor.random().toHexString())
    this.setState({
      colors: colors
    })

    gsap.delayedCall(0.05, () => {
      this.animateColors()
    })
  }

  onRemoveColorbuttonClick(color) {
    let colorFields = document.querySelectorAll('.color')
    let colorArray = []
    for (let i = 0; i < colorFields.length; i++) {
      if (colorFields[i].value !== color) {
        colorArray.push(colorFields[i].value)
      }
    }
    
    this.setState({
      colors: []
    })

    gsap.delayedCall(0.001, () => {
      this.setState({
        colors: colorArray
      })

      this.animateColors()
    })
  }

  onKeyUp(e) { 
    if (e.key === "Enter" && !this.state.controlsAreOpen) {
      this.onGenerateButtonClick()
    }
  }

  onImageIDFieldFocus(e) {
    if(e.target.value !== '') {
      this.setState({ loadFieldText: e.target.value })
    }
    e.target.value = ''
  }

  onImageIDFieldBlur(e) {
    const { loadFieldText } = this.state
    if (e.target.value === '' && loadFieldText !== '') {
      e.target.value = loadFieldText
    }
  }

  onDirectLinkClick(e) {
    const { isSaved } = this.state
    if (isSaved) {
      let imageURL = window.location.origin.toString() + '/forge/?id=' + this.state.activeImage
      navigator.clipboard.writeText(imageURL).then(function () {
        this.setState({ linkCopied: true })
      }.bind(this), function () {
        console.log('Copy Error')
      })
    }
  }

  //

  render() {
    const {isLoadingFromDB, isLoading, isSaving, isSaved, controlsAreOpen, generateDisabled, controlsBlurred, colors, saveVisible, activeImage, linkCopied} = this.state

    return (
      <div className="display-canvas" ref={mount => {this.mount = mount}}>
        {isLoading ? <HexagonLoader /> : ''}
        <div className="controls-open" onClick={this.onCloseButtonClick.bind(this)}>
          <CloseButton isOpen={controlsAreOpen} />
        </div>
        <div className="image-container" onClick={this.onCloseButtonClick.bind(this)}></div>
        <div className="controls-container">
          {controlsAreOpen ? <div className="controls-background-click" onClick={this.onCloseButtonClick.bind(this)}></div> : ''} 
          <div id="controls-main" className={'controls-inner' + (controlsBlurred ? ' controls-blurred' : '')}>
            <div className="row">
              <button onClick={this.onGenerateButtonClick.bind(this)} className={'button-large' + (generateDisabled ? ' disabled' : ' enabled')}>
                {generateDisabled ? 'Generating' : 'Generate'}
              </button>
            </div>
            <div className="row">
              <button onClick={this.onSaveButtonClick.bind(this)} className="button-small">
                {isSaving ? 'Saving' : [isSaved ? 'Saved' : 'Save']}
              </button>
              <button onClick={this.onDownloadButtonClick.bind(this)} className="button-small">Download</button>
            </div>
            <div className="row">
              <input id="imageID" name="imageID" onBlur={this.onImageIDFieldBlur.bind(this)} onFocus={this.onImageIDFieldFocus.bind(this)}></input>
            </div>
            <div className="row">
              <button onClick={this.onLoadButtonClick.bind(this)} className="button-medium">
                {isLoadingFromDB ? 'Loading' : 'Load'}
              </button>
            </div>
            <div className="row">
              <h1>VECTOR<b>FORGE</b></h1>
              <button onClick={this.onSettingsButtonClick.bind(this)} className="button-icon">
                <SettingsButton />
              </button>
            </div>
          </div>

          <div id="controls-settings" className={'controls-inner controls-settings' + (controlsBlurred ? ' controls-visible' : '')}>
            <div className="row colors">
              {colors.map((color, index) => (
                <ColorField 
                  color={color} 
                  key={index}
                  callback={this.onRemoveColorbuttonClick.bind(this)} 
                />
              ))}
              {colors.length < 6 ? <button onClick={this.onAddColorButtonClick.bind(this)} className="button-small">ADD COLOR <AddColorButton /></button> : ''}
            </div>
            <div className="row">
              <button onClick={this.onSettingsCloseButtonClick.bind(this)} className="button-medium">BACK</button>
            </div>
          </div>

          <div id="controls-save" className={'controls-inner controls-settings' + (saveVisible ? ' controls-visible' : '')}>
            <div className="row text-container">
              <h6>Image Saved</h6>
              <p>Use the link below to retrieve your image or enter the image ID into the input field and press the load button</p>
              <p onClick={this.onDirectLinkClick.bind(this)}>
                <b>https://www.vectorclash.space/forge/?id={ activeImage }</b>
              </p>
              {linkCopied ? <p class="alert">Link copied to clipboard</p> : ''}
            </div>
            <div className="row">
              <button onClick={this.onSettingsCloseButtonClick.bind(this)} className="button-medium">BACK</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
