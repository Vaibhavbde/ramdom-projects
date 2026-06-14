import React, { useState, useEffect } from 'react';
import './App.css';
import DeviceCard from './components/DeviceCard';
import SchedulePanel from './components/SchedulePanel';
import NotificationPanel from './components/NotificationPanel';
import { Home, Bell, Calendar, Settings } from 'lucide-react';

function App() {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Living Room Light', type: 'light', status: false, room: 'Living Room', brightness: 75 },
    { id: 2, name: 'Bedroom AC', type: 'ac', status: false, room: 'Bedroom', temperature: 22 },
    { id: 3, name: 'Front Door Lock', type: 'lock', status: true, room: 'Entrance' },
    { id: 4, name: 'Kitchen Light', type: 'light', status: true, room: 'Kitchen', brightness: 100 },
    { id: 5, name: 'Security Camera', type: 'camera', status: true, room: 'Front Yard' },
    { id: 6, name: 'Thermostat', type: 'thermostat', status: true, room: 'Living Room', temperature: 24 },
  ]);

  const [schedules, setSchedules] = useState([
    { id: 1, deviceId: 1, time: '18:00', action: 'Turn On', active: true },
    { id: 2, deviceId: 2, time: '22:00', action: 'Turn Off', active: true },
  ]);

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('devices');

  const toggleDevice = (id) => {
    setDevices(devices.map(device => {
      if (device.id === id) {
        const newStatus = !device.status;
        addNotification(`${device.name} turned ${newStatus ? 'ON' : 'OFF'}`);
        return { ...device, status: newStatus };
      }
      return device;
    }));
  };

  const updateDeviceSettings = (id, settings) => {
    setDevices(devices.map(device =>
      device.id === id ? { ...device, ...settings } : device
    ));
    addNotification(`${devices.find(d => d.id === id).name} settings updated`);
  };

  const addSchedule = (schedule) => {
    setSchedules([...schedules, { ...schedule, id: Date.now(), active: true }]);
    addNotification('New schedule created');
  };

  const toggleSchedule = (id) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id ? { ...schedule, active: !schedule.active } : schedule
    ));
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    addNotification('Schedule deleted');
  };

  const addNotification = (message) => {
    const notification = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [notification, ...prev].slice(0, 10));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    addNotification('Welcome to your Smart Home Dashboard!');
  }, []);

  const activeDevices = devices.filter(d => d.status).length;
  const totalDevices = devices.length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1><Home size={32} /> Smart Home Control</h1>
          <div className="header-stats">
            <span>{activeDevices}/{totalDevices} Active</span>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'devices' ? 'active' : ''}
          onClick={() => setActiveTab('devices')}
        >
          <Home size={20} /> Devices
        </button>
        <button
          className={activeTab === 'schedules' ? 'active' : ''}
          onClick={() => setActiveTab('schedules')}
        >
          <Calendar size={20} /> Schedules
        </button>
        <button
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={20} /> Notifications ({notifications.length})
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'devices' && (
          <div className="devices-grid">
            {devices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={toggleDevice}
                onUpdate={updateDeviceSettings}
              />
            ))}
          </div>
        )}

        {activeTab === 'schedules' && (
          <SchedulePanel
            schedules={schedules}
            devices={devices}
            onAdd={addSchedule}
            onToggle={toggleSchedule}
            onDelete={deleteSchedule}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationPanel
            notifications={notifications}
            onClear={clearNotifications}
          />
        )}
      </main>
    </div>
  );
}

export default App;