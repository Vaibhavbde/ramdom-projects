import React, { useState, useRef } from 'react';
import { scanHealthRecord } from '../services/geminiService';
import { HealthRecordData } from '../types';
import Icon from './shared/Icon';

const RecordScanner: React.FC = () => {
  const [recordFile, setRecordFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [recordData, setRecordData] = useState<HealthRecordData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRecordFile(file);
      setRecordData(null);
      setError(null);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!recordFile) {
      setError('Please upload a file first.');
      return;
    }
    setLoading(true);
    setError(null);
    setRecordData(null);
    try {
      const result = await scanHealthRecord(recordFile);
      setRecordData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  const getInsightColor = (insight: string) => {
    switch (insight) {
      case 'Low': return 'text-blue-600 bg-blue-100';
      case 'High': return 'text-red-600 bg-red-100';
      case 'Normal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Record Scanner</h1>
      <p className="text-gray-600 mb-6">Upload a medical report (image/PDF) to extract key values with AI.</p>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500 transition"
        >
          <Icon name="upload" className="w-8 h-8 mr-3" />
          <span className="font-medium">{recordFile ? recordFile.name : 'Click to upload a report'}</span>
        </button>

        {filePreview && (
          <div className="mt-4">
            <img src={filePreview} alt="Record Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !recordFile}
          className="mt-4 w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
        >
          {loading ? (
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Icon name="scan" className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Scanning...' : 'Scan Record'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {recordData && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Extracted Health Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insight</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recordData.map((data, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.key}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getInsightColor(data.insight)}`}>
                        {data.insight}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordScanner;
