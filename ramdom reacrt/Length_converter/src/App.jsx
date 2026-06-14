import { useState } from 'react'
import './App.css'

function App() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [answer, setAnswer] = useState('')
  const [length, setLength] = useState('')
  const [error, setError] = useState('')

  const handleChangeFrom = (e) => {
    setFrom(e.target.value);
  }

  const handleChangeTo = (e) => {
    setTo(e.target.value);
  }

  const calculateAnswer = (length, from, to) => {
    const units = {
      "meters": 1,
      "kilometers": 1000,
      "centimeters": 0.01,
      "millimeters": 0.001,
      "inches": 0.0254,
      "feet": 0.3048,
      "yards": 0.9144,
      "miles": 1609.34
    };

    if (from === '' || to === '') {
      setError("Please select both units");
      return;
    } else if (length === '' || isNaN(length)) {
      setError("Please enter a valid number");
    } else {
      setError("");
    }

    if (!units[from] || !units[to]) {
      setAnswer("Invalid unit");
    }
    const meters = length * units[from];
    const result = (meters / units[to]).toFixed(3);
    setAnswer(result + " " + to);
    return result;
  }

  return (
    <div className="container">
      <h1 className="title">Length Converter</h1>
      <h4>Convert length</h4>
      <input type="text" value={length} onChange={(e) => setLength(e.target.value)} />
      {error && <p className="error">{error}</p>}
      <div className="dropdowns">
        <label>
          <select value={from} onChange={handleChangeFrom}>
            <option value="">Select from</option>
            <option value="meters">Meters</option>
            <option value="kilometers">Kilometers</option>
            <option value="centimeters">Centimeters</option>
            <option value="millimeters">Millimeters</option>
            <option value="inches">Inches</option>
            <option value="feet">Feet</option>
            <option value="yards">Yards</option>
            <option value="miles">Miles</option>
          </select>
        </label>
        <label>
          <select value={to} onChange={handleChangeTo}>
            <option value="">Select to</option>
            <option value="meters">Meters</option>
            <option value="kilometers">Kilometers</option>
            <option value="centimeters">Centimeters</option>
            <option value="millimeters">Millimeters</option>
            <option value="inches">Inches</option>
            <option value="feet">Feet</option>
            <option value="yards">Yards</option>
            <option value="miles">Miles</option>
          </select>
        </label>
      </div>
      <h1 className="answer">{answer}</h1>
      <button className='convert' onClick={() => calculateAnswer(length, from, to)}>convert</button >
    </div>
  )
}

export default App
