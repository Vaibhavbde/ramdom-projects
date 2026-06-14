import React, { useState } from 'react';

export default function SoundButton({ emoji, label, onPlay }){
  const [active, setActive] = useState(false);
  const handle = async ()=>{
    setActive(true);
    try{ await onPlay(); }catch(e){};
    setTimeout(()=>setActive(false),350);
  };
  return (
    <button className={'sound-btn'+(active?' active':'')} onClick={handle} aria-label={label}>
      <div className="emoji">{emoji}</div>
      <div className="lbl">{label}</div>
    </button>
  );
}
