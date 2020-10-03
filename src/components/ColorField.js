import gsap from 'gsap/gsap-core'
import React from 'react'
// import gsap from 'gsap'
import tinycolor from 'tinycolor2'
import CloseColorButton from './buttons/CloseColorButton'

import './ColorField.scss'

export default class ColorField extends React.Component {
  componentDidMount() {
    window.jscolor.install()
    this.adjustColor(this.props.color)
  }

  adjustColor(color) {
    if (tinycolor(color).isLight()) {
      gsap.set(this.mount.querySelector('.color'), {
        color: '#333333'
      })

      gsap.set(this.mount.querySelector('svg'), {
        fill: '#333333'
      })
    } else if (tinycolor(color).isDark()) {
      gsap.set(this.mount.querySelector('.color'), {
        color: '#FAFAFA'
      })

      gsap.set(this.mount.querySelector('svg'), {
        fill: '#FAFAFA'
      })
    }
  }

  onCloseClick(e) {
    this.props.callback(this.mount.querySelector('input').value)
  }

  onColorInput(e) {
    this.adjustColor(e.target.value)
  }

  render() {
    return (
      <div className="color-container" ref={mount => { this.mount = mount }}>
        <div className="color-close-button" onClick={this.onCloseClick.bind(this)}>
          <CloseColorButton />
        </div>
        <input className="color" data-jscolor="" defaultValue={this.props.color} onInput={this.onColorInput.bind(this)}/>
      </div>
    )
  }
}