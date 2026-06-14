# 🎵 Musical DNA Matcher

A modern React application that connects people through their music taste. Match with others based on shared musical preferences, discover new songs, and chat with your musical soulmates.

## ✨ Features

### 🎯 Swipe & Match
- **Smart Matching Algorithm**: Swipe through potential matches based on musical compatibility
- **Compatibility Scores**: See how well your music taste aligns with others
- **Real-time Match Notifications**: Get instant updates when someone likes you back

### 🎶 Music Discovery
- **Musical DNA Radio**: Personalized radio stations based on your unique musical profile
- **Smart Recommendations**: Discover new songs tailored to your taste
- **Genre Exploration**: Dive deep into different music genres

### 💬 Chat & Connect
- **Real-time Messaging**: Chat with your matches instantly
- **Song Sharing**: Share your favorite tracks directly in conversations
- **Typing Indicators**: Know when your match is responding

### 👤 Profile & Analytics
- **Musical DNA Card**: Visual representation of your music personality
- **Genre Distribution**: Interactive charts showing your music preferences
- **Personality Traits**: Discover what your music taste says about you

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mishhkaaa/musical-dna-matcher.git
cd musical-dna-matcher/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📦 Tech Stack

### Core
- **React 19** - UI library
- **React Router v7** - Client-side routing
- **Context API** - State management

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Data Visualization
- **Recharts** - Chart library for analytics

### Audio & Media
- **Howler.js** - Audio playback
- **React Player** - Media player component

### Additional Libraries
- **React Hot Toast** - Toast notifications
- **React Intersection Observer** - Viewport detection
- **@use-gesture/react** - Gesture handling for swipe interactions

## 📁 Project Structure

```
client/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   │   ├── chat/         # Chat interface components
│   │   ├── discovery/    # Music discovery components
│   │   ├── layout/       # Layout components
│   │   ├── matching/     # Matching & swiping components
│   │   ├── profile/      # Profile view components
│   │   └── shared/       # Shared/reusable components
│   ├── context/          # React Context providers
│   ├── data/             # Mock data for development
│   ├── pages/            # Page-level components
│   ├── styles/           # Global styles and animations
│   ├── App.js            # Main app component
│   └── index.js          # Entry point
├── package.json
└── tailwind.config.js
```

## 🛠️ Available Scripts

### `npm start`
Runs the app in development mode. The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `build` folder. The build is minified and optimized for best performance.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run lint`
Runs ESLint to check code quality.

## 🎨 Key Components

### Matching System
- `SwipeInterface.js` - Tinder-like swipe interface
- `MatchCard.js` - Individual match profile cards
- `CompatibilityScore.js` - Musical compatibility visualization

### Discovery Engine
- `MusicalDNARadio.js` - Personalized radio player
- `RecommendedSongs.js` - Song recommendation feed
- `DiscoveryDashboard.js` - Main discovery interface

### Chat System
- `ChatInterface.js` - Main chat container
- `MessageBubble.js` - Individual message display
- `SongShareBubble.js` - Special bubble for shared songs

### Profile Components
- `MusicalDNACard.js` - Visual DNA representation
- `GenreChart.js` - Genre distribution chart
- `PersonalityTraits.js` - Music personality insights

## 🎯 Future Enhancements

- [ ] Backend integration with real user authentication
- [ ] Spotify/Apple Music API integration
- [ ] Machine learning for better music matching
- [ ] Video chat functionality
- [ ] Group chat rooms based on music genres
- [ ] Event discovery and meetups

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Mishka**
- GitHub: [@mishhkaaa](https://github.com/mishhkaaa)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/mishhkaaa/musical-dna-matcher/issues).

---

Made with ❤️ and 🎵 by Mishka
