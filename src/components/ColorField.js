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
    this.props.callback(this.props.colorId)
  }

  onColorInput(e) {
    this.adjustColor(e.target.value)
  }

  onDragStart(e) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', this.props.colorId.toString())
    if (this.mount) {
      this.mount.style.opacity = '0.4'
      this.mount.classList.add('dragging')
    }
  }

  onDragEnd(e) {
    if (this.mount) {
      this.mount.style.opacity = '1'
      this.mount.classList.remove('dragging')
    }
    // Clean up any leftover drag-over classes
    document.querySelectorAll('.color-container.drag-over').forEach(el => {
      el.classList.remove('drag-over')
    })
  }

  onDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault()
    }
    e.dataTransfer.dropEffect = 'move'
    return false
  }

  onDragEnter(e) {
    // Only add drag-over if this element is not being dragged
    if (this.mount && !this.mount.classList.contains('dragging')) {
      this.mount.classList.add('drag-over')
    }
  }

  onDragLeave(e) {
    // Remove drag-over when leaving, but check if we're actually leaving the container
    if (this.mount && e.target === this.mount) {
      this.mount.classList.remove('drag-over')
    }
  }

  onDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    if (e.preventDefault) {
      e.preventDefault()
    }

    if (this.mount) {
      this.mount.classList.remove('drag-over')
    }

    const draggedColorId = parseInt(e.dataTransfer.getData('text/plain'))
    const targetColorId = this.props.colorId

    if (draggedColorId !== targetColorId && this.props.onReorder) {
      this.props.onReorder(draggedColorId, targetColorId)
    }

    return false
  }

  render() {
    return (
      <div
        className="color-container"
        ref={mount => { this.mount = mount }}
        onDragOver={this.onDragOver.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
        onDrop={this.onDrop.bind(this)}
      >
        <div
          className="color-drag-handle"
          draggable="true"
          onDragStart={this.onDragStart.bind(this)}
          onDragEnd={this.onDragEnd.bind(this)}
        >
          ⋮⋮
        </div>
        <div className="color-close-button" onClick={this.onCloseClick.bind(this)}>
          <CloseColorButton />
        </div>
        <input className="color" data-jscolor="" defaultValue={this.props.color} onInput={this.onColorInput.bind(this)}/>
      </div>
    )
  }
}