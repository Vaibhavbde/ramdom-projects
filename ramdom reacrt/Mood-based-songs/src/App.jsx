import React, { useEffect, useRef, useState } from 'react';
import Mood from './components/Mood';
const App = () => {
  const [mood, setMood] = useState(null);
  const audioRef = useRef(null);

  const getBackgroundClass = () => {
    if (!mood) return 'bg-gradient-to-r from-purple-500 to-pink-500';

    switch (mood.color) {
      case 'blue':
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
      case 'grey':
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'red':
        return 'bg-gradient-to-r from-red-400 to-red-600';
      default:
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
    }
  };

  useEffect(() => {
    if (mood && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [mood]);
  return (
    <div
      className={`h-screen w-full flex flex-col justify-center items-center transition-all duration-500 ${getBackgroundClass()}`}
    >
      <h1 className="text-3xl"> mood based songs</h1>
      <Mood onMoodChange={setMood} />
      {mood && (
        <div>
          <h2 className="text-2xl m-3 mt-4">{mood.message}</h2>
          <audio src="" ref={audioRef} controls className="mt-7">
            <source src={mood.music} type="audio/mp3" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default App;
