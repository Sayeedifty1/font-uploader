import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import FontUploader from './components/FontUploader'
import FontList from './components/FontList'

function App() {

  return (
    <>
     <FontUploader/>
     <FontList/>
    </>
  )
}

export default App
