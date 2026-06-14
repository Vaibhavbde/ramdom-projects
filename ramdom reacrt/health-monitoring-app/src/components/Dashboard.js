import React from 'react';

function Dashboard({ healthData, goals }) {
  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (healthData.steps >= goals.steps) {
      achievements.push('🚶 Steps Goal Reached!');
    }
    if (healthData.water >= goals.water) {
      achievements.push('💧 Hydration Goal Met!');
    }
    if (healthData.sleep >= goals.sleep) {
      achievements.push('😴 Good Sleep Achieved!');
    }
    if (healthData.calories >= goals.calories * 0.8 && healthData.calories <= goals.calories * 1.2) {
      achievements.push('🍎 Balanced Nutrition!');
    }
    
    return achievements;
  };

  const metrics = [
    { 
      key: 'steps', 
      label: 'Steps', 
      value: healthData.steps, 
      goal: goals.steps, 
      unit: 'steps',
      emoji: '🚶‍♂️'
    },
    { 
      key: 'calories', 
      label: 'Calories', 
      value: healthData.calories, 
      goal: goals.calories, 
      unit: 'cal',
      emoji: '🔥'
    },
    { 
      key: 'sleep', 
      label: 'Sleep', 
      value: healthData.sleep, 
      goal: goals.sleep, 
      unit: 'hrs',
      emoji: '😴'
    },
    { 
      key: 'water', 
      label: 'Water', 
      value: healthData.water, 
      goal: goals.water, 
      unit: 'glasses',
      emoji: '💧'
    },
    { 
      key: 'weight', 
      label: 'Weight', 
      value: healthData.weight, 
      goal: goals.weight, 
      unit: 'kg',
      emoji: '⚖️'
    }
  ];

  const achievements = getAchievements();

  return (
    <div className="dashboard">
      <div className="metric-cards">
        {metrics.map(metric => (
          <div key={metric.key} className={`metric-card ${metric.key}`}>
            <div className="metric-label">
              {metric.emoji} {metric.label}
            </div>
            <div className="metric-value">
              {metric.value} <span style={{ fontSize: '1rem' }}>{metric.unit}</span>
            </div>
            <div className="metric-goal">
              Goal: {metric.goal} {metric.unit}
            </div>
          </div>
        ))}
      </div>

      <div className="card progress-section">
        <h2>📈 Today's Progress</h2>
        {metrics.slice(0, 4).map(metric => {
          const progress = calculateProgress(metric.value, metric.goal);
          return (
            <div key={metric.key} className="progress-item">
              <div className="progress-header">
                <span className="progress-label">
                  {metric.emoji} {metric.label}
                </span>
                <span className="progress-percentage">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                {metric.value} / {metric.goal} {metric.unit}
              </div>
            </div>
          );
        })}
      </div>

      {achievements.length > 0 && (
        <div className="card achievements">
          <h2>🏆 Today's Achievements</h2>
          <div>
            {achievements.map((achievement, index) => (
              <span key={index} className="achievement-badge">
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2>📊 Weekly Summary</h2>
        {healthData.history.length > 0 ? (
          <div>
            <div className="stat-item">
              <span className="stat-label">Average Steps</span>
              <span className="stat-value">
                {Math.round(healthData.history.reduce((sum, day) => sum + day.steps, 0) / healthData.history.length)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Sleep</span>
              <span className="stat-value">
                {(healthData.history.reduce((sum, day) => sum + day.sleep, 0) / healthData.history.length).toFixed(1)} hrs
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Days Tracked</span>
              <span className="stat-value">{healthData.history.length}</span>
            </div>
          </div>
        ) : (
          <div className="no-data">
            <div className="emoji">📈</div>
            <p>Start tracking your metrics to see weekly summaries!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;