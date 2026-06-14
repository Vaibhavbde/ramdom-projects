# 🗂️ Tab Manager Pro

A modern, feature-rich Chrome extension built with React and Tailwind CSS to help you organize, save, and manage browser tabs efficiently.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=for-the-badge&logo=googlechrome)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **📋 All Tabs View**: View all open tabs in a clean, organized list
- **🔍 Smart Search**: Quickly find tabs by title or URL
- **🗂️ Domain Grouping**: Automatically group tabs by website domain
- **💾 Session Management**: Save and restore browsing sessions
- **⚡ Quick Actions**: Close tabs with one click, switch tabs instantly
- **🎨 Beautiful UI**: Modern, responsive design with Tailwind CSS
- **🌙 Clean Interface**: Distraction-free, minimal design


### All Tabs View
View all your open tabs with search functionality and quick actions.

### Grouped View
See your tabs organized by domain with count badges.

### Session Manager
Save current browsing sessions and restore them later.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Chrome browser

### Installation

1. **Clone the repository**
```
git clone https://github.com/yourusername/tab-manager-pro.git
cd tab-manager-pro
```


2. **Install dependencies**
```
npm install
```


3. **Build the extension**

```
npm run build
```

This creates a `dist` folder with the production-ready extension files.

4. **Load the extension in Chrome**

- Open Chrome and navigate to `chrome://extensions/`
- Enable **Developer mode** (toggle in top-right corner)
- Click **Load unpacked**
- Select the `dist` folder from your project directory
- The extension icon should now appear in your Chrome toolbar

5. **Pin the extension** (optional)

- Click the puzzle piece icon in Chrome's toolbar
- Find "Tab Manager Pro"
- Click the pin icon to keep it visible

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Chrome Extensions API** - Browser integration

## 📝 Usage

### All Tabs View

- **Search**: Type in the search bar to filter tabs by title or URL
- **Switch Tab**: Click on any tab to switch to it
- **Close Tab**: Hover over a tab and click the X button to close it

### Grouped View

- Tabs are automatically organized by domain
- Each domain shows the number of tabs open
- Perform the same actions as All Tabs view

### Session Manager

1. **Save a Session**:
   - Click "Save Current Session"
   - Enter a name for your session
   - Click "Save"

2. **Restore a Session**:
   - Find your saved session in the list
   - Click the restore icon (circular arrow)
   - All tabs from that session will open

3. **Delete a Session**:
   - Click the trash icon next to any session
   - Session will be removed permanently

