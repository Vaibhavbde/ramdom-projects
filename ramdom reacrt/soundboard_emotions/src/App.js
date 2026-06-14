import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SoundButton from './components/SoundButton';
import { createAudioContext, playEmotion } from './utils/sound';
import './App.css';

const EMOTIONS = [
  { emoji: '🤩', label: 'Excited', type: 'bright', freq: 880 },
  { emoji: '😄', label: 'Happy', type: 'major', freq: 660 },
  { emoji: '🙂', label: 'Content', type: 'warm', freq: 520 },
  { emoji: '😐', label: 'Neutral', type: 'sine', freq: 440 },
  { emoji: '😔', label: 'Sad', type: 'minor', freq: 330 },
  { emoji: '😡', label: 'Angry', type: 'distort', freq: 260 },
  { emoji: '😴', label: 'Tired', type: 'soft', freq: 220 }
];

export default function App(){
  const [ctxReady, setCtxReady] = useState(false);
  const [volume, setVolume] = useState(()=>{
    const v = localStorage.getItem('sbe_volume');
    return v ? Number(v) : 0.6;
  });
  const [duration, setDuration] = useState(()=>{
    const d = localStorage.getItem('sbe_duration');
    return d ? Number(d) : 0.6;
  });

  useEffect(()=>{
    localStorage.setItem('sbe_volume', String(volume));
  },[volume]);

  useEffect(()=>{
    localStorage.setItem('sbe_duration', String(duration));
  },[duration]);

  const ensureCtx = ()=>{
    createAudioContext();
    setCtxReady(true);
  };

  return (
    <div className="container">
      <Header onStart={ensureCtx} />
      <div className="controls card">
        <div className="control-row">
          <label>Volume</label>
          <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e=>setVolume(Number(e.target.value))} />
          <span className="val">{Math.round(volume*100)}%</span>
        </div>
        <div className="control-row">
          <label>Duration</label>
          <input type="range" min="0.1" max="1.5" step="0.05" value={duration} onChange={e=>setDuration(Number(e.target.value))} />
          <span className="val">{duration.toFixed(2)}s</span>
        </div>
      </div>

      <div className="grid card">
        {EMOTIONS.map(e=>(
          <SoundButton key={e.label} emoji={e.emoji} label={e.label} onPlay={()=>playEmotion(e.type, e.freq, volume, duration)} />
        ))}
      </div>

      <footer className="footer">Built with Web Audio API · No external sounds</footer>
    </div>
  );
}
