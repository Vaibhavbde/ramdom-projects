import React, { useState } from 'react';

function GoalSetting({ goals, updateGoal, resetData }) {
  const [goalInputs, setGoalInputs] = useState({
    steps: goals.steps || '',
    calories: goals.calories || '',
    sleep: goals.sleep || '',
    water: goals.water || '',
    weight: goals.weight || ''
  });

  const handleInputChange = (metric, value) => {
    setGoalInputs(prev => ({ ...prev, [metric]: value }));
  };

  const handleSubmit = (metric) => {
    const value = parseFloat(goalInputs[metric]);
    if (!isNaN(value) && value > 0) {
      updateGoal(metric, value);
      // Show success feedback
      const button = document.querySelector(`[data-goal="${metric}"]`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✅ Goal Set!';
        button.style.background = '#4CAF50';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
        }, 1500);
      }
    }
  };

  const recommendedGoals = {
    steps: {
      beginner: 5000,
      intermediate: 8000,
      advanced: 12000
    },
    calories: {
      low: 1800,
      moderate: 2200,
      high: 2800
    },
    sleep: {
      minimum: 7,
      optimal: 8,
      maximum: 9
    },
    water: {
      minimum: 6,
      recommended: 8,
      active: 10
    }
  };

  const metrics = [
    { 
      key: 'steps', 
      label: 'Daily Steps Goal', 
      emoji: '🎯', 
      unit: 'steps',
      description: 'Set your daily step target',
      recommendations: recommendedGoals.steps
    },
    { 
      key: 'calories', 
      label: 'Daily Calorie Goal', 
      emoji: '🍎', 
      unit: 'calories',
      description: 'Target daily calorie intake',
      recommendations: recommendedGoals.calories
    },
    { 
      key: 'sleep', 
      label: 'Sleep Hours Goal', 
      emoji: '😴', 
      unit: 'hours',
      description: 'Target hours of sleep per night',
      recommendations: recommendedGoals.sleep
    },
    { 
      key: 'water', 
      label: 'Daily Water Goal', 
      emoji: '💧', 
      unit: 'glasses',
      description: 'Daily water intake target',
      recommendations: recommendedGoals.water
    },
    { 
      key: 'weight', 
      label: 'Target Weight', 
      emoji: '⚖️', 
      unit: 'kg',
      description: 'Your weight goal',
      recommendations: null
    }
  ];

  return (
    <div className="goal-setting">
      <div className="card">
        <h2>🎯 Set Your Health Goals</h2>
        <p>Define realistic targets to help you stay motivated and track your progress effectively.</p>
      </div>

      {metrics.map(metric => (
        <div key={metric.key} className="card">
          <h3>{metric.emoji} {metric.label}</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {metric.description}
          </p>

          <div className="input-group">
            <label htmlFor={`goal-${metric.key}`}>
              Target {metric.label.toLowerCase().replace('goal', '').trim()} ({metric.unit})
            </label>
            <input
              id={`goal-${metric.key}`}
              type="number"
              step={metric.key === 'sleep' ? '0.1' : '1'}
              min="0"
              placeholder={`Enter your ${metric.label.toLowerCase()}`}
              value={goalInputs[metric.key]}
              onChange={(e) => handleInputChange(metric.key, e.target.value)}
            />
          </div>

          {metric.recommendations && (
            <div className="goal-section">
              <h4>💡 Recommended Goals:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {Object.entries(metric.recommendations).map(([level, value]) => (
                  <button
                    key={level}
                    className="button secondary"
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '14px',
                      background: goals[metric.key] === value ? '#4CAF50' : '#2196F3'
                    }}
                    onClick={() => {
                      setGoalInputs(prev => ({ ...prev, [metric.key]: value }));
                      updateGoal(metric.key, value);
                    }}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}: {value} {metric.unit}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ margin: '20px 0' }}>
            <button
              className="button"
              data-goal={metric.key}
              onClick={() => handleSubmit(metric.key)}
              disabled={!goalInputs[metric.key]}
              style={{ 
                opacity: goalInputs[metric.key] ? 1 : 0.6,
                cursor: goalInputs[metric.key] ? 'pointer' : 'not-allowed'
              }}
            >
              Set {metric.label}
            </button>
          </div>

          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f0f8f0', 
            borderRadius: '8px',
            fontSize: '14px',
            color: '#2e7d2e'
          }}>
            <strong>Current Goal:</strong> {goals[metric.key]} {metric.unit}
          </div>
        </div>
      ))}

      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h3>🌟 Goal Setting Tips</h3>
        <div style={{ textAlign: 'left' }}>
          <p><strong>🎯 SMART Goals:</strong> Make your goals Specific, Measurable, Achievable, Relevant, and Time-bound.</p>
          
          <p><strong>📈 Progressive Approach:</strong> Start with smaller, achievable goals and gradually increase them as you build habits.</p>
          
          <p><strong>🔄 Regular Review:</strong> Review and adjust your goals weekly based on your progress and lifestyle changes.</p>
          
          <p><strong>🎉 Celebrate Success:</strong> Acknowledge when you achieve your goals, no matter how small!</p>
        </div>
      </div>

      <div className="card">
        <h3>📊 Your Current Goals Summary</h3>
        <div className="grid">
          {metrics.map(metric => (
            <div key={metric.key} style={{ 
              padding: '15px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                {metric.emoji}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {metric.label.replace('Goal', '').replace('Target', '').trim()}
              </div>
              <div style={{ fontSize: '1.2rem', color: '#4CAF50', fontWeight: 'bold' }}>
                {goals[metric.key]} {metric.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <h3>⚠️ Reset App Data</h3>
        <p style={{ color: '#666' }}>This will clear all saved metrics and goals from your browser's local storage. This action cannot be undone.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
          <button
            className="button secondary"
            onClick={() => {
              // Ask for a simple confirmation before calling reset
              const confirmed = window.confirm('Are you sure you want to reset all health data and goals?\n\nThis will clear all your saved metrics, goals, and history. This action cannot be undone.');
              if (confirmed && resetData) {
                resetData(true);
                // Provide light feedback
                alert('✅ App data has been reset successfully!');
              }
            }}
          >
            🗑️ Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalSetting;