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

  onMouseDown(e) {
    // Only start drag from the drag handle
    if (!e.target.classList.contains('color-drag-handle')) {
      return
    }

    e.preventDefault()

    this.isDragging = true
    this.startX = e.clientX
    this.startY = e.clientY

    // Get initial position
    const rect = this.mount.getBoundingClientRect()
    this.initialX = rect.left
    this.initialY = rect.top

    // Create a clone for visual dragging
    this.dragClone = this.mount.cloneNode(true)
    this.dragClone.classList.add('drag-clone')
    this.dragClone.style.position = 'fixed'
    this.dragClone.style.left = rect.left + 'px'
    this.dragClone.style.top = rect.top + 'px'
    this.dragClone.style.width = rect.width + 'px'
    this.dragClone.style.height = rect.height + 'px'
    this.dragClone.style.pointerEvents = 'none'
    this.dragClone.style.zIndex = '1000'
    this.dragClone.style.opacity = '0.8'

    // Copy the background color from the original input to the clone
    const originalInput = this.mount.querySelector('.color')
    const cloneInput = this.dragClone.querySelector('.color')
    if (originalInput && cloneInput) {
      const computedStyle = window.getComputedStyle(originalInput)
      cloneInput.style.backgroundColor = computedStyle.backgroundColor
    }

    document.body.appendChild(this.dragClone)

    // Add dragging class to original
    this.mount.classList.add('dragging')

    // Add listeners
    document.addEventListener('mousemove', this.onMouseMove.bind(this))
    document.addEventListener('mouseup', this.onMouseUp.bind(this))
  }

  onMouseMove(e) {
    if (!this.isDragging || !this.dragClone) return

    e.preventDefault()

    const deltaX = e.clientX - this.startX
    const deltaY = e.clientY - this.startY

    this.dragClone.style.left = (this.initialX + deltaX) + 'px'
    this.dragClone.style.top = (this.initialY + deltaY) + 'px'

    // Check if we're over another color container
    const elements = document.elementsFromPoint(e.clientX, e.clientY)
    const targetContainer = elements.find(el => {
      // Must be a color-container
      if (!el.classList.contains('color-container')) return false
      // Must not be the clone
      if (el.classList.contains('drag-clone')) return false
      // Must not be the currently dragging element
      if (el === this.mount) return false
      // Must have a valid color ID
      const colorId = el.getAttribute('data-color-id')
      if (!colorId) return false

      return true
    })

    // Clear previous hover states
    document.querySelectorAll('.color-container.drag-over').forEach(el => {
      if (el !== targetContainer) {
        el.classList.remove('drag-over')
      }
    })

    // Add hover state to current target
    if (targetContainer) {
      targetContainer.classList.add('drag-over')
      this.dropTarget = targetContainer
    } else {
      this.dropTarget = null
    }
  }

  onMouseUp(e) {
    if (!this.isDragging) return

    this.isDragging = false

    // Remove clone
    if (this.dragClone && this.dragClone.parentNode) {
      this.dragClone.parentNode.removeChild(this.dragClone)
      this.dragClone = null
    }

    // Remove dragging class
    if (this.mount) {
      this.mount.classList.remove('dragging')
    }

    // Handle drop
    if (this.dropTarget && this.props.onReorder) {
      const targetColorId = parseInt(this.dropTarget.getAttribute('data-color-id'), 10)
      if (!isNaN(targetColorId) && targetColorId !== this.props.colorId) {
        this.props.onReorder(this.props.colorId, targetColorId)
      }
    }

    // Clean up
    document.querySelectorAll('.color-container.drag-over').forEach(el => {
      el.classList.remove('drag-over')
    })
    this.dropTarget = null

    // Remove listeners
    document.removeEventListener('mousemove', this.onMouseMove.bind(this))
    document.removeEventListener('mouseup', this.onMouseUp.bind(this))
  }

  render() {
    return (
      <div
        className="color-container"
        ref={mount => { this.mount = mount }}
        data-color-id={this.props.colorId}
        onMouseDown={this.onMouseDown.bind(this)}
      >
        <div className="color-drag-handle">
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