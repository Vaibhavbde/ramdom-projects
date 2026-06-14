import { useState } from 'react'
import './App.css'
import ClickComboGame from './components/ClickComboGame'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ClickComboGame />
  )
}

export default App
