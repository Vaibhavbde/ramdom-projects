import React from 'react';
import { Bell, Trash2 } from 'lucide-react';
import './NotificationPanel.css';

const NotificationPanel = ({ notifications, onClear }) => {
  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h2><Bell size={24} /> Notifications</h2>
        {notifications.length > 0 && (
          <button className="clear-btn" onClick={onClear}>
            <Trash2 size={18} /> Clear All
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p className="empty-message">No notifications yet.</p>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="notification-item">
              <div className="notification-icon">
                <Bell size={20} />
              </div>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <p className="notification-time">{notification.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;