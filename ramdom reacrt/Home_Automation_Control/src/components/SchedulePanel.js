import React, { useState } from 'react';
import { Clock, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import './SchedulePanel.css';

const SchedulePanel = ({ schedules, devices, onAdd, onToggle, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    deviceId: '',
    time: '',
    action: 'Turn On'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newSchedule.deviceId && newSchedule.time) {
      onAdd(newSchedule);
      setNewSchedule({ deviceId: '', time: '', action: 'Turn On' });
      setShowForm(false);
    }
  };

  return (
    <div className="schedule-panel">
      <div className="panel-header">
        <h2><Clock size={24} /> Device Schedules</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> Add Schedule
        </button>
      </div>

      {showForm && (
        <form className="schedule-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Device</label>
            <select
              value={newSchedule.deviceId}
              onChange={(e) => setNewSchedule({ ...newSchedule, deviceId: e.target.value })}
              required
            >
              <option value="">Select Device</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>{device.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={newSchedule.time}
              onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Action</label>
            <select
              value={newSchedule.action}
              onChange={(e) => setNewSchedule({ ...newSchedule, action: e.target.value })}
            >
              <option value="Turn On">Turn On</option>
              <option value="Turn Off">Turn Off</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Create Schedule</button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="schedules-list">
        {schedules.length === 0 ? (
          <p className="empty-message">No schedules yet. Create your first schedule!</p>
        ) : (
          schedules.map(schedule => {
            const device = devices.find(d => d.id === parseInt(schedule.deviceId));
            return (
              <div key={schedule.id} className={`schedule-item ${schedule.active ? 'active' : 'inactive'}`}>
                <div className="schedule-info">
                  <h4>{device?.name || 'Unknown Device'}</h4>
                  <p className="schedule-time">⏰ {schedule.time}</p>
                  <p className="schedule-action">{schedule.action}</p>
                </div>
                <div className="schedule-actions">
                  <button
                    className="toggle-schedule-btn"
                    onClick={() => onToggle(schedule.id)}
                    title={schedule.active ? 'Deactivate' : 'Activate'}
                  >
                    {schedule.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                  <button
                    className="delete-schedule-btn"
                    onClick={() => onDelete(schedule.id)}
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SchedulePanel;