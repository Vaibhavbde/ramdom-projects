import React, { useState } from 'react';
import { Power, Lightbulb, Wind, Lock, Camera, Thermometer, Settings } from 'lucide-react';
import './DeviceCard.css';

const DeviceCard = ({ device, onToggle, onUpdate }) => {
  const [showSettings, setShowSettings] = useState(false);

  const getIcon = () => {
    switch (device.type) {
      case 'light': return <Lightbulb size={24} />;
      case 'ac': return <Wind size={24} />;
      case 'lock': return <Lock size={24} />;
      case 'camera': return <Camera size={24} />;
      case 'thermostat': return <Thermometer size={24} />;
      default: return <Power size={24} />;
    }
  };

  return (
    <div className={`device-card ${device.status ? 'active' : ''}`}>
      <div className="device-header">
        <div className="device-icon">{getIcon()}</div>
        <button
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={18} />
        </button>
      </div>

      <div className="device-info">
        <h3>{device.name}</h3>
        <p className="device-room">{device.room}</p>
        <p className="device-status">{device.status ? 'ON' : 'OFF'}</p>
      </div>

      <button
        className={`toggle-btn ${device.status ? 'on' : 'off'}`}
        onClick={() => onToggle(device.id)}
      >
        <Power size={20} /> {device.status ? 'Turn OFF' : 'Turn ON'}
      </button>

      {showSettings && (
        <div className="device-settings">
          {device.type === 'light' && (
            <div className="setting-item">
              <label>Brightness: {device.brightness}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={device.brightness}
                onChange={(e) => onUpdate(device.id, { brightness: parseInt(e.target.value) })}
              />
            </div>
          )}
          {(device.type === 'ac' || device.type === 'thermostat') && (
            <div className="setting-item">
              <label>Temperature: {device.temperature}°C</label>
              <input
                type="range"
                min="16"
                max="30"
                value={device.temperature}
                onChange={(e) => onUpdate(device.id, { temperature: parseInt(e.target.value) })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceCard;