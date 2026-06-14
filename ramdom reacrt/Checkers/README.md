# Timezone Converter

A beautiful and minimalistic timezone converter built with ReactJS and vanilla CSS. Convert time between different timezones around the world with an elegant, user-friendly interface.

## Features

- 🕐 **Date & Time Selection**: Easy-to-use date and time input fields
- 🌍 **Timezone Selection**: Comprehensive list of all available timezones
- 🔍 **Search Functionality**: Search and filter timezones by name
- ⚡ **Real-time Conversion**: Automatic conversion as you change inputs
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Minimalistic UI**: Clean, modern design with smooth animations
- ✅ **Error Handling**: Proper validation and error messages

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd timezone-converter
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Select Date & Time**: Choose your desired date and time using the input fields
2. **Choose Source Timezone**: Select the timezone of your input time
3. **Choose Target Timezone**: Select the timezone you want to convert to
4. **View Result**: The converted time will automatically appear in the result section

### Search Timezones

- Use the search boxes above each timezone selector to quickly find specific timezones
- Search by city name, country, or timezone identifier
- Examples: "New York", "London", "Tokyo", "UTC", "GMT"

## Technical Details

### Built With

- **React 18**: Modern React with hooks and functional components
- **Vanilla CSS**: Custom styling with CSS3 features
- **JavaScript Date API**: Native browser APIs for timezone handling
- **Intl API**: Internationalization support for timezone data

### Key Components

- `TimezoneConverter`: Main component handling all conversion logic
- Real-time conversion using `useEffect` hooks
- Comprehensive error handling and validation
- Responsive design with mobile-first approach

### Browser Support

This application uses modern web APIs and is compatible with:
- Chrome 80+
- Firefox 72+
- Safari 13+
- Edge 80+

## Project Structure

```
timezone-converter/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TimezoneConverter.js
│   │   └── TimezoneConverter.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App (one-way operation)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
