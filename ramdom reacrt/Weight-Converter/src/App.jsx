// src/App.jsx (optional tweak)
import WeightConverter from './components/WeightConverter';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="flex items-center justify-center min-h-screen">
        <WeightConverter />
      </div>
    </div>
  );
}

export default App;
