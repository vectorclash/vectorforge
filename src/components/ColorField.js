import React from 'react'
import {gsap, Back} from 'gsap'
import CloseColorButton from './buttons/CloseColorButton'

import './ColorField.scss'

export default class ColorField extends React.Component {
  componentDidMount() {
    window.jscolor.install()

    gsap.from(this.mount, {
      duration: 0.5,
      y: -10,
      alpha: 0,
      ease: Back.easeOut
    })
  }

  onCloseClick(e) {
    this.props.callback(this.mount.querySelector('input').value)
  }

  render() {
    return (
      <div className="color-container" ref={mount => { this.mount = mount }}>
        <div className="color-close-button" onClick={this.onCloseClick.bind(this)}>
          <CloseColorButton />
        </div>
        <input className="color" data-jscolor="" defaultValue={this.props.color} />
      </div>
    )
  }
}