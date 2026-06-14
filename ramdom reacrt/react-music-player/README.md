# 🎵 React Music Player

A beautiful and functional music player built with React, featuring playlist management, multiple playback modes, and a clean user interface.

## ✨ Features

- 🎧 **Audio Playback** - Play, pause, skip tracks with smooth controls
- 📝 **Playlist Management** - View and manage your music collection
- 🔁 **Playback Modes** - Cycle, once, and random repeat options
- 🔊 **Volume Control** - Adjustable volume with visual feedback
- ⏱️ **Progress Tracking** - Real-time progress bar with time remaining
- 🎨 **Responsive Design** - Clean and intuitive user interface
- 🎵 **Track Information** - Display song title, artist, and album art

## 🚀 Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/xiaolin3303/react-music-player.git
cd react-music-player
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This will create an optimized production build in the `dist/` directory.

## 🛠️ Built With

- **React** - UI library
- **React Router** - Navigation and routing
- **Webpack** - Module bundler
- **jPlayer** - Audio playback engine
- **PubSub-js** - Event communication
- **Less** - CSS preprocessor

## 📂 Project Structure

```
react-music-player/
├── app/
│   ├── final/           # Main application code
│   │   ├── components/  # Reusable components
│   │   ├── config/      # Configuration files
│   │   ├── page/        # Page components
│   │   ├── utils/       # Utility functions
│   │   └── index.js     # Entry point
│   ├── helloworld/      # Tutorial examples
│   ├── playmusic/       # Music playback examples
│   └── router/          # Router examples
├── static/              # Static assets
├── webpack.config.js    # Development config
└── webpack.production.config.js  # Production config
```

## 🎮 Usage

### Adding Songs

Edit the music list in `app/final/config/config.js`:

```javascript
export const MUSIC_LIST = [
  {
    id: 1,
    title: "Song Title",
    artist: "Artist Name",
    file: "path/to/audio.mp3",
    cover: "path/to/cover.jpg",
  },
  // Add more songs...
];
```

### Playback Controls

- **Play/Pause**: Click the play/pause button
- **Next/Previous**: Navigate through tracks
- **Repeat Mode**: Click the repeat icon to cycle through modes
- **Volume**: Adjust using the volume slider
- **Progress**: Click on the progress bar to jump to any position

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get started.

### Areas for Improvement

- Migrate from React.createClass to modern functional components
- Upgrade dependencies to latest versions
- Add testing infrastructure
- Improve accessibility
- Add TypeScript support
- Replace jQuery with native solutions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original author: [xiaolin3303](https://github.com/xiaolin3303)
- Built as a learning project for React beginners
- Uses jPlayer for audio playback functionality

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Note**: This project uses older React patterns and dependencies as a learning resource. Consider modernizing the codebase for production use.
