# 🏠 Home Automation Control

A modern React-based smart home control dashboard that allows you to manage and monitor smart home devices, create schedules, and receive notifications.

## 📋 Description

Home Automation Control is a web application built with React that simulates a smart home control system. Users can control various smart devices, set up automated schedules, and monitor their home through an intuitive dashboard interface.

## ✨ Features

### 🎛️ Device Management
- **Multiple Device Types**: Control lights, AC units, thermostats, locks, and cameras
- **Real-time Control**: Toggle devices on/off with instant feedback
- **Device Settings**: Adjust brightness for lights and temperature for AC/thermostats
- **Status Indicators**: Visual feedback showing active/inactive devices
- **Room Organization**: Devices grouped by room location

### 📅 Scheduling System
- **Create Schedules**: Set up automated actions for devices
- **Time-based Actions**: Schedule devices to turn on/off at specific times
- **Active/Inactive Toggle**: Enable or disable schedules without deletion
- **Easy Management**: Delete unwanted schedules with one click

### 🔔 Notification System
- **Real-time Notifications**: Get updates on device status changes
- **Activity Log**: View last 10 notifications
- **Timestamps**: Each notification includes time of occurrence
- **Clear History**: Remove all notifications at once

### 🎨 Modern UI
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Tab Navigation**: Switch between Devices, Schedules, and Notifications
- **Visual Feedback**: Color-coded states and smooth animations
- **Gradient Theme**: Beautiful purple gradient background

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/React-projects-for-beginners.git
cd React-projects-for-beginners/Home_Automation_Control
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Dependencies

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **lucide-react**: ^0.263.1 (for icons)

## 🎯 How to Use

### Managing Devices
1. Navigate to the **Devices** tab
2. Click on any device card to view it
3. Use the **Power button** to toggle the device on/off
4. Click the **Settings icon** to adjust device-specific settings:
   - **Lights**: Adjust brightness (0-100%)
   - **AC/Thermostat**: Set temperature (16-30°C)

### Creating Schedules
1. Go to the **Schedules** tab
2. Click **Add Schedule** button
3. Select a device from the dropdown
4. Set the time for the action
5. Choose the action (Turn On/Turn Off)
6. Click **Create Schedule**

### Managing Schedules
- Toggle schedules on/off using the switch icon
- Delete schedules using the trash icon
- Active schedules have a blue indicator

### Viewing Notifications
1. Navigate to the **Notifications** tab
2. View all recent activity
3. Click **Clear All** to remove notifications

## 📱 Device Types

| Device | Icon | Controllable Settings |
|--------|------|----------------------|
| Light | 💡 | On/Off, Brightness |
| AC | 🌬️ | On/Off, Temperature |
| Thermostat | 🌡️ | On/Off, Temperature |
| Lock | 🔒 | Lock/Unlock |
| Camera | 📷 | On/Off |

## 🎨 Screenshots

### Devices Tab
- Grid layout showing all smart devices
- Status indicators (Active/Inactive)
- Quick toggle controls
- Settings panel for each device

### Schedules Tab
- List of all scheduled actions
- Add new schedule form
- Enable/disable toggle
- Delete functionality

### Notifications Tab
- Chronological list of activities
- Timestamp for each notification
- Clear all option

## 🛠️ Project Structure

```
Home_Automation_Control/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DeviceCard.js
│   │   ├── DeviceCard.css
│   │   ├── SchedulePanel.js
│   │   ├── SchedulePanel.css
│   │   ├── NotificationPanel.js
│   │   └── NotificationPanel.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 💡 Learning Outcomes

This project helps beginners learn:
- **React State Management**: Using useState hook
- **Component Communication**: Props and callbacks
- **Conditional Rendering**: Showing/hiding UI elements
- **Event Handling**: Button clicks and form submissions
- **Array Methods**: map, filter, find
- **CSS Styling**: Responsive design and animations
- **Component Structure**: Breaking UI into reusable components

## 🔧 Customization

### Adding New Devices
Edit the `devices` state in `App.js`:
```javascript
{ 
  id: 7, 
  name: 'New Device', 
  type: 'light', 
  status: false, 
  room: 'Room Name' 
}
```

### Changing Colors
Modify CSS variables or colors in component CSS files.

## 📝 Future Enhancements

- Voice control integration
- Energy usage tracking
- Multi-user support
- Weather-based automation
- Device grouping
- Scene creation
- Historical data graphs

## 👨‍💻 Author

**Ashvin**
- GitHub: [@ashvin2005](https://github.com/ashvin2005)
- LinkedIn: [ashvin-tiwari](https://linkedin.com/in/ashvin-tiwari)

## 🎃 Hacktoberfest 2025

Created as part of Hacktoberfest 2025 contributions!

## 📄 License

MIT License

## 🙏 Acknowledgments

- Icons from Lucide React
- React team for the amazing framework
- Hacktoberfest for promoting open source

---

**Made with ❤️ for React beginners**