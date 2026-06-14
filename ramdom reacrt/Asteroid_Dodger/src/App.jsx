import { useState } from 'react'
import './App.css'
import AsteroidDodger from './components/AsteroidDodger'

function App() {
  const [count, setCount] = useState(0)

  return (
      <AsteroidDodger/>
  )
}

export default App
