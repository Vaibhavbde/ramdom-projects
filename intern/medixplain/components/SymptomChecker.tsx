import React, { useState } from 'react';
import { analyzeSymptoms } from '../services/geminiService';
import { SymptomAnalysis } from '../types';
import Icon from './shared/Icon';

const Disclaimer: React.FC = () => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6 rounded-md" role="alert">
    <p className="font-bold">Disclaimer</p>
    <p>This AI-powered analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
  </div>
);

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please enter your symptoms.');
      return;
    }
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzeSymptoms(symptoms);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: 'Low' | 'Moderate' | 'High') => {
    switch (severity) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Symptom Checker</h1>
      <p className="text-gray-600 mb-6">Describe your symptoms, and our AI will provide a preliminary analysis.</p>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., 'I have a high fever, a persistent cough, and a sore throat...'"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          rows={5}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Icon name="symptoms" className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      
      {analysis && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
          
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Severity Level</h3>
            <span className={`px-4 py-1 rounded-full font-bold text-sm ${getSeverityColor(analysis.severity)}`}>
              {analysis.severity} Risk
            </span>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Possible Conditions</h3>
            <ul className="space-y-3">
              {analysis.possibleConditions.map((condition, index) => (
                <li key={index} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-bold text-blue-700">{condition.name}</p>
                  <p className="text-gray-600 text-sm">{condition.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Recommended Next Steps</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {analysis.recommendedNextSteps.map((step, index) => <li key={index}>{step}</li>)}
            </ul>
          </div>
          <Disclaimer />
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
