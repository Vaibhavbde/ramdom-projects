let audioCtx = null;

export function createAudioContext(){
  if(audioCtx) return audioCtx;
  const C = window.AudioContext || window.webkitAudioContext;
  audioCtx = new C();
  return audioCtx;
}

function playOsc(type, freq, vol, dur){
  if(!audioCtx) createAudioContext();
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
  return new Promise(resolve=>{ osc.onended = ()=>resolve(); });
}

function playDistorted(freq, vol, dur){
  if(!audioCtx) createAudioContext();
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const biquad = audioCtx.createBiquadFilter();
  osc.type = 'square';
  osc.frequency.value = freq;
  biquad.type = 'highpass';
  biquad.frequency.value = freq / 2;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.01);
  gain.gain.linearRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(biquad);
  biquad.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
  return new Promise(resolve=>{ osc.onended = ()=>resolve(); });
}

export async function playEmotion(type, freq, vol, dur){
  if(!audioCtx) createAudioContext();
  vol = Math.max(0.01, Math.min(1, vol));
  dur = Math.max(0.05, Math.min(2, dur));
  if(type === 'bright') return playOsc('sawtooth', freq, vol, dur);
  if(type === 'major'){ await playOsc('sine', freq*0.8, vol*0.9, dur*0.7); return playOsc('sine', freq*1.0, vol*0.8, dur*0.5); }
  if(type === 'warm') return playOsc('triangle', freq, vol*0.8, dur);
  if(type === 'sine') return playOsc('sine', freq, vol*0.7, dur);
  if(type === 'minor'){ await playOsc('sine', freq*0.9, vol*0.7, dur*0.7); return playOsc('sine', freq*0.75, vol*0.6, dur*0.5); }
  if(type === 'distort') return playDistorted(freq, vol, dur);
  return playOsc('sine', freq, vol, dur);
}
