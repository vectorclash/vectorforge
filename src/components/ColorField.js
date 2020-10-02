import React from 'react'
import CloseColorButton from './buttons/CloseColorButton'

import './ColorField.scss'

export default class ColorField extends React.Component {
  componentDidMount() {
    window.jscolor.install()
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