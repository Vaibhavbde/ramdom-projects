import React, { useState, useRef, useEffect } from 'react';
import { diagnoseImage } from '../services/geminiService';
import Icon from './shared/Icon';

const Disclaimer: React.FC = () => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6 rounded-md" role="alert">
    <p className="font-bold">Disclaimer</p>
    <p>This AI-powered analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
  </div>
);

const contextOptions = ['skin condition', 'eye redness', 'wound', 'mole', 'throat inflammation', 'other'];

const ImageDiagnosis: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [context, setContext] = useState('skin condition');
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setDiagnosis(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    setLoading(true);
    setError(null);
    setDiagnosis(null);
    try {
      const result = await diagnoseImage(imageFile, context);
      setDiagnosis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">AI-Powered Image Diagnosis</h1>
      <p className="text-gray-600 mb-6">Upload an image of a skin rash, eye redness, wound, etc., for an AI analysis.</p>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 transition"
        >
          <Icon name="upload" className="w-8 h-8 mr-3" />
          <span className="font-medium">{imageFile ? imageFile.name : 'Click to upload an image'}</span>
        </button>

        {imagePreview && (
          <div className="mt-4">
            <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">Image Context</label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="block truncate capitalize">{context}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            {isDropdownOpen && (
              <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {contextOptions.map((option) => (
                  <li
                    key={option}
                    className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-50"
                    onClick={() => {
                      setContext(option);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className="block truncate capitalize">{option}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !imageFile}
          className="mt-4 w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Icon name="diagnose" className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Diagnosing...' : 'Diagnose Image'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {diagnosis && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Diagnosis Result</h2>
          <div className="prose max-w-none text-gray-700">
            {diagnosis.split('\n').map((line, i) => <p key={i}>{line}</p>)}
          </div>
          <Disclaimer />
        </div>
      )}
    </div>
  );
};

export default ImageDiagnosis;