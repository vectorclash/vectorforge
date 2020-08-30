import React from 'react'
import './App.scss'

import DisplayCanvas from './components/DisplayCanvas'

export default function App() {
  return (
    <div className="App">
      <DisplayCanvas width='4096' height='2160' />
    </div>
  )
}
