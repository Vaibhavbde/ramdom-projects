const { useState } = React;

function App() {
  const quotes = [
    "The best way to get started is to quit talking and begin doing.",
    "Don’t let yesterday take up too much of today.",
    "It’s not whether you get knocked down, it’s whether you get up.",
    "If you are working on something exciting, it will keep you motivated.",
    "Success is not in what you have, but who you are."
  ];
  const [quote, setQuote] = useState(quotes[0]);

  function newQuote() {
    const random = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[random]);
  }

  return (
    <div className="container">
      <h1>Random Quote Generator</h1>
      <p className="quote">"{quote}"</p>
      <button onClick={newQuote}>New Quote</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
