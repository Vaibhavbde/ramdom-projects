import { useState } from "react";

function App() {
  return (
    <div className="App">
      <Counter />
    </div>
  );
}

function Counter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  const date = new Date("November 16 2025");
  date.setDate(date.getDate() + count);
  function nextStep() {
    setStep((s) => s + 1);
  }

  function prevStep() {
    setStep((s) => s - 1);
  }

  function nextCount() {
    setCount((c) => c + step);
  }

  function prevCount() {
    setCount((c) => c - step);
  }

  return (
    <>
      <div>
        <button onClick={prevStep}>-</button>
        <span>Step: {step}</span>
        <button onClick={nextStep}>+</button>
      </div>
      <div>
        <button onClick={prevCount}>-</button>
        <span>Count: {count}</span>
        <button onClick={nextCount}>+</button>
      </div>
      <p>
        <span>
          {count === 0
            ? `Today is `
            : count > 0
            ? `${count} days from today is `
            : `${count} days ago from today was `}
        </span>
        <span>{date.toDateString()}</span>
      </p>
    </>
  );
}

export default App;
