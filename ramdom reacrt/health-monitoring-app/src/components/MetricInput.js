import React, { useState } from 'react';

function MetricInput({ healthData, updateMetric }) {
  const [inputValues, setInputValues] = useState({
    steps: healthData.steps || '',
    calories: healthData.calories || '',
    sleep: healthData.sleep || '',
    water: healthData.water || '',
    weight: healthData.weight || ''
  });

  const handleInputChange = (metric, value) => {
    setInputValues(prev => ({ ...prev, [metric]: value }));
  };

  const handleSubmit = (metric) => {
    const value = parseFloat(inputValues[metric]);
    if (!isNaN(value) && value >= 0) {
      updateMetric(metric, value);
      // Show a brief success message
      const button = document.querySelector(`[data-metric="${metric}"]`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Updated!';
        button.style.background = '#4CAF50';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
        }, 1500);
      }
    }
  };

  const quickActions = {
    steps: [1000, 2500, 5000, 7500, 10000],
    water: [1, 2, 4, 6, 8],
    calories: [500, 1000, 1500, 2000, 2500],
    sleep: [6, 7, 8, 9, 10]
  };

  const metrics = [
    { 
      key: 'steps', 
      label: 'Steps', 
      emoji: '🚶‍♂️', 
      placeholder: 'Enter steps taken today',
      unit: 'steps'
    },
    { 
      key: 'calories', 
      label: 'Calories Consumed', 
      emoji: '🍎', 
      placeholder: 'Enter calories consumed',
      unit: 'calories'
    },
    { 
      key: 'sleep', 
      label: 'Sleep Hours', 
      emoji: '😴', 
      placeholder: 'Enter hours of sleep',
      unit: 'hours'
    },
    { 
      key: 'water', 
      label: 'Water Intake', 
      emoji: '💧', 
      placeholder: 'Enter glasses of water',
      unit: 'glasses'
    },
    { 
      key: 'weight', 
      label: 'Weight', 
      emoji: '⚖️', 
      placeholder: 'Enter your current weight',
      unit: 'kg'
    }
  ];

  return (
    <div className="metric-input">
      <div className="card">
        <h2>📝 Update Your Health Metrics</h2>
        <p>Track your daily health data to monitor your progress</p>
      </div>

      {metrics.map(metric => (
        <div key={metric.key} className="card">
          <h3>{metric.emoji} {metric.label}</h3>
          
          <div className="input-group">
            <label htmlFor={metric.key}>
              Current {metric.label.toLowerCase()} ({metric.unit})
            </label>
            <input
              id={metric.key}
              type="number"
              step={metric.key === 'sleep' ? '0.1' : '1'}
              min="0"
              placeholder={metric.placeholder}
              value={inputValues[metric.key]}
              onChange={(e) => handleInputChange(metric.key, e.target.value)}
            />
          </div>

          {quickActions[metric.key] && (
            <div style={{ margin: '15px 0' }}>
              <p style={{ margin: '10px 0', fontWeight: '500', color: '#666' }}>
                Quick actions:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {quickActions[metric.key].map(value => (
                  <button
                    key={value}
                    className="button secondary"
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                    onClick={() => {
                      setInputValues(prev => ({ ...prev, [metric.key]: value }));
                      updateMetric(metric.key, value);
                    }}
                  >
                    {value} {metric.unit}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className="button"
            data-metric={metric.key}
            onClick={() => handleSubmit(metric.key)}
            disabled={!inputValues[metric.key]}
            style={{ 
              opacity: inputValues[metric.key] ? 1 : 0.6,
              cursor: inputValues[metric.key] ? 'pointer' : 'not-allowed'
            }}
          >
            Update {metric.label}
          </button>

          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            <strong>Current:</strong> {healthData[metric.key]} {metric.unit}
          </div>
        </div>
      ))}

      <div className="card tips-card" style={{ textAlign: 'center' }}>
        <h3>💡 Tips for Better Health Tracking</h3>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>🕐 Update your metrics at the same time each day for consistency</li>
          <li>📱 Consider using a fitness tracker or smartphone apps for automatic tracking</li>
          <li>💧 Keep a water bottle nearby to track hydration easily</li>
          <li>😴 Maintain regular sleep schedule for better rest tracking</li>
          <li>🎯 Set realistic goals and gradually increase them over time</li>
        </ul>
      </div>
    </div>
  );
}

export default MetricInput;